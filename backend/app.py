import os
import sys
import logging

# Ensure project root is in sys.path when invoked directly
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from backend.config import Config
from backend.models.database import db
from backend.routes.auth_routes import auth_bp
from backend.routes.predict_routes import predict_bp
from backend.routes.history_routes import history_bp
from backend.routes.weather_routes import weather_bp
from backend.routes.location_routes import location_bp
from backend.routes.resource_routes import resource_bp
from backend.routes.assistant_routes import assistant_bp

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("KrishiMitra")

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    CORS(app, origins=app.config.get("CORS_ORIGINS", "*"), supports_credentials=True)
    jwt = JWTManager(app)
    db.init_app(app)

    # Ensure upload directory exists
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # Register API blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(predict_bp)
    app.register_blueprint(history_bp)
    app.register_blueprint(weather_bp)
    app.register_blueprint(location_bp)
    app.register_blueprint(resource_bp)
    app.register_blueprint(assistant_bp)

    # Static file serving for user uploaded plant images
    @app.route("/api/uploads/<path:filename>", methods=["GET"])
    def serve_upload(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    # System Health Check
    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "success": True,
            "status": "healthy",
            "service": "KrishiMitra API",
            "version": "1.0.0",
            "crops_supported": ["Potato", "Tomato", "Rice", "Wheat", "Pea"]
        }), 200

    # Error Handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"success": False, "error": "The requested API route was not found."}), 404

    @app.errorhandler(413)
    def request_entity_too_large(e):
        return jsonify({"success": False, "error": "File size exceeds maximum allowed limit (16MB)."}), 413

    @app.errorhandler(500)
    def internal_server_error(e):
        logger.error(f"Internal server error: {e}")
        return jsonify({"success": False, "error": "Internal server error occurred."}), 500

    # Create tables automatically
    with app.app_context():
        try:
            db.create_all()
            logger.info("Database tables initialized successfully.")
        except Exception as e:
            logger.error(f"Database initialization failed: {e}")

    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
