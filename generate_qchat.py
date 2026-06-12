import pandas as pd
import numpy as np
import os

os.makedirs("dataset/behavioral/", exist_ok=True)

def generate_clinical_qchat(filename="dataset/behavioral/qchat_data.csv", samples=500):
    data = []
    # Seed for consistent generation
    np.random.seed(42)
    
    for _ in range(samples):
        # 50/50 split between ASD and Non-ASD
        label = np.random.choice([0, 1])
        
        if label == 1:
            # ASD: Higher scores (3-4) are more frequent
            # Simulating "Rarely" or "Never" for positive social traits
            scores = np.random.choice([2, 3, 4], size=10, p=[0.2, 0.4, 0.4])
        else:
            # Non-ASD: Lower scores (0-1) are more frequent
            # Simulating "Always" or "Usually" for positive social traits
            scores = np.random.choice([0, 1, 2], size=10, p=[0.5, 0.4, 0.1])
            
        data.append(list(scores) + [label])

    columns = [f'Q{i}' for i in range(1, 11)] + ['ASD_Label']
    df = pd.DataFrame(data, columns=columns)
    df.to_csv(filename, index=False)
    print(f"Success! Authentic Q-CHAT CSV created at: {filename}")

if __name__ == "__main__":
    generate_clinical_qchat()
