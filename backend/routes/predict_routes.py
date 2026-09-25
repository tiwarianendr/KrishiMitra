import os
import logging
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from backend.services.model_service import get_model_service
from backend.utils.helpers import is_allowed_file, save_uploaded_file
from backend.models.database import db, Prediction

logger = logging.getLogger(__name__)
predict_bp = Blueprint("predict", __name__, url_prefix="/api/predict")

@predict_bp.route("", methods=["POST"])
def predict_disease():
    """
    Core AI prediction endpoint.
    Accepts multipart/form-data with 'image' file and optional 'crop_hint'.
    """
    if "image" not in request.files:
        return jsonify({"success": False, "error": "No image file provided in request."}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"success": False, "error": "Empty filename provided."}), 400

    if not is_allowed_file(file.filename):
        return jsonify({
            "success": False, 
            "error": "Unsupported file format. Please upload JPG, PNG, or WEBP image."
        }), 400

    crop_hint = request.form.get("crop_hint", "").strip() or None

    try:
        # Save image securely
        upload_folder = current_app.config["UPLOAD_FOLDER"]
        unique_name, file_path = save_uploaded_file(file, upload_folder)

        # Run inference using singleton service
        model_service = get_model_service()
        prediction_result = model_service.predict(file_path, crop_hint=crop_hint)

        # Check if user is logged in (optional JWT)
        user_id = None
        try:
            verify_jwt_in_request(optional=True)
            identity = get_jwt_identity()
            if identity:
                user_id = int(identity)
        except Exception:
            user_id = None

        # Record prediction in database
        saved_prediction = Prediction(
            user_id=user_id,
            image_filename=unique_name,
            crop=prediction_result["crop"],
            disease=prediction_result["disease"],
            disease_key=prediction_result["disease_key"],
            confidence=prediction_result["confidence"],
            is_healthy=prediction_result["is_healthy"],
            severity=prediction_result["severity"]
        )
        db.session.add(saved_prediction)
        db.session.commit()

        prediction_result["id"] = saved_prediction.id
        prediction_result["image_url"] = f"/api/uploads/{unique_name}"

        return jsonify({
            "success": True,
            "message": "Prediction generated successfully.",
            "data": prediction_result
        }), 200

    except ValueError as ve:
        return jsonify({"success": False, "error": str(ve)}), 422
    except RuntimeError as re:
        return jsonify({"success": False, "error": str(re)}), 503
    except Exception as e:
        logger.error(f"Prediction failed with exception: {e}", exc_info=True)
        return jsonify({"success": False, "error": f"An error occurred during diagnosis: {str(e)}"}), 500

@predict_bp.route("/crops", methods=["GET"])
def get_supported_crops():
    """Returns list of supported crops and their cataloged diseases."""
    model_service = get_model_service()
    diseases = model_service.diseases_info

    crops_summary = {}
    for key, data in diseases.items():
        crop_name = data.get("crop", key.split("_")[0].capitalize())
        if crop_name not in crops_summary:
            crops_summary[crop_name] = {
                "name": crop_name,
                "name_hi": data.get("crop_hi", crop_name),
                "diseases": []
            }
        crops_summary[crop_name]["diseases"].append({
            "key": key,
            "name": data.get("disease", key),
            "name_hi": data.get("disease_hi", key),
            "is_healthy": data.get("is_healthy", False),
            "severity": data.get("severity", "Moderate")
        })

    return jsonify({
        "success": True,
        "data": {
            "total_crops": len(crops_summary),
            "total_conditions": len(diseases),
            "crops": list(crops_summary.values())
        }
    }), 200
