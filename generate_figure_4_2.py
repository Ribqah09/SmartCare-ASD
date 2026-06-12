import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
import matplotlib.patches as patches

# Set random seed for reproducibility
np.random.seed(42)

# Generate simulated data for N = 5,866
N = 5866
N_train = int(N * 0.85)  # 4986
N_test = N - N_train     # 880

# -------------------------------------------------------------
# 1. Simulate Subplot 1 (Visual Feature Matrix Distribution)
# -------------------------------------------------------------
# Simulated visual features (e.g., normalized pixel intensities or embeddings)
# We use a mixture of Gaussians to simulate complex clinical feature spaces
train_features = np.concatenate([
    np.random.normal(0.35, 0.12, int(N_train * 0.6)),
    np.random.normal(0.68, 0.10, N_train - int(N_train * 0.6))
])
test_features = np.concatenate([
    np.random.normal(0.35, 0.12, int(N_test * 0.6)),
    np.random.normal(0.68, 0.10, N_test - int(N_test * 0.6))
])

# Clip values to [0, 1] to represent normalized pixel intensities
train_features = np.clip(train_features, 0, 1)
test_features = np.clip(test_features, 0, 1)

# -------------------------------------------------------------
# 2. Simulate Subplot 2 (Behavioral Score Vector Matrix)
# -------------------------------------------------------------
# Probabilities of Q-CHAT-10 scores (0 to 10) in clinical population
q_chat_probs = np.array([0.04, 0.06, 0.08, 0.12, 0.16, 0.18, 0.14, 0.10, 0.07, 0.04, 0.01])
q_chat_probs /= q_chat_probs.sum()  # Normalize

all_q_chat = np.random.choice(np.arange(11), size=N, p=q_chat_probs, replace=True)

# Stratify split to ensure perfect parity
train_q_chat, test_q_chat = train_test_split(
    all_q_chat, test_size=0.15, random_state=42, stratify=all_q_chat
)

# Calculate exact percentages for plotting
train_counts = np.bincount(train_q_chat, minlength=11)
test_counts = np.bincount(test_q_chat, minlength=11)

train_pct = (train_counts / N_train) * 100
test_pct = (test_counts / N_test) * 100

# -------------------------------------------------------------
# Setup Plot Layout & Aesthetics
# -------------------------------------------------------------
# Apply clean clinical aesthetics
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['Arial', 'Helvetica', 'DejaVu Sans']
plt.rcParams['text.color'] = '#1a1a1a'
plt.rcParams['axes.labelcolor'] = '#1a1a1a'
plt.rcParams['xtick.color'] = '#1a1a1a'
plt.rcParams['ytick.color'] = '#1a1a1a'

fig, axes = plt.subplots(1, 3, figsize=(16, 5), facecolor='white')

# Colors
navy_blue = '#2b5c8f'
slate_grey = '#475569'

# =============================================================
# PANEL A (Left): Visual Feature Matrix Distribution
# =============================================================
ax1 = axes[0]
ax1.set_facecolor('white')

# Plot continuous KDE curves
sns.kdeplot(train_features, ax=ax1, color=navy_blue, fill=True, alpha=0.15, linewidth=2, label=f'Training Array (85%, n={N_train})')
sns.kdeplot(test_features, ax=ax1, color=slate_grey, fill=True, alpha=0.10, linewidth=2, linestyle='--', label=f'Testing Holdout (15%, n={N_test})')

# Subplot styling
ax1.set_title('A: Visual Feature Matrix Distribution', fontsize=12, fontweight='bold', pad=15, loc='left')
ax1.set_xlabel('Normalized Feature Value (Pixel Intensity)', fontsize=10, labelpad=8)
ax1.set_ylabel('Probability Density', fontsize=10, labelpad=8)
ax1.set_xlim(0, 1)
ax1.spines['top'].set_visible(False)
ax1.spines['right'].set_visible(False)
ax1.spines['left'].set_color('#cccccc')
ax1.spines['bottom'].set_color('#cccccc')
ax1.grid(True, linestyle=':', alpha=0.4, color='#cccccc')
ax1.legend(frameon=True, facecolor='white', edgecolor='#e2e8f0', loc='upper left', fontsize=9)

# =============================================================
# PANEL B (Center): Behavioral Score Vector Matrix
# =============================================================
ax2 = axes[1]
ax2.set_facecolor('white')

# Side-by-side bar overlay to show perfect stratified parity
x = np.arange(11)
width = 0.35

ax2.bar(x - width/2, train_pct, width, label='Training Split', color=navy_blue, alpha=0.85, edgecolor='none')
ax2.bar(x + width/2, test_pct, width, label='Testing Holdout', color=slate_grey, alpha=0.75, edgecolor='none')

# Subplot styling
ax2.set_title('B: Behavioral Score Vector Matrix (Q-CHAT-10)', fontsize=12, fontweight='bold', pad=15, loc='left')
ax2.set_xlabel('Raw Q-CHAT-10 Score', fontsize=10, labelpad=8)
ax2.set_ylabel('Relative Frequency (%)', fontsize=10, labelpad=8)
ax2.set_xticks(x)
ax2.set_xlim(-0.6, 10.6)
ax2.set_ylim(0, 22)
ax2.spines['top'].set_visible(False)
ax2.spines['right'].set_visible(False)
ax2.spines['left'].set_color('#cccccc')
ax2.spines['bottom'].set_color('#cccccc')
ax2.grid(True, linestyle=':', alpha=0.4, color='#cccccc')
ax2.legend(frameon=True, facecolor='white', edgecolor='#e2e8f0', loc='upper right', fontsize=9)

