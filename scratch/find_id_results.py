with open("c:/SmartCare_ASD/frontend/src/pages/ResultsPage.jsx", "r", encoding="utf-8") as f:
    for idx, line in enumerate(f):
        if "screening_id" in line or "screeningId" in line or "id:" in line.lower() or "result.id" in line:
            print(f"Line {idx+1}: {line.strip()}")
