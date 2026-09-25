import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "krishimitra-dev-secret-key-change-in-prod-98745")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "krishimitra-jwt-secret-key-super-secure-32145")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=int(os.getenv("JWT_EXPIRE_DAYS", 7)))

    # Database configuration (PostgreSQL supported, SQLite default for zero-setup local dev)
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", 
        f"sqlite:///{os.path.join(BASE_DIR, 'krishimitra.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Uploads configuration
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", os.path.join(BASE_DIR, "uploads"))
    MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", 16 * 1024 * 1024))  # 16 MB max
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

    # ML Model configuration
    MODEL_PATH = os.getenv(
        "MODEL_PATH", 
        os.path.join(BASE_DIR, "model", "crop_disease_model.keras")
    )
    DISEASES_DATA_PATH = os.getenv(
        "DISEASES_DATA_PATH", 
        os.path.join(BASE_DIR, "data", "diseases.json")
    )
    CLASS_INDICES_PATH = os.getenv(
        "CLASS_INDICES_PATH", 
        os.path.join(BASE_DIR, "data", "class_indices.json")
    )

    # External APIs
    OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

    # CORS
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
