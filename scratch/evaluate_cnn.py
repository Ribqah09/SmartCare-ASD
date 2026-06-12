import os, sys
import numpy as np
import tensorflow as tf
from pathlib import Path
from sklearn.model_selection import train_test_split

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

DATA_ROOT_OLD = Path('data')
DATA_ROOT_NEW = Path('data/AutismDataset/AutismDataset')
SEED = 42

def get_all_file_paths():
    label_map = {
        'Autistic': 1, 'autistic': 1,
        'Non_Autistic': 0, 'non_autistic': 0, 'Non-Autistic': 0
    }
    data_roots = [DATA_ROOT_OLD, DATA_ROOT_NEW]
    all_files = []
    all_labels = []
    for root in data_roots:
        if not root.exists(): continue
        for split in ['train', 'valid', 'test', 'val']:
            split_dir = root / split
            if not split_dir.exists(): continue
            for cls_folder in split_dir.iterdir():
                if not cls_folder.is_dir(): continue
                label = label_map.get(cls_folder.name)
                if label is None: continue
                files = list(cls_folder.glob('*.jpg')) + list(cls_folder.glob('*.png')) + list(cls_folder.glob('*.jpeg'))
                for f in files:
                    all_files.append(str(f))
                    all_labels.append(label)
    return np.array(all_files), np.array(all_labels)

paths, labels = get_all_file_paths()
p_train, p_val, l_train, l_val = train_test_split(
    paths, labels, test_size=0.15, stratify=labels, random_state=SEED)

print("Validation size:", len(l_val))

# Load VGG16 model
model = tf.keras.models.load_model('models/vgg16_asd.h5')
print("Loaded models/vgg16_asd.h5")

# Let's evaluate on a small batch of val set
# We can load image, preprocess and predict
def load_and_preprocess(path):
    img = tf.io.read_file(path)
    img = tf.image.decode_jpeg(img, channels=3)
    img = tf.image.resize(img, (224, 224))
    img = tf.cast(img, tf.float32) / 255.0
    return img

# To be fast, let's take 100 random samples from validation set
idx = np.arange(len(p_val))
np.random.shuffle(idx)
sample_paths = p_val[idx[:100]]
sample_labels = l_val[idx[:100]]

imgs = [load_and_preprocess(p) for p in sample_paths]
imgs = tf.stack(imgs)

preds = model.predict(imgs)
pred_labels = (preds >= 0.5).astype(int).flatten()
acc = np.mean(pred_labels == sample_labels)
print(f"Accuracy on 100 val samples: {acc:.4f}")
