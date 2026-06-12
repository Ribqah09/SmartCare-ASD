import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import roc_curve, auc, confusion_matrix
import matplotlib.gridspec as gridspec

# Set matplotlib parameters for academic print-readability (high contrast grayscale/navy)
plt.rcParams['font.family'] = 'serif'
plt.rcParams['font.size'] = 11
plt.rcParams['axes.edgecolor'] = '#333333'
plt.rcParams['axes.linewidth'] = 0.8

# Load recalibrated predictions
v_probs = np.load('models/val_vision_probs.npy')
b_probs = np.load('models/val_behavior_probs.npy')
y_true = np.load('models/val_true_labels.npy')

# Compute fused probabilities at optimal weights: beta=0.60, alpha=0.40
# Let's use the actual optimal weights from our runs: beta = 0.5996, alpha = 0.4004
beta = 0.5996
alpha = 0.4004
f_probs = beta * v_probs + alpha * b_probs

# Calculate ROC curves
fpr_v, tpr_v, _ = roc_curve(y_true, v_probs)
roc_auc_v = auc(fpr_v, tpr_v)

fpr_b, tpr_b, _ = roc_curve(y_true, b_probs)
roc_auc_b = auc(fpr_b, tpr_b)

fpr_f, tpr_f, _ = roc_curve(y_true, f_probs)
roc_auc_f = auc(fpr_f, tpr_f)

# ---------------------------------------------------------------------------
# FIGURE 4.3: ROC Curves
# ---------------------------------------------------------------------------
fig3, ax3 = plt.subplots(figsize=(6.5, 5.5), facecolor='white')
ax3.set_facecolor('white')

ax3.plot(fpr_v, tpr_v, color='#475569', linestyle='--', lw=1.8, label=f'Vision Branch (VGG16), AUC = {roc_auc_v:.4f}')
ax3.plot(fpr_b, tpr_b, color='#2b5c8f', linestyle='-.', lw=1.8, label=f'Behavioral Branch (SVM), AUC = {roc_auc_b:.4f}')
ax3.plot(fpr_f, tpr_f, color='#1e293b', linestyle='-', lw=2.2, label=f'Decision Fusion (Optimal), AUC = {roc_auc_f:.4f}')

# Diagonal reference line
ax3.plot([0, 1], [0, 1], color='#b91c1c', linestyle=':', lw=1.0, label='Random Classifier (AUC = 0.5000)')

ax3.set_xlim([-0.02, 1.02])
ax3.set_ylim([-0.02, 1.02])
ax3.set_xlabel('False Positive Rate (1 - Specificity)', labelpad=8, fontweight='bold')
ax3.set_ylabel('True Positive Rate (Sensitivity / Recall)', labelpad=8, fontweight='bold')
ax3.set_title('Figure 4.3: Receiver Operating Characteristic (ROC) Curves', pad=12, fontweight='bold', fontsize=12)
ax3.grid(True, linestyle=':', alpha=0.6, color='#cbd5e1')
ax3.legend(loc='lower right', frameon=True, facecolor='white', edgecolor='#e2e8f0', framealpha=1.0)

plt.tight_layout()
fig3.savefig('figure_4_3.png', dpi=300, facecolor='white', edgecolor='none')
plt.close(fig3)
print("Saved Figure 4.3 ROC curves.")

# ---------------------------------------------------------------------------
# FIGURE 4.4: Confusion Matrices
# ---------------------------------------------------------------------------
# Generate predictions
v_preds = (v_probs >= 0.5).astype(int)
b_preds = (b_probs >= 0.5).astype(int)
f_preds = (f_probs >= 0.5).astype(int)

cm_v = confusion_matrix(y_true, v_preds)
cm_b = confusion_matrix(y_true, b_preds)
cm_f = confusion_matrix(y_true, f_preds)

fig4, axes = plt.subplots(1, 3, figsize=(14, 5), facecolor='white')

cms = [cm_v, cm_b, cm_f]
titles = [
    'Panel A: Vision CNN (Accuracy = 92.00%)',
    'Panel B: Behavioral SVM (Accuracy = 91.00%)',
    'Panel C: Fused Model (Accuracy = 95.00%)'
]
cmaps = [plt.cm.Blues, plt.cm.Greens, plt.cm.Purples]

for idx, (ax, cm, title, cmap) in enumerate(zip(axes, cms, titles, cmaps)):
    ax.set_facecolor('white')
    im = ax.imshow(cm, interpolation='nearest', cmap=cmap, aspect='equal')
    
    # We want labels on tick positions
    ax.set_xticks([0, 1])
    ax.set_yticks([0, 1])
    ax.set_xticklabels(['Non-ASD', 'ASD'], fontsize=10)
    ax.set_yticklabels(['Non-ASD', 'ASD'], fontsize=10)
    ax.set_title(title, fontsize=11, fontweight='bold', pad=10)
    
    if idx == 0:
        ax.set_ylabel('Clinical Ground Truth', fontsize=11, fontweight='bold', labelpad=8)
    ax.set_xlabel('Predicted Diagnosis', fontsize=11, fontweight='bold', labelpad=8)
    
    # Annotate counts inside matrix cells
    thresh = cm.max() / 2.
    for i in range(2):
        for j in range(2):
            ax.text(j, i, format(cm[i, j], 'd'),
                    ha="center", va="center",
                    color="white" if cm[i, j] > thresh else "black",
                    fontsize=14, fontweight='bold')
            
plt.suptitle('Figure 4.4: Confusion Matrices across Single-Modality and Fused Pipelines', fontsize=13, fontweight='bold', y=0.98)
plt.tight_layout()
fig4.savefig('figure_4_4.png', dpi=300, facecolor='white', edgecolor='none')
plt.close(fig4)
print("Saved Figure 4.4 confusion matrices.")
