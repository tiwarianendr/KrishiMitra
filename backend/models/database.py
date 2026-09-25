from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True, index=True)
    phone = db.Column(db.String(20), unique=True, nullable=True, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    preferred_language = db.Column(db.String(10), default="en")
    state = db.Column(db.String(100), nullable=True)
    district = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    predictions = db.relationship("Prediction", backref="user", lazy=True, cascade="all, delete-orphan")
    messages = db.relationship("AssistantMessage", backref="user", lazy=True, cascade="all, delete-orphan")

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "preferred_language": self.preferred_language,
            "state": self.state,
            "district": self.district,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class Prediction(db.Model):
    __tablename__ = "predictions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    image_filename = db.Column(db.String(255), nullable=False)
    crop = db.Column(db.String(50), nullable=False, index=True)
    disease = db.Column(db.String(120), nullable=False)
    disease_key = db.Column(db.String(100), nullable=False)
    confidence = db.Column(db.Float, nullable=False)
    is_healthy = db.Column(db.Boolean, default=False)
    severity = db.Column(db.String(20), default="Moderate")
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "image_filename": self.image_filename,
            "image_url": f"/api/uploads/{self.image_filename}",
            "crop": self.crop,
            "disease": self.disease,
            "disease_key": self.disease_key,
            "confidence": round(self.confidence, 2),
            "is_healthy": self.is_healthy,
            "severity": self.severity,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class AssistantMessage(db.Model):
    __tablename__ = "assistant_messages"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    session_id = db.Column(db.String(64), nullable=False, index=True)
    role = db.Column(db.String(20), nullable=False)  # "user" or "assistant"
    content = db.Column(db.Text, nullable=False)
    language = db.Column(db.String(10), default="en")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "session_id": self.session_id,
            "role": self.role,
            "content": self.content,
            "language": self.language,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
