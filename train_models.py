"""
SmartCare ASD — Model Training Pipeline
========================================
Task 1: Transfer Learning (VGG16) + SVM (Q-CHAT-10)

Usage:
    python train_models.py --data_dir data/asd_dataset --epochs 25

Expected data directory layout:
    data/asd_dataset/
        train/
            asd/      <- images of children with ASD
            non_asd/  <- images of neurotypical children
        val/
            asd/
            non_asd/

Outputs:
    models/vgg16_asd.h5        <- CNN weights
    models/svm_qchat.pkl       <- SVM + scaler bundle
    models/training_history.json
    models/class_report.txt

Dependencies:
    pip install tensorflow scikit-learn opencv-python pillow matplotlib pandas
"""

import os
import cv2
import json
import pickle
import logging
import argparse
import numpy as np
import pandas as pd
from pathlib import Path

import matplotlib
matplotlib.use('Agg')   # non-interactive backend
import matplotlib.pyplot as plt

from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.metrics import (
    classification_report, confusion_matrix,
    roc_auc_score, recall_score, accuracy_score
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
)
logger = logging.getLogger('train_models')

# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTS
# ─────────────────────────────────────────────────────────────────────────────
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

MODELS_DIR    = Path('models')
IMG_SIZE      = (224, 224)
BATCH_SIZE    = 8
SEED          = 42
ASD_CLASS_IDX = 1    # index of ASD positive class in softmax output


# ─────────────────────────────────────────────────────────────────────────────
# SYNTHETIC PAKISTANI AUGMENTATION
# Adjusts gamma/hue to simulate indoor Karachi lighting + South Asian skin tones
# ─────────────────────────────────────────────────────────────────────────────

def adjust_gamma(img_bgr: np.ndarray, gamma: float = 1.0) -> np.ndarray:
    """OpenCV gamma correction (brightness simulation)."""
    inv_gamma = 1.0 / max(gamma, 1e-6)
    table = np.array([
        (i / 255.0) ** inv_gamma * 255
        for i in range(256)
    ], dtype=np.uint8)
    return cv2.LUT(img_bgr, table)


def pakistani_augment(img_bgr: np.ndarray) -> np.ndarray:
    """
    Hybrid Augmentation for Karachi indoor environment simulation.
    1. Adjust gamma to mimic tungsten/warm LED indoor lighting (gamma ~0.8–0.95)
    2. Shift HSV hue/saturation to simulate South Asian skin tone range
    3. Apply cv2.convertScaleAbs for contrast/saturation control
    """
    # Step 1 — warm lighting gamma correction
    gamma = np.random.uniform(0.78, 0.98)
    img_bgr = adjust_gamma(img_bgr, gamma)

    # Step 2 — HSV hue shift for South Asian skin tones (hue range ~10–25°)
    img_hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV).astype(np.float32)
    hue_shift = np.random.uniform(-8, 8)          # ±8 degrees
    sat_scale = np.random.uniform(0.88, 1.18)     # saturation variation
    img_hsv[:, :, 0] = (img_hsv[:, :, 0] + hue_shift) % 180
    img_hsv[:, :, 1] = np.clip(img_hsv[:, :, 1] * sat_scale, 0, 255)
    img_bgr = cv2.cvtColor(img_hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)

    # Step 3 — cv2.convertScaleAbs for contrast fine-tuning
    alpha = np.random.uniform(0.85, 1.15)         # contrast multiplier
    beta  = np.random.randint(-12, 12)            # brightness offset
    img_bgr = cv2.convertScaleAbs(img_bgr, alpha=alpha, beta=beta)

    return img_bgr


# ─────────────────────────────────────────────────────────────────────────────
# TASK 1a — VGG16 TRANSFER LEARNING
# ─────────────────────────────────────────────────────────────────────────────

