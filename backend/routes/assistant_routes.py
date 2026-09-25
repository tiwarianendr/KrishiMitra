import uuid
import logging
from flask import Blueprint, request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from backend.models.database import db, AssistantMessage
from backend.services.assistant_service import AssistantService

logger = logging.getLogger(__name__)
assistant_bp = Blueprint("assistant", __name__, url_prefix="/api/assistant")

@assistant_bp.route("/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    message = data.get("message", "").strip()
    session_id = data.get("session_id", "").strip() or str(uuid.uuid4())
    language = data.get("language", "en")

    if not message:
        return jsonify({"success": False, "error": "Message content cannot be empty."}), 400

    # Optional JWT
    user_id = None
    try:
        verify_jwt_in_request(optional=True)
        identity = get_jwt_identity()
        if identity:
            user_id = int(identity)
    except Exception:
        user_id = None

    try:
        # Save user message
        user_msg = AssistantMessage(
            user_id=user_id,
            session_id=session_id,
            role="user",
            content=message,
            language=language
        )
        db.session.add(user_msg)

        # Get response from AssistantService
        assistant_res = AssistantService.get_response(message, language_preference=language)
        reply_content = assistant_res.get("response", "")
        reply_lang = assistant_res.get("language", language)

        # Save assistant response
        bot_msg = AssistantMessage(
            user_id=user_id,
            session_id=session_id,
            role="assistant",
            content=reply_content,
            language=reply_lang
        )
        db.session.add(bot_msg)
        db.session.commit()

        return jsonify({
            "success": True,
            "data": {
                "response": reply_content,
                "language": reply_lang,
                "session_id": session_id,
                "source": assistant_res.get("source", "KrishiMitra Assistant")
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Assistant chat error: {e}", exc_info=True)
        return jsonify({"success": False, "error": "Failed to process question."}), 500

@assistant_bp.route("/history/<session_id>", methods=["GET"])
def get_session_history(session_id):
    messages = AssistantMessage.query.filter_by(session_id=session_id)\
        .order_by(AssistantMessage.created_at.asc()).all()

    return jsonify({
        "success": True,
        "data": {
            "session_id": session_id,
            "messages": [m.to_dict() for m in messages]
        }
    }), 200

@assistant_bp.route("/history/<session_id>", methods=["DELETE"])
def clear_session_history(session_id):
    try:
        AssistantMessage.query.filter_by(session_id=session_id).delete()
        db.session.commit()
        return jsonify({
            "success": True,
            "message": "Conversation history cleared successfully."
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": f"Failed to clear history: {str(e)}"}), 500
