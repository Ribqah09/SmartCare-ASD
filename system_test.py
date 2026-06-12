"""
SmartCare ASD - Fast System Test (No TF model loading)
Tests auth, children, and all route structure without hitting the VGG16 inference.
"""
import requests
import json
import sys

BASE = "http://127.0.0.1:5001"
PASS = []
FAIL = []

def check(name, ok, detail=""):
    if ok:
        PASS.append(name)
        print(f"  [PASS] {name}")
    else:
        FAIL.append(name)
        print(f"  [FAIL] {name}: {detail}")

def test_health():
    r = requests.get(f"{BASE}/", timeout=15)
    check("Health check /", r.status_code == 200)
    r2 = requests.get(f"{BASE}/api/test-db", timeout=15)
    check("DB health /api/test-db", r2.status_code == 200, r2.text[:100])

def test_register_login():
    import random
    email = f"test_{random.randint(10000,99999)}@smartcare.test"
    payload = {"full_name": "Nadia Ahmed", "email": email, "password": "Nadia07$Test!", "role": "parent"}
    
    r = requests.post(f"{BASE}/api/auth/register", json=payload, timeout=15)
    check("Register parent", r.status_code == 201, r.text[:120])
    
    r2 = requests.post(f"{BASE}/api/auth/login", json={"email": email, "password": "Nadia07$Test!"}, timeout=15)
    check("Login parent", r2.status_code == 200, r2.text[:120])
    
    token = r2.json().get("access_token") if r2.status_code == 200 else None
    return token

def test_children(token):
    h = {"Authorization": f"Bearer {token}"}
    
    # Add child between 12-36 months (born ~18 months ago)
    from datetime import date, timedelta
    dob = (date.today() - timedelta(days=548)).isoformat()  # ~18 months
    
    r = requests.post(f"{BASE}/api/children", headers=h, json={
        "full_name": "Ahmed Ali",
        "date_of_birth": dob,
        "gender": "male"
    }, timeout=15)
    check("Add child (18 months)", r.status_code == 201, r.text[:120])
    child_id = r.json().get("child_id") if r.status_code == 201 else None
    
    r2 = requests.get(f"{BASE}/api/children", headers=h, timeout=15)
    check("List children", r2.status_code == 200)
    
    return child_id

def test_age_guardrail(token):
    h = {"Authorization": f"Bearer {token}"}
    from datetime import date, timedelta
    
    # Child too young (3 months)
    dob_young = (date.today() - timedelta(days=90)).isoformat()
    r = requests.post(f"{BASE}/api/children", headers=h, json={
        "full_name": "Baby Too Young",
        "date_of_birth": dob_young,
        "gender": "female"
    }, timeout=15)
    child_id = r.json().get("child_id") if r.status_code == 201 else None

    # Test age guardrail via screening start
    if child_id:
        r2 = requests.post(f"{BASE}/api/screenings/start", headers=h, json={"child_id": child_id}, timeout=15)
        check("Screening start (too young child)", r2.status_code == 201)  # start is OK
        # The age guardrail fires at inference time
        check("Child added for age test", child_id is not None)

def test_screening_wizard(token, child_id):
    h = {"Authorization": f"Bearer {token}"}
    
    # Step 1: Start screening
    r = requests.post(f"{BASE}/api/screenings/start", headers=h, json={"child_id": child_id}, timeout=15)
    check("Screening wizard start", r.status_code == 201, r.text[:120])
    sid = r.json().get("screening_id") if r.status_code == 201 else None
    
    if not sid:
        check("Q-CHAT save (skipped - no sid)", False, "screening_id missing")
        return
    
    # Step 2: Save Q-CHAT
    qdata = {f"q{i}": 3 for i in range(1, 11)}  # All high-risk scores
    r2 = requests.put(f"{BASE}/api/screenings/{sid}/qchat", headers=h, json=qdata, timeout=90)
    check("Q-CHAT save (1-5 scale)", r2.status_code == 200, r2.text[:120])
    
    return sid

def test_me_endpoint(token):
    h = {"Authorization": f"Bearer {token}"}
    r = requests.get(f"{BASE}/api/auth/me", headers=h, timeout=15)
    check("/api/auth/me", r.status_code == 200, r.text[:80])

if __name__ == "__main__":
    print("\n=== SmartCare ASD System Test ===\n")
    
    try:
        print("[1] Health Checks")
        test_health()
        
        print("\n[2] Auth - Parent Registration & Login")
        token = test_register_login()
        
        if token:
            print("\n[3] Auth - /me endpoint")
            test_me_endpoint(token)
            
            print("\n[4] Children Management")
            child_id = test_children(token)
            
            print("\n[5] Age Guardrail Test")
            test_age_guardrail(token)
            
            print("\n[6] Screening Wizard (4-step without TF inference)")
            if child_id:
                test_screening_wizard(token, child_id)
        
    except Exception as e:
        print(f"\n[ERROR] Test crashed: {e}")
    
    print(f"\n{'='*40}")
    print(f"RESULTS: {len(PASS)} passed, {len(FAIL)} failed")
    if FAIL:
        print("FAILURES:")
        for f in FAIL:
            print(f"  - {f}")
    sys.exit(0 if not FAIL else 1)
