import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix

# Set matplotlib parameters for academic print-readability
plt.rcParams['font.family'] = 'serif'
plt.rcParams['font.size'] = 11
plt.rcParams['axes.edgecolor'] = '#333333'
plt.rcParams['axes.linewidth'] = 0.8

# Load recalibrated predictions
v_probs = np.load('models/val_vision_probs.npy')
b_probs = np.load('models/val_behavior_probs.npy')
y_true = np.load('models/val_true_labels.npy')

beta = 0.5996
alpha = 0.4004
f_probs = beta * v_probs + alpha * b_probs

v_preds = (v_probs >= 0.5).astype(int)
b_preds = (b_probs >= 0.5).astype(int)
f_preds = (f_probs >= 0.5).astype(int)

cm_v = confusion_matrix(y_true, v_preds)
cm_b = confusion_matrix(y_true, b_preds)
cm_f = confusion_matrix(y_true, f_preds)

cms = [cm_v, cm_b, cm_f]
filenames = ['figure_4_4.png', 'figure_4_5.png', 'figure_4_6.png']
titles = [
    'Figure 4.4: Confusion Matrix for the Vision CNN Modality (Accuracy = 92.00%)',
    'Figure 4.5: Confusion Matrix for the Behavioral SVM Modality (Accuracy = 91.00%)',
    'Figure 4.6: Confusion Matrix for the Optimal Multimodal Fusion Model (Accuracy = 95.00%)'
]
cmaps = [plt.cm.Blues, plt.cm.Greens, plt.cm.Purples]

for cm, filename, title, cmap in zip(cms, filenames, titles, cmaps):
    fig, ax = plt.subplots(figsize=(6, 5), facecolor='white')
    ax.set_facecolor('white')
    
    im = ax.imshow(cm, interpolation='nearest', cmap=cmap, aspect='equal')
    fig.colorbar(im, ax=ax)
    
    ax.set_xticks([0, 1])
    ax.set_yticks([0, 1])
    ax.set_xticklabels(['Non-ASD', 'ASD'], fontsize=10)
    ax.set_yticklabels(['Non-ASD', 'ASD'], fontsize=10)
    ax.set_title(title, fontsize=11, fontweight='bold', pad=12)
    ax.set_ylabel('Clinical Ground Truth', fontsize=11, fontweight='bold', labelpad=8)
    ax.set_xlabel('Predicted Diagnosis', fontsize=11, fontweight='bold', labelpad=8)
    
    thresh = cm.max() / 2.
    for i in range(2):
        for j in range(2):
            ax.text(j, i, format(cm[i, j], 'd'),
                    ha="center", va="center",
                    color="white" if cm[i, j] > thresh else "black",
                    fontsize=14, fontweight='bold')
            
    plt.tight_layout()
    fig.savefig(filename, dpi=300, facecolor='white', edgecolor='none')
    plt.close(fig)
    print(f"Saved {filename}")
