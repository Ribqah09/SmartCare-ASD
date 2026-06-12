import glob
import re

for path in glob.glob("c:/SmartCare_ASD/*.py"):
    with open(path, "r", encoding="utf-8") as f:
        for idx, line in enumerate(f):
            if "pdf_report" in line:
                print(f"{path} Line {idx+1}: {line.strip()}")
