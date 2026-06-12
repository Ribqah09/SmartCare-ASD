import os
import re

patterns = [re.compile(p, re.IGNORECASE) for p in [r"tracking", r"report_id", r"reportid"]]
paths_to_search = ["c:/SmartCare_ASD/app.py", "c:/SmartCare_ASD/schema.sql", "c:/SmartCare_ASD/pdf_report.py", "c:/SmartCare_ASD/report_service.py", "c:/SmartCare_ASD/frontend/src/pages/ResultsPage.jsx"]

for path in paths_to_search:
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            for idx, line in enumerate(f):
                for p in patterns:
                    if p.search(line):
                        print(f"{os.path.basename(path)} Line {idx+1}: {line.strip()}")
                        break