def build_vgg16_model() -> 'tf.keras.Model':
    """
    Transfer Learning: VGG16 (ImageNet weights) + custom dense head.
    Base layers frozen; only the classification head is trained in phase 1.
    """
    import tensorflow as tf

    base = tf.keras.applications.VGG16(
        include_top=False,
        weights='imagenet',
        input_shape=(224, 224, 3),
    )
    # Phase 1: Freeze all base layers
    base.trainable = False
    logger.info("VGG16 base loaded — %d layers frozen.", len(base.layers))

    x = base.output
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dense(512, activation='relu', kernel_regularizer=tf.keras.regularizers.l2(0.01))(x)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Dropout(0.45)(x)
    x = tf.keras.layers.Dense(256, activation='relu', kernel_regularizer=tf.keras.regularizers.l2(0.01))(x)
    x = tf.keras.layers.Dropout(0.35)(x)
    out = tf.keras.layers.Dense(1, activation='sigmoid', name='asd_prob')(x)

    model = tf.keras.Model(inputs=base.input, outputs=out)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
        loss='binary_crossentropy',
        metrics=[
            'accuracy',
            tf.keras.metrics.AUC(name='auc'),
            tf.keras.metrics.Recall(name='recall'),
            tf.keras.metrics.Precision(name='precision'),
        ],
    )
    return model


def build_augmentation_pipeline(use_pakistani_aug: bool = True):
    """
    Returns a Keras ImageDataGenerator with:
    - Standard augmentations (rotation, zoom, flip, brightness)
    - Optional Pakistani synthetic augmentation as a preprocessing_function
    """
    import tensorflow as tf

    preprocess_fn = None
    if use_pakistani_aug:
        def augment_fn(img_rgb: np.ndarray) -> np.ndarray:
            """Convert RGB→BGR for OpenCV, augment, return RGB."""
            img_bgr = cv2.cvtColor(img_rgb.astype(np.uint8), cv2.COLOR_RGB2BGR)
            img_bgr = pakistani_augment(img_bgr)
            return cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB).astype(np.float32)
        preprocess_fn = augment_fn

    train_gen = tf.keras.preprocessing.image.ImageDataGenerator(
        rescale=1.0 / 255,
        rotation_range=20,
        width_shift_range=0.15,
        height_shift_range=0.15,
        shear_range=0.10,
        zoom_range=0.20,
        brightness_range=(0.75, 1.30),
        horizontal_flip=True,
        fill_mode='nearest',
        preprocessing_function=preprocess_fn,
    )
    val_gen = tf.keras.preprocessing.image.ImageDataGenerator(rescale=1.0 / 255)
    return train_gen, val_gen


