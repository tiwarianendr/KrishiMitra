import io
from PIL import Image
from backend.services.model_service import get_model_service

def test_inference():
    print("Testing ModelService singleton...")
    service = get_model_service()
    print("Model loaded:", service.model is not None)
    print("Class indices count:", len(service.class_indices))
    print("Diseases info count:", len(service.diseases_info))

    # Create synthetic test leaf image in memory
    img = Image.new("RGB", (300, 300), color=(34, 139, 34))
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format="JPEG")
    img_byte_arr.seek(0)

    result = service.predict(img_byte_arr)
    print("Prediction Result:")
    print("  Crop:", result["crop"])
    print("  Disease:", result["disease"])
    print("  Confidence:", result["confidence"], "%")
    print("  Severity:", result["severity"])
    print("  Symptoms count:", len(result["symptoms"]))
    print("  Organic treatments count:", len(result["treatment"]["organic"]))
    print("Test passed successfully!")

if __name__ == "__main__":
    test_inference()
