import matplotlib.pyplot as plt
import numpy as np

# Set font family globally for academic style
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['Arial', 'Liberation Sans', 'DejaVu Sans']
plt.rcParams['pdf.fonttype'] = 42
plt.rcParams['ps.fonttype'] = 42

def generate_figure_4_3():
    """Generates Figure 4.3: Cohort Distribution and Class Symmetry Chart"""
    # Dataset values
    categories = ['Primary Baseline Cohort\n(data)', 'Expanded Cohort\n(AutismDataset)']
    asd_positive = [1463, 1470]
    non_asd = [1463, 1470]
    
    x = np.arange(len(categories))
    width = 0.35  # width of the bars
    
    # Establish academic styling (plain white background, black axes)
    fig, ax = plt.subplots(figsize=(8, 6.5), facecolor='white')
    ax.set_facecolor('white')
    
    # Grid: very subtle horizontal lines only
    ax.grid(axis='y', linestyle='--', linewidth=0.5, color='#e2e8f0', zorder=0)
    
    # Plot bars
    rects1 = ax.bar(x - width/2, asd_positive, width, label='ASD-Positive', 
                    color='#2b5c8f', edgecolor='#1a365d', linewidth=1.2, zorder=3)
    rects2 = ax.bar(x + width/2, non_asd, width, label='Typical (Non-ASD)', 
                    color='#778ca3', edgecolor='#4b6584', linewidth=1.2, zorder=3)
    
    # Labels and Titles
    ax.set_ylabel('Sample Count', fontsize=12, fontweight='bold', labelpad=10)
    ax.set_title('Figure 4.3: Cohort Distribution and Class Symmetry Analysis', 
                 fontsize=13, fontweight='bold', pad=15)
    ax.set_xticks(x)
    ax.set_xticklabels(categories, fontsize=11)
    ax.set_ylim(0, 1750)
    
    # Add values on top of bars
    def autolabel(rects):
        for rect in rects:
            height = rect.get_height()
            ax.annotate(f'{height}',
                        xy=(rect.get_x() + rect.get_width() / 2, height),
                        xytext=(0, 3),  # 3 points vertical offset
                        textcoords="offset points",
                        ha='center', va='bottom', fontsize=10, fontweight='semibold')
            
    autolabel(rects1)
    autolabel(rects2)
    
    # Legend
    ax.legend(loc='upper right', frameon=True, facecolor='white', edgecolor='#e2e8f0', fontsize=10)
    
    # Academic borders
    for spine in ['top', 'right']:
        ax.spines[spine].set_visible(False)
    for spine in ['left', 'bottom']:
        ax.spines[spine].set_color('#4a5568')
        ax.spines[spine].set_linewidth(1.2)
        
    plt.tight_layout()
    plt.savefig('models/figure4_3.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("Figure 4.3 generated successfully.")


def generate_figure_4_4():
    """Generates Figure 4.4: In-Memory Train-Test Data Partitioning Flow Chart"""
    fig, ax = plt.subplots(figsize=(11, 6), facecolor='white')
    ax.set_facecolor('white')
    
    # Set coordinates range
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 6)
    
    # Helper to draw boxes
    def draw_box(x1, y1, x2, y2, text, title="", bg_color="#f8fafc", edge_color="#64748b", text_color="#1e293b", is_dashed=False):
        style = "dashed" if is_dashed else "solid"
        rect = plt.Rectangle((x1, y1), x2-x1, y2-y1, facecolor=bg_color, edgecolor=edge_color, 
                             linewidth=1.5, linestyle=style, zorder=3)
        ax.add_patch(rect)
        
        # Text wrapping
        cx = (x1 + x2) / 2
        cy = (y1 + y2) / 2
        
        if title:
            ax.text(cx, cy + 0.3, title, ha='center', va='center', fontsize=11, fontweight='bold', color=text_color, zorder=4)
            ax.text(cx, cy - 0.2, text, ha='center', va='center', fontsize=9.5, color=text_color, zorder=4)
        else:
            ax.text(cx, cy, text, ha='center', va='center', fontsize=10, color=text_color, zorder=4)

    # Helper to draw arrows
    def draw_arrow(x_start, y_start, x_end, y_end, color="#475569"):
        ax.annotate("", xy=(x_end, y_end), xytext=(x_start, y_start),
                    arrowprops=dict(arrowstyle="->", color=color, lw=2, shrinkA=0, shrinkB=0, 
                                    patchA=None, patchB=None, connectionstyle="arc3"), zorder=2)

    # Helper to draw branching arrows
    def draw_branch_arrows():
        # Line from split box to split point
        ax.plot([6.2, 6.7], [3.0, 3.0], color="#475569", lw=2, zorder=2)
        # Branch splitting up and down
        ax.plot([6.7, 6.7], [1.5, 4.5], color="#475569", lw=2, zorder=2)
        # Horizontal lines to target boxes
        draw_arrow(6.7, 4.5, 7.2, 4.5, color="#475569")
        draw_arrow(6.7, 1.5, 7.2, 1.5, color="#475569")

    # 1. Input Box
    draw_box(0.5, 2.1, 3.0, 3.9, 
             text="Total Population\nN = 5,866 Samples\n(2,933 ASD / 2,933 Typical)", 
             title="Unified Ingestion", bg_color="#f1f5f9", edge_color="#475569")
    
    # Arrow to Split Box
    draw_arrow(3.0, 3.0, 3.7, 3.0)
    
    # 2. Partitioning Split Box
    draw_box(3.7, 2.1, 6.2, 3.9,
             text="Stratified Random Split\nRatio: 85% / 15%\nSeed: 42 (Repeatable)",
             title="Dataset Partitioning", bg_color="#f1f5f9", edge_color="#475569")
    
    # Branching arrows to train/test subsets
    draw_branch_arrows()
    
    # 3. Branch A Box (Training Path)
    draw_box(7.2, 3.6, 11.5, 5.4,
             text="N ≈ 4,986 Samples\nOn-The-Fly Augmentation\n(Flips, Brightness, Contrast)\nRAM Generator Execution",
             title="Training Subset (85%)", bg_color="#eff6ff", edge_color="#2b5c8f", text_color="#1e3a8a")
    
    # 4. Branch B Box (Validation Path with Isolation Border)
    draw_box(7.2, 0.6, 11.5, 2.4,
             text="N = 880 Samples\nStrict In-Memory Caching\nRaw Format (No Augmentation)\nZero-Leakage Guard",
             title="Test/Validation Subset (15%)", bg_color="#fcfcfc", edge_color="#b91c1c", text_color="#7f1d1d")
    
    # Draw dashed box representing the memory isolation boundary
    rect_iso = plt.Rectangle((7.0, 0.3), 4.7, 2.5, facecolor="none", edgecolor="#ef4444", 
                             linewidth=1.5, linestyle="--", zorder=1)
    ax.add_patch(rect_iso)
    ax.text(9.35, 0.45, "STRICT VECTOR ISOLATION MEMORY BOUNDARY", ha='center', va='center',
            fontsize=8, fontweight='bold', color='#b91c1c', bbox=dict(facecolor='white', edgecolor='none', pad=2))

    # Clean axes for schematic layout
    ax.set_axis_off()
    ax.set_title("Figure 4.4: In-Memory Train-Test Data Partitioning Flow Chart", 
                 fontsize=13, fontweight='bold', pad=10)
    
    plt.tight_layout()
    plt.savefig('models/figure4_4.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("Figure 4.4 generated successfully.")


if __name__ == '__main__':
    generate_figure_4_3()
    generate_figure_4_4()