def train_vgg16(data_dir: str, epochs: int = 25, fine_tune_epochs: int = 10):
    """
    Two-phase training:
      Phase 1: Train only the classification head (base frozen).
      Phase 2: Fine-tune last 6 VGG16 blocks with a very low LR.
    """
    import tensorflow as tf

    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    train_path = os.path.join(data_dir, 'train')
    val_path   = os.path.join(data_dir, 'valid')

    train_datagen, val_datagen = build_augmentation_pipeline(use_pakistani_aug=True)

    train_flow = train_datagen.flow_from_directory(
        train_path, target_size=IMG_SIZE, batch_size=BATCH_SIZE,
        class_mode='binary', seed=SEED, shuffle=True,
        classes=['non_autistic', 'autistic']
    )
    val_flow = val_datagen.flow_from_directory(
        val_path, target_size=IMG_SIZE, batch_size=BATCH_SIZE,
        class_mode='binary', seed=SEED, shuffle=False,
        classes=['non_autistic', 'autistic']
    )
    logger.info("Training samples: %d | Validation samples: %d",
                train_flow.n, val_flow.n)

    # ── Phase 1: Head Training ────────────────────────────────────────────────
    model = build_vgg16_model()
    callbacks = [
        tf.keras.callbacks.EarlyStopping(
            monitor='val_recall', patience=5,
            restore_best_weights=True, mode='max',
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss', factor=0.4, patience=3, min_lr=1e-7,
        ),
        tf.keras.callbacks.ModelCheckpoint(
            str(MODELS_DIR / 'vgg16_best.h5'),
            monitor='val_recall', save_best_only=True, mode='max',
        ),
    ]
    logger.info("=== PHASE 1: Head training for %d epochs ===", epochs)
    history1 = model.fit(
        train_flow,
        epochs=epochs,
        validation_data=val_flow,
        callbacks=callbacks,
        class_weight={0: 1.0, 1: 2.0},   # penalise false negatives (ASD)
    )

    # ── Phase 2: Fine-Tuning ──────────────────────────────────────────────────
    logger.info("=== PHASE 2: Fine-tuning block 5 for %d epochs ===",
                fine_tune_epochs)
    for layer in model.layers:
        if 'block5' in layer.name:
            layer.trainable = True

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-6),
        loss='binary_crossentropy',
        metrics=['accuracy',
                 tf.keras.metrics.AUC(name='auc'),
                 tf.keras.metrics.Recall(name='recall')],
    )
    history2 = model.fit(
        train_flow,
        epochs=fine_tune_epochs,
        validation_data=val_flow,
        callbacks=callbacks,
        class_weight={0: 1.0, 1: 2.0},
    )

    # ── Save & Evaluate ───────────────────────────────────────────────────────
    model.save(str(MODELS_DIR / 'vgg16_asd.h5'))
    logger.info("VGG16 model saved → models/vgg16_asd.h5")

    # Merge histories
    full_history = {}
    for k in history1.history:
        full_history[k] = history1.history[k] + history2.history.get(k, [])

    with open(MODELS_DIR / 'training_history.json', 'w') as f:
        json.dump(full_history, f, indent=2)

    # Collect validation predictions for optimize_fusion.py
    val_flow.reset()
    y_pred_prob = model.predict(val_flow, verbose=1).flatten()
    y_pred      = (y_pred_prob >= 0.5).astype(int)
    y_true      = val_flow.classes[val_flow.index_array if hasattr(val_flow, 'index_array') else ...]

    # Safer: re-iterate
    val_datagen_plain = tf.keras.preprocessing.image.ImageDataGenerator(rescale=1.0/255)
    val_flow_plain = val_datagen_plain.flow_from_directory(
        val_path, target_size=IMG_SIZE, batch_size=BATCH_SIZE,
        class_mode='binary', seed=SEED, shuffle=False,
        classes=['non_autistic', 'autistic']
    )
    y_true = val_flow_plain.classes
    y_pred_prob = model.predict(val_flow_plain, verbose=1).flatten()
    y_pred = (y_pred_prob >= 0.5).astype(int)

    acc  = accuracy_score(y_true, y_pred)
    rec  = recall_score(y_true, y_pred)
    auc  = roc_auc_score(y_true, y_pred_prob)
    report = classification_report(y_true, y_pred, target_names=['Non-ASD', 'ASD'])

    logger.info("CNN  |  Acc=%.4f  Recall=%.4f  AUC=%.4f", acc, rec, auc)
    logger.info("\n%s", report)

    with open(MODELS_DIR / 'cnn_report.txt', 'w') as f:
        f.write(f"CNN Accuracy : {acc:.4f}\n")
        f.write(f"CNN Recall   : {rec:.4f}\n")
        f.write(f"CNN AUC      : {auc:.4f}\n\n")
        f.write(report)

    # Save val predictions aligned with filenames (for optimizer)
    filenames = val_flow_plain.filenames
    np.save(str(MODELS_DIR / 'val_vision_probs.npy'),  y_pred_prob)
    np.save(str(MODELS_DIR / 'val_true_labels.npy'),   y_true)
    with open(MODELS_DIR / 'val_filenames.json', 'w') as f:
        json.dump(filenames, f, indent=2)

    _plot_cnn_history(full_history)
    return model, acc, rec, auc


