import io
import os
import pytest
from PIL import Image
from backend.app import create_app
from backend.config import Config
from backend.models.database import db

class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend", "test_uploads")

@pytest.fixture
def app():
    test_app = create_app(TestConfig)
    with test_app.app_context():
        db.create_all()
        yield test_app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def create_test_image_bytes():
    file_obj = io.BytesIO()
    img = Image.new("RGB", (250, 250), color=(60, 179, 113))
    img.save(file_obj, format="JPEG")
    file_obj.seek(0)
    return file_obj

def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert "Potato" in data["crops_supported"]
    assert "Tomato" in data["crops_supported"]

def test_get_supported_crops(client):
    response = client.get("/api/predict/crops")
    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert data["data"]["total_crops"] >= 5
    assert data["data"]["total_conditions"] >= 20

def test_auth_workflow(client):
    # Signup
    signup_payload = {
        "name": "Kisan Ramesh",
        "email_or_phone": "ramesh@kisan.in",
        "password": "strongPassword123",
        "preferred_language": "hi",
        "state": "Madhya Pradesh",
        "district": "Bhopal"
    }
    signup_res = client.post("/api/auth/signup", json=signup_payload)
    assert signup_res.status_code == 201
    signup_data = signup_res.get_json()
    assert signup_data["success"] is True
    assert "token" in signup_data["data"]
    token = signup_data["data"]["token"]

    # Login
    login_payload = {
        "email_or_phone": "ramesh@kisan.in",
        "password": "strongPassword123"
    }
    login_res = client.post("/api/auth/login", json=login_payload)
    assert login_res.status_code == 200
    login_data = login_res.get_json()
    assert login_data["success"] is True

    # Profile me
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    me_data = me_res.get_json()
    assert me_data["data"]["user"]["name"] == "Kisan Ramesh"
    assert me_data["data"]["user"]["preferred_language"] == "hi"

def test_predict_pipeline(client):
    # Register user
    signup_res = client.post("/api/auth/signup", json={
        "name": "Farmer Anita",
        "email_or_phone": "anita@farm.in",
        "password": "farmPassword321"
    })
    token = signup_res.get_json()["data"]["token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Upload test image
    img_bytes = create_test_image_bytes()
    data = {
        "image": (img_bytes, "tomato_test_leaf.jpg"),
        "crop_hint": "Tomato"
    }
    res = client.post("/api/predict", data=data, content_type="multipart/form-data", headers=headers)
    assert res.status_code == 200
    res_data = res.get_json()
    assert res_data["success"] is True
    pred = res_data["data"]
    assert "crop" in pred
    assert "disease" in pred
    assert "confidence" in pred
    assert "symptoms" in pred
    assert "treatment" in pred
    assert "prevention" in pred

    # Verify prediction saved in history
    history_res = client.get("/api/history", headers=headers)
    assert history_res.status_code == 200
    history_data = history_res.get_json()
    assert len(history_data["data"]["predictions"]) >= 1

def test_weather_endpoint(client):
    res = client.get("/api/weather?lat=28.6139&lon=77.2090")
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert "temperature" in data["data"]
    assert "humidity" in data["data"]
    assert "weather_condition" in data["data"]

def test_location_reverse_geocode(client):
    res = client.get("/api/location/reverse?lat=28.6139&lon=77.2090")
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert "city" in data["data"]

def test_resource_endpoint(client):
    res = client.get("/api/resources?lat=28.6139&lon=77.2090")
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert "official_helplines" in data["data"]
    assert len(data["data"]["official_helplines"]) > 0

def test_assistant_chat(client):
    # Test English query
    en_res = client.post("/api/assistant/chat", json={
        "message": "My tomato leaves are turning brown. What should I do?",
        "language": "en"
    })
    assert en_res.status_code == 200
    en_data = en_res.get_json()
    assert en_data["success"] is True
    assert "Blight" in en_data["data"]["response"] or "tomato" in en_data["data"]["response"].lower()

    # Test Hindi query
    hi_res = client.post("/api/assistant/chat", json={
        "message": "गेहूं के पत्ते पीले हो रहे हैं, क्या करूं?",
        "language": "hi"
    })
    assert hi_res.status_code == 200
    hi_data = hi_res.get_json()
    assert hi_data["success"] is True
    assert "रतुआ" in hi_data["data"]["response"] or "गेहूं" in hi_data["data"]["response"]
