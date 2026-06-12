import os
import requests
import json

BASE_URL = "http://127.0.0.1:5001"

print("--- Testing API Standalone Fusion Screening ---")

# Step 1: Register parent
register_data = {
    "full_name": "Test Parent",
    "email": f"testparent_{os.getpid()}@example.com",
    "password": "Password123!",
    "role": "parent"
}

try:
    res = requests.post(f"{BASE_URL}/api/auth/register", json=register_data)
    print("Register response:", res.status_code, res.text)
except Exception as e:
    print("Register failed:", e)

# Step 2: Login parent
login_data = {
    "email": register_data["email"],
    "password": register_data["password"]
}

token = None
try:
    res = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    print("Login response:", res.status_code, res.text)
    if res.status_code == 200:
        token = res.json().get("access_token")
except Exception as e:
    print("Login failed:", e)

if token:
    headers = {"Authorization": f"Bearer {token}"}

    # Step 3: Add a child
    child_data = {
        "full_name": "Test Child",
        "date_of_birth": "2024-01-01",
        "gender": "male"
    }
    child_id = None
    try:
        res = requests.post(f"{BASE_URL}/api/children", headers=headers, json=child_data)
        print("Add child response:", res.status_code, res.text)
        if res.status_code == 201:
            child_id = res.json().get("child_id")
    except Exception as e:
        print("Add child failed:", e)

    if child_id:
        # Create a synthetic test face image using PIL
        # In real testing use an actual toddler face photo
        import numpy as np
        from PIL import Image, ImageDraw
        import io

        # Create a synthetic face-like image for testing
        img = Image.new('RGB', (224, 224), color=(240, 200, 160))  # skin tone background
        draw = ImageDraw.Draw(img)
        # Draw face oval
        draw.ellipse([40, 30, 184, 194], fill=(240, 200, 160), outline=(200, 160, 120), width=3)
        # Eyes
        draw.ellipse([75, 80, 100, 100], fill=(50, 50, 50))
        draw.ellipse([124, 80, 149, 100], fill=(50, 50, 50))
        # Nose
        draw.polygon([(112, 115), (105, 135), (119, 135)], fill=(210, 170, 130))
        # Mouth
        draw.arc([90, 135, 134, 165], start=0, end=180, fill=(180, 100, 100), width=3)
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=95)
        buf.seek(0)

        # Step 4: Process screening
        screen_data = {
            "child_id": str(child_id),
            "qchat": json.dumps([2, 3, 1, 4, 2, 3, 2, 1, 3, 4]),
            "image_consent": "false"
        }
        files = {
            "image": ("test_face.jpg", buf, "image/jpeg")
        }

        try:
            res = requests.post(f"{BASE_URL}/api/screen/process", headers=headers, data=screen_data, files=files)
            print("Process screening response:", res.status_code, res.text)
        except Exception as e:
            print("Process screening failed:", e)
else:
    print("Login token was not acquired.")