# =============================================================
# PANEL C (Right): Multi-Modality Validation Space
# =============================================================
ax3 = axes[2]
ax3.set_facecolor('white')

# Draw schematic of the in-memory cache arrays to illustrate leakage mitigation
# We draw a grid where rows represent samples/batches and columns represent modalities.
grid_cols = 6
grid_rows = 10
block_width = 1.0
block_height = 0.8
padding = 0.2

# Set limits and hide standard axes
ax3.set_xlim(-0.5, grid_cols * (block_width + padding) + 0.5)
ax3.set_ylim(-0.5, grid_rows * (block_height + padding) + 0.5)
ax3.axis('off')

# Labels for columns
modalities = ['Vision', 'Behavioral', 'Metadata', 'Vision', 'Behavioral', 'Metadata']
for col in range(grid_cols):
    x_pos = col * (block_width + padding) + block_width / 2
    # Add title for modality columns
    if col < 3:
        ax3.text(x_pos, grid_rows * (block_height + padding) + 0.1, modalities[col], 
                 ha='center', va='bottom', fontsize=8, color='#4a5568', fontweight='semibold')
    else:
        ax3.text(x_pos, grid_rows * (block_height + padding) + 0.1, modalities[col], 
                 ha='center', va='bottom', fontsize=8, color='#4a5568', fontweight='semibold')

# Highlight modality groupings
ax3.text(1.1, grid_rows * (block_height + padding) + 0.6, 'Train Cache Array (Static)', 
         ha='center', va='bottom', fontsize=9, color=navy_blue, fontweight='bold')
ax3.text(4.7, grid_rows * (block_height + padding) + 0.6, 'Test Cache Array (Locked)', 
         ha='center', va='bottom', fontsize=9, color=slate_grey, fontweight='bold')

# Draw blocks for memory grid
for row in range(grid_rows):
    # Rows 0-7 are Training, Rows 8-9 are testing
    is_train = row < 8
    color = navy_blue if is_train else slate_grey
    alpha = 0.9 if is_train else 0.7
    
    y_pos = row * (block_height + padding)
    
    for col in range(grid_cols):
        # We separate train cache (cols 0-2) and test cache (cols 3-5) to show clean modular indexing
        is_col_train = col < 3
        
        # Don't mismatch: train rows map only to train cache, test rows map to test cache
        # Let's draw active blocks
        x_pos = col * (block_width + padding)
        
        # Only draw if they belong to their respective caches to show clean visual partitioning
        if (is_train and is_col_train) or (not is_train and not is_col_train):
            rect = patches.FancyBboxPatch(
                (x_pos, y_pos), block_width, block_height,
                boxstyle="round,pad=0.03",
                linewidth=0.5, edgecolor='#e2e8f0', facecolor=color, alpha=alpha
            )
            ax3.add_patch(rect)
        else:
            # Draw placeholder empty grid to show disjoint allocation
            rect = patches.FancyBboxPatch(
                (x_pos, y_pos), block_width, block_height,
                boxstyle="round,pad=0.03",
                linewidth=0.5, edgecolor='#cbd5e1', facecolor='#f8fafc', linestyle=':'
            )
            ax3.add_patch(rect)

# Draw isolation divider line
y_divider = 7.8 * (block_height + padding) + padding/2
ax3.axhline(y=y_divider, xmin=0.05, xmax=0.95, color='#ef4444', linestyle='--', linewidth=1.5)
ax3.text(grid_cols * (block_width + padding) / 2, y_divider + 0.1, 'STRICT ISOLATION BOUNDARY',
         ha='center', va='bottom', fontsize=8, color='#ef4444', fontweight='bold', bbox=dict(boxstyle='square,pad=0.2', facecolor='white', edgecolor='#ef4444', lw=0.5))

# Add title and descriptions
ax3.text(-0.5, grid_rows * (block_height + padding) + 1.2, 'C: Multi-Modality Validation Space', 
         fontsize=12, fontweight='bold', ha='left', va='center')

# Annotate training and testing spaces
ax3.text(-0.3, 4 * (block_height + padding), 'Training Hold\n(Static RAM)', 
         va='center', ha='right', fontsize=9, color=navy_blue, fontweight='bold')
ax3.text(grid_cols * (block_width + padding) + 0.3, 8.5 * (block_height + padding), 'Testing Hold\n(Locked RAM)', 
         va='center', ha='left', fontsize=9, color=slate_grey, fontweight='bold')

# Stochastic parameter convergence boundary label
ax3.text(grid_cols * (block_width + padding) / 2, -0.6, 'Zero Stochastic Parameter Cross-Contamination', 
         ha='center', va='top', fontsize=9, style='italic', color='#475569')

# Adjust layout and save the figure
plt.tight_layout()
plt.savefig('figure_4_2.png', dpi=300, bbox_inches='tight', facecolor='white', edgecolor='none')
print("Figure 4.2 successfully generated and saved as 'figure_4_2.png'")
