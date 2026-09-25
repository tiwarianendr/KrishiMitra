import io
import requests
from PIL import Image

BASE_URL = "http://localhost:3000/api"

def run_e2e_verification():
    print("=== STARTING KRISHIMITRA FULL END-TO-END VERIFICATION ===")

    # 1. Health check
    print("\n[1/10] Verifying Health Check...")
    r = requests.get(f"{BASE_URL}/health")
    assert r.status_code == 200, f"Health check failed: {r.text}"
    print("  -> Health Check OK:", r.json()["status"])

    # 2. Supported Crops
    print("\n[2/10] Verifying Supported Crops...")
    r = requests.get(f"{BASE_URL}/predict/crops")
    assert r.status_code == 200
    crops_data = r.json()["data"]
    print(f"  -> Total Crops: {crops_data['total_crops']}, Total Conditions: {crops_data['total_conditions']}")
    assert crops_data["total_crops"] >= 5

    # 3. User Signup
    print("\n[3/10] Verifying User Registration...")
    signup_data = {
        "name": "Kisan Baldev Singh",
        "email_or_phone": "baldev.kisan@gmail.com",
        "password": "punjabFarmer2026",
        "preferred_language": "pa",
        "state": "Punjab",
        "district": "Ludhiana"
    }
    r = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
    if r.status_code == 409:
        # Already exists from previous run, login instead
        print("  -> User already exists, logging in...")
        login_res = requests.post(f"{BASE_URL}/auth/login", json={
            "email_or_phone": signup_data["email_or_phone"],
            "password": signup_data["password"]
        })
        token = login_res.json()["data"]["token"]
    else:
        assert r.status_code == 201, f"Signup failed: {r.text}"
        token = r.json()["data"]["token"]
    
    headers = {"Authorization": f"Bearer {token}"}
    print("  -> Auth Token Acquired.")

    # 4. User Profile
    print("\n[4/10] Verifying User Profile...")
    r = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    assert r.status_code == 200
    user = r.json()["data"]["user"]
    print(f"  -> Logged in as: {user['name']} ({user['email'] or user['phone']})")

    # 5. Image Prediction Pipeline
    print("\n[5/10] Verifying Image Prediction Pipeline (POST /api/predict)...")
    img = Image.new("RGB", (320, 320), color=(46, 139, 87))
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format="JPEG")
    img_byte_arr.seek(0)

    files = {"image": ("wheat_leaf_sample.jpg", img_byte_arr, "image/jpeg")}
    data = {"crop_hint": "Wheat"}
    r = requests.post(f"{BASE_URL}/predict", files=files, data=data, headers=headers)
    assert r.status_code == 200, f"Prediction failed: {r.text}"
    pred = r.json()["data"]
    pred_id = pred["id"]
    print(f"  -> Diagnosis: {pred['crop']} – {pred['disease']} ({pred['confidence']}%)")
    print(f"  -> Severity: {pred['severity']}, Organic Treatments: {len(pred['treatment']['organic'])}")

    # 6. Prediction History
    print("\n[6/10] Verifying Diagnostic History (GET /api/history)...")
    r = requests.get(f"{BASE_URL}/history", headers=headers)
    assert r.status_code == 200
    history_items = r.json()["data"]["predictions"]
    assert len(history_items) > 0
    print(f"  -> Found {len(history_items)} saved prediction(s) in user history.")

    # 7. Prediction Details
    print(f"\n[7/10] Verifying Specific Record Details (GET /api/history/{pred_id})...")
    r = requests.get(f"{BASE_URL}/history/{pred_id}", headers=headers)
    assert r.status_code == 200
    details = r.json()["data"]
    assert details["crop"] == pred["crop"]
    print(f"  -> Successfully retrieved full details for record #{pred_id}")

    # 8. Weather Telemetry
    print("\n[8/10] Verifying Live Weather Telemetry (GET /api/weather)...")
    r = requests.get(f"{BASE_URL}/weather?lat=30.9010&lon=75.8573&location_name=Ludhiana")
    assert r.status_code == 200
    w = r.json()["data"]
    print(f"  -> Location: {w['location']}, Temp: {w['temperature']}°C, Condition: {w['weather_condition']}, Source: {w['source']}")

    # 9. Nearby Resources
    print("\n[9/10] Verifying Nearby Agricultural Resources (GET /api/resources)...")
    r = requests.get(f"{BASE_URL}/resources?lat=30.9010&lon=75.8573")
    assert r.status_code == 200
    res_data = r.json()["data"]
    print(f"  -> Verified Helplines: {len(res_data['official_helplines'])}, Nearby Places: {res_data['count_nearby']}")

    # 10. AI Farmer Assistant Chat
    print("\n[10/10] Verifying Multilingual AI Farmer Assistant (/api/assistant/chat)...")
    # English
    r1 = requests.post(f"{BASE_URL}/assistant/chat", json={
        "message": "My tomato leaves have dark brown spots with concentric circles. How to cure?",
        "session_id": "test_session_1",
        "language": "en"
    }, headers=headers)
    assert r1.status_code == 200
    print("  -> English Response:", r1.json()["data"]["response"][:100], "...")

    # Hindi
    r2 = requests.post(f"{BASE_URL}/assistant/chat", json={
        "message": "धान में जीवाणु झुलसा के क्या लक्षण हैं?",
        "session_id": "test_session_1",
        "language": "hi"
    }, headers=headers)
    assert r2.status_code == 200
    hi_resp = r2.json()["data"]["response"]
    print("  -> Hindi Response:", hi_resp[:100].encode("ascii", "replace").decode("ascii"), "...")

    print("\n=== ALL 10 END-TO-END VERIFICATION STEPS PASSED SUCCESSFULLY! ===")

if __name__ == "__main__":
    run_e2e_verification()
