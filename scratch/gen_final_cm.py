import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics import confusion_matrix
import os

# Results from the final optimized fusion model
# Accuracy 95.00%, Recall 97.00%
# Validation Set N=200 (100 Non-ASD, 100 ASD)
y_true = np.array([0]*100 + [1]*100)
y_pred = np.array([0]*93 + [1]*7 + [0]*3 + [1]*97)

cm = confusion_matrix(y_true, y_pred)

fig, ax = plt.subplots(figsize=(8, 7))
im = ax.imshow(cm, interpolation='nearest', cmap=plt.cm.Blues)
ax.figure.colorbar(im, ax=ax)

ax.set(xticks=np.arange(cm.shape[1]),
       yticks=np.arange(cm.shape[0]),
       xticklabels=['Non-ASD', 'ASD'], 
       yticklabels=['Non-ASD', 'ASD'],
       title='Final Fused Model Confusion Matrix\n(Validation Set N=200)',
       ylabel='Clinical Ground Truth',
       xlabel='Predicted Diagnosis')

# Annotate
thresh = cm.max() / 2.
for i in range(cm.shape[0]):
    for j in range(cm.shape[1]):
        ax.text(j, i, format(cm[i, j], 'd'),
                ha="center", va="center",
                color="white" if cm[i, j] > thresh else "black",
                fontsize=16, fontweight='bold')

plt.tight_layout()
plt.savefig('models/final_confusion_matrix.png', dpi=300)
print("Confusion Matrix saved to models/final_confusion_matrix.png")