def _plot_cnn_history(history: dict):
    fig, axes = plt.subplots(1, 3, figsize=(18, 5))
    fig.suptitle('VGG16 Transfer Learning — Training History', fontsize=14, fontweight='bold')

    for ax, metric, title in zip(
        axes,
        ['accuracy', 'recall', 'loss'],
        ['Accuracy', 'Recall (Sensitivity)', 'Loss'],
    ):
        if metric in history:
            ax.plot(history[metric],     label='Train', linewidth=2)
        val_key = f'val_{metric}'
        if val_key in history:
            ax.plot(history[val_key],    label='Validation', linewidth=2, linestyle='--')
        ax.set_title(title)
        ax.set_xlabel('Epoch')
        ax.legend()
        ax.grid(alpha=0.3)

    plt.tight_layout()
    plt.savefig(str(MODELS_DIR / 'cnn_training_history.png'), dpi=150)
    plt.close()
    logger.info("CNN training plot saved → models/cnn_training_history.png")


# ─────────────────────────────────────────────────────────────────────────────
# TASK 1b — SVM for Q-CHAT-10
# ─────────────────────────────────────────────────────────────────────────────

def train_svm(csv_path: str = None):
    """
    Train SVM (RBF kernel) on Q-CHAT-10 Likert scores (q1–q10, scale 0–4).
    If no CSV is provided, a synthetic dataset is generated for demonstration.

    CSV format expected:
        q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,label
        (label: 1=ASD, 0=Non-ASD)

    Output: models/svm_qchat.pkl (Pipeline: StandardScaler + SVC)
    """
    MODELS_DIR.mkdir(parents=True, exist_ok=True)

    if csv_path and os.path.exists(csv_path):
        logger.info("Loading Q-CHAT data from %s", csv_path)
        df = pd.read_csv(csv_path)
        if 'Q1' in df.columns:
            cols = [f'Q{i}' for i in range(1, 11)]
            label_col = 'ASD_Label'
        elif 'q1' in df.columns:
            cols = [f'q{i}' for i in range(1, 11)]
            label_col = 'label'
        else:
            raise ValueError("Columns Q1-Q10 or q1-q10 not found in CSV.")
        X = df[cols].values.astype(np.float32)
        y = df[label_col].values
    else:
        logger.warning("No Q-CHAT CSV found — generating synthetic dataset (800 samples).")
        rng = np.random.default_rng(SEED)
        n_asd     = 400
        n_non_asd = 400
        # ASD cases: higher Likert scores on Q-CHAT (indicating risk)
        X_asd     = rng.integers(2, 5, size=(n_asd,     10)).astype(np.float32)
        X_non     = rng.integers(0, 3, size=(n_non_asd, 10)).astype(np.float32)
        X = np.vstack([X_asd, X_non])
        y = np.array([1]*n_asd + [0]*n_non_asd)
        logger.info("Synthetic data: %d ASD + %d Non-ASD", n_asd, n_non_asd)

    from sklearn.model_selection import GridSearchCV
    # ── Pipeline: StandardScaler + SVC ────────────────────────────────────────
    base_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('svm',    SVC(kernel='rbf', class_weight='balanced', probability=True, random_state=SEED)),
    ])

    param_grid = {
        'svm__C': [0.1, 1.0, 10.0, 100.0],
        'svm__gamma': ['scale', 'auto', 0.001, 0.01, 0.1, 1.0],
    }

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=SEED)
    grid = GridSearchCV(base_pipeline, param_grid, cv=cv, scoring='recall', n_jobs=-1)
    grid.fit(X, y)
    
    pipeline = grid.best_estimator_
    logger.info("Best SVM parameters found by GridSearchCV: %s", grid.best_params_)

    # ── Cross-Validation ───────────────────────────────────────────────────────
    recall_scores   = cross_val_score(pipeline, X, y, cv=cv, scoring='recall')
    accuracy_scores = cross_val_score(pipeline, X, y, cv=cv, scoring='accuracy')
    auc_scores      = cross_val_score(pipeline, X, y, cv=cv, scoring='roc_auc')

    logger.info("SVM 5-Fold CV  |  Acc=%.4f±%.4f  Recall=%.4f±%.4f  AUC=%.4f±%.4f",
                accuracy_scores.mean(), accuracy_scores.std(),
                recall_scores.mean(),   recall_scores.std(),
                auc_scores.mean(),      auc_scores.std())

    # ── Final Fit on Full Data ─────────────────────────────────────────────────
    pipeline.fit(X, y)
    y_pred      = pipeline.predict(X)
    y_pred_prob = pipeline.predict_proba(X)[:, 1]

    report = classification_report(y, y_pred, target_names=['Non-ASD', 'ASD'])
    logger.info("SVM Final (full data):\n%s", report)

    # Save model bundle
    svm_bundle = {'pipeline': pipeline, 'feature_names': [f'q{i}' for i in range(1, 11)]}
    with open(MODELS_DIR / 'svm_qchat.pkl', 'wb') as f:
        pickle.dump(svm_bundle, f)
    logger.info("SVM model saved → models/svm_qchat.pkl")

    # Save validation predictions (full data for optimizer alignment)
    np.save(str(MODELS_DIR / 'val_behavior_probs.npy'), y_pred_prob)
    np.save(str(MODELS_DIR / 'val_behavior_labels.npy'), y)

    # Save report
    with open(MODELS_DIR / 'svm_report.txt', 'w') as f:
        f.write(f"SVM CV Recall   : {recall_scores.mean():.4f} ± {recall_scores.std():.4f}\n")
        f.write(f"SVM CV Accuracy : {accuracy_scores.mean():.4f} ± {accuracy_scores.std():.4f}\n")
        f.write(f"SVM CV AUC      : {auc_scores.mean():.4f} ± {auc_scores.std():.4f}\n\n")
        f.write(report)

    return pipeline, recall_scores.mean(), accuracy_scores.mean()


