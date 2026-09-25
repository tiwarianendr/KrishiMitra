from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models.database import db, Prediction
from backend.services.model_service import get_model_service

history_bp = Blueprint("history", __name__, url_prefix="/api/history")

@history_bp.route("", methods=["GET"])
@jwt_required()
def get_user_history():
    user_id = int(get_jwt_identity())
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)

    pagination = Prediction.query.filter_by(user_id=user_id)\
        .order_by(Prediction.created_at.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "success": True,
        "data": {
            "predictions": [p.to_dict() for p in pagination.items],
            "total": pagination.total,
            "pages": pagination.pages,
            "current_page": pagination.page
        }
    }), 200

@history_bp.route("/<int:prediction_id>", methods=["GET"])
@jwt_required()
def get_prediction_details(prediction_id):
    user_id = int(get_jwt_identity())
    item = Prediction.query.filter_by(id=prediction_id, user_id=user_id).first()
    if not item:
        return jsonify({"success": False, "error": "Prediction record not found."}), 404

    model_service = get_model_service()
    disease_info = model_service.diseases_info.get(item.disease_key, {})

    data = item.to_dict()
    data.update({
        "description": disease_info.get("description", ""),
        "description_hi": disease_info.get("description_hi", ""),
        "symptoms": disease_info.get("symptoms", []),
        "symptoms_hi": disease_info.get("symptoms_hi", []),
        "treatment": disease_info.get("treatment", {}),
        "prevention": disease_info.get("prevention", []),
        "next_steps": disease_info.get("next_steps", "")
    })

    return jsonify({
        "success": True,
        "data": data
    }), 200

@history_bp.route("/<int:prediction_id>", methods=["DELETE"])
@jwt_required()
def delete_prediction(prediction_id):
    user_id = int(get_jwt_identity())
    item = Prediction.query.filter_by(id=prediction_id, user_id=user_id).first()
    if not item:
        return jsonify({"success": False, "error": "Prediction record not found."}), 404

    try:
        db.session.delete(item)
        db.session.commit()
        return jsonify({
            "success": True,
            "message": "Prediction deleted successfully."
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": f"Failed to delete record: {str(e)}"}), 500
