import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Default origins permitted for CORS (Local dev, Vercel production, and Vercel preview deploys)
DEFAULT_CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "https://krishi-mitra-woad.vercel.app",
    r"^https:\/\/.*\.vercel\.app$",
]

def parse_cors_origins(raw_env: str | None = None) -> list:
    if raw_env is None:
        raw_env = os.getenv("CORS_ORIGINS", "")
    raw_env = raw_env.strip()
    origins = list(DEFAULT_CORS_ORIGINS)
    if raw_env:
        if raw_env == "*":
            return ["*"]
        for origin in raw_env.split(","):
            cleaned = origin.strip()
            # Only include valid URL schemes, regexes, or wildcard
            if cleaned and (
                cleaned.startswith("http://")
                or cleaned.startswith("https://")
                or cleaned.startswith("^")
                or cleaned == "*"
            ):
                if cleaned not in origins:
                    origins.append(cleaned)
    return origins

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "krishimitra-dev-secret-key-change-in-prod-98745")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "krishimitra-jwt-secret-key-super-secure-32145")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=int(os.getenv("JWT_EXPIRE_DAYS", 7)))

    # Database configuration (PostgreSQL supported, SQLite default for zero-setup local dev)
    _db_url = os.getenv(
        "DATABASE_URL", 
        f"sqlite:///{os.path.join(BASE_DIR, 'krishimitra.db')}"
    )
    if _db_url.startswith("postgres://"):
        _db_url = _db_url.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_DATABASE_URI = _db_url
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
    CORS_ORIGINS = parse_cors_origins()