# ─────────────────────────────────────────────────────────────────────────────
# ENTRY POINT
# ─────────────────────────────────────────────────────────────────────────────

def parse_args():
    p = argparse.ArgumentParser(description='SmartCare ASD Model Training')
    p.add_argument('--data_dir',        default='data',
                   help='Root folder containing train/ and valid/ subfolders')
    p.add_argument('--qchat_csv',       default='dataset/behavioral/qchat_data.csv',
                   help='Path to Q-CHAT-10 CSV dataset (optional)')
    p.add_argument('--epochs',          type=int, default=25,
                   help='Epochs for VGG16 head training phase')
    p.add_argument('--fine_tune_epochs', type=int, default=10,
                   help='Epochs for VGG16 fine-tuning phase')
    p.add_argument('--skip_cnn',        action='store_true',
                   help='Skip CNN training (SVM only)')
    p.add_argument('--skip_svm',        action='store_true',
                   help='Skip SVM training (CNN only)')
    return p.parse_args()


if __name__ == '__main__':
    args = parse_args()
    results = {}

    if not args.skip_cnn:
        logger.info("=" * 60)
        logger.info("TASK 1a — VGG16 Transfer Learning")
        logger.info("=" * 60)
        _, cnn_acc, cnn_rec, cnn_auc = train_vgg16(
            args.data_dir, args.epochs, args.fine_tune_epochs
        )
        results['cnn'] = {'accuracy': cnn_acc, 'recall': cnn_rec, 'auc': cnn_auc}

    if not args.skip_svm:
        logger.info("=" * 60)
        logger.info("TASK 1b — SVM Q-CHAT-10 Training")
        logger.info("=" * 60)
        _, svm_rec, svm_acc = train_svm(args.qchat_csv)
        results['svm'] = {'accuracy': svm_acc, 'recall': svm_rec}

    with open(MODELS_DIR / 'train_results.json', 'w') as f:
        json.dump(results, f, indent=2)

    logger.info("=" * 60)
    logger.info("TRAINING COMPLETE. Results → models/train_results.json")
    logger.info("Next step: python optimize_fusion.py")
    logger.info("=" * 60)
