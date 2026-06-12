with open("c:/SmartCare_ASD/app.py", "r", encoding="utf-8") as f:
    for idx, line in enumerate(f):
        if "generate_pdf" in line:
            print(f"Line {idx+1}: {line.strip()}")
