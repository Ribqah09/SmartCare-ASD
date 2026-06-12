import re

with open("c:/SmartCare_ASD/app.py", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "api/screenings" in line or "start" in line.lower() and "screening" in line.lower() or "def start" in line.lower() or "insert into screenings" in line.lower():
        print(f"Line {i+1}: {line.strip()}")
