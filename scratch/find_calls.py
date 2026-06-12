import os
import re

pattern = re.compile(r'predict_vision')
for root, dirs, files in os.walk('.'):
    if '.venv' in root or 'node_modules' in root or '.git' in root:
        continue
    for file in files:
        if file.endswith('.py'):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    for i, line in enumerate(f, 1):
                        if pattern.search(line):
                            print(f"{path}:{i} - {line.strip()}")
            except Exception as e:
                pass
