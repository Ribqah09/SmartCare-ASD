import os
import re
import sys

# Set stdout to use utf-8 or fallback
sys.stdout.reconfigure(encoding='utf-8')

pattern = re.compile(r"SC-", re.IGNORECASE)
for root, dirs, files in os.walk("c:/SmartCare_ASD/frontend"):
    for file in files:
        if file.endswith((".js", ".jsx", ".ts", ".tsx")):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                for idx, line in enumerate(f):
                    if pattern.search(line):
                        print(f"{os.path.relpath(path, 'c:/SmartCare_ASD/frontend')} Line {idx+1}: {line.strip()}")
