import matplotlib.pyplot as plt

# Set matplotlib parameters for academic print-readability
plt.rcParams['font.family'] = 'serif'
plt.rcParams['font.size'] = 9.5
plt.rcParams['axes.edgecolor'] = '#333333'
plt.rcParams['axes.linewidth'] = 0.8

# Create figure
fig, ax = plt.subplots(figsize=(8.5, 6.5), facecolor='white')
ax.set_facecolor('white')

# Set limits
ax.set_xlim(0, 10)
ax.set_ylim(0, 11)

# Actors and systems positions (X-coordinates)
positions = {
    'Parent': 1.5,
    'React Client': 4.0,
    'Google IdP': 6.5,
    'Flask Backend': 9.0
}

# Draw vertical lifelines
for name, x in positions.items():
    ax.plot([x, x], [1.0, 9.5], color='#6b7280', linestyle='--', linewidth=1.0, zorder=1)

# Draw actor/system headers (boxes)
headers = [
    ('Parent / Caregiver\n(User)', 'Parent', '#f8fafc', '#1e293b'),
    ('React Frontend\n(Vite Client)', 'React Client', '#f0fdfa', '#0f766e'),
    ('Google Identity\nServer (IdP)', 'Google IdP', '#fdf2f8', '#be185d'),
    ('Flask Backend\n(Python API)', 'Flask Backend', '#f1f5f9', '#334155')
]

for title, key, bg_color, border_color in headers:
    x = positions[key]
    # Draw colored rectangle
    rect = plt.Rectangle((x - 0.9, 9.5), 1.8, 1.0, facecolor=bg_color, edgecolor=border_color, linewidth=1.5, zorder=3)
    ax.add_patch(rect)
    # Add text
    ax.text(x, 10.0, title, ha='center', va='center', color='#0f172a', fontsize=9.5, fontweight='bold', zorder=4)

# Sequence steps (Y-coordinates, source, destination, label, style)
steps = [
    (8.7, 'Parent', 'React Client', '1. Click Google Sign-In Button', '->', '#0f172a'),
    (8.0, 'React Client', 'Google IdP', '2. Request OAuth2 Code / ID Token', '->', '#0d9488'),
    (7.3, 'Google IdP', 'Parent', '3. Present Consent / Login Screen', '->', '#be185d'),
    (6.6, 'Parent', 'Google IdP', '4. User Authenticates & Consents', '->', '#0f172a'),
    (5.9, 'Google IdP', 'React Client', '5. Return Signed JWT (ID Token)', '->', '#be185d'),
    (5.2, 'React Client', 'Flask Backend', '6. POST /api/auth/google {id_token}', '->', '#0d9488'),
    # Self-loop for backend validation
    (4.3, 'Flask Backend', 'Flask Backend', '7. Cryptographic RS256 Verification\n    & Aud/Exp Claims Checks', 'self', '#334155'),
    (3.4, 'Flask Backend', 'React Client', '8. Return 200 OK + Session JWT', '->', '#334155'),
    (2.5, 'React Client', 'Parent', '9. Render Dashboard & Grant Access', '->', '#0d9488')
]

# Draw steps
for y, src, dest, label, arrow_style, color in steps:
    x_src = positions[src]
    x_dest = positions[dest]
    
    if arrow_style == 'self':
        # Self loop representation
        ax.plot([x_src, x_src + 0.5, x_src + 0.5, x_src], [y + 0.3, y + 0.3, y - 0.3, y - 0.3], color=color, linewidth=1.5, zorder=2)
        ax.annotate('', xy=(x_src, y - 0.3), xytext=(x_src + 0.2, y - 0.3),
                    arrowprops=dict(arrowstyle="->", color=color, lw=1.5))
        ax.text(x_src + 0.6, y, label, va='center', ha='left', color='#1e293b', fontsize=8.5, fontweight='bold')
    else:
        # Straight arrow
        dx = x_dest - x_src
        # Draw arrow line
        ax.annotate('', xy=(x_dest, y), xytext=(x_src, y),
                    arrowprops=dict(arrowstyle="->", color=color, lw=1.5, shrinkA=0, shrinkB=0))
        # Add label text above line
        ax.text(x_src + dx/2, y + 0.15, label, va='bottom', ha='center', color='#1e293b', fontsize=8.5, fontweight='bold')

# Styling adjustments
ax.axis('off')
ax.set_title('Figure 4.9: Asynchronous Google OAuth2 Token Exchange Lifecycle', fontsize=12, fontweight='bold', pad=15, color='#0f172a')

# Footer / caption placeholder
ax.text(5.0, 0.5, 'Smart Care Integration Layer Authentication Flow', ha='center', va='center', color='#475569', fontsize=9, style='italic')

plt.tight_layout()
fig.savefig('figure_4_9.png', dpi=300, facecolor='white')
plt.close(fig)
print("Saved figure_4_9.png")
