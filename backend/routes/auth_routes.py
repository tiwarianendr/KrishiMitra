from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from backend.models.database import db, User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json() or {}
    name = data.get("name", "").strip()
    identifier = data.get("email_or_phone", "").strip()
    password = data.get("password", "")
    language = data.get("preferred_language", "en")
    state = data.get("state", "").strip()
    district = data.get("district", "").strip()

    if not name:
        return jsonify({"success": False, "error": "Full name is required."}), 400
    if not identifier:
        return jsonify({"success": False, "error": "Email or mobile phone number is required."}), 400
    if not password or len(password) < 6:
        return jsonify({"success": False, "error": "Password must be at least 6 characters long."}), 400

    # Determine if email or phone
    is_email = "@" in identifier
    email = identifier if is_email else None
    phone = None if is_email else identifier

    # Check for existing user
    if email and User.query.filter_by(email=email).first():
        return jsonify({"success": False, "error": "An account with this email already exists."}), 409
    if phone and User.query.filter_by(phone=phone).first():
        return jsonify({"success": False, "error": "An account with this phone number already exists."}), 409

    try:
        user = User(
            name=name,
            email=email,
            phone=phone,
            preferred_language=language,
            state=state,
            district=district
        )
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        token = create_access_token(identity=str(user.id))
        return jsonify({
            "success": True,
            "message": "Account created successfully.",
            "data": {
                "token": token,
                "user": user.to_dict()
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": f"Failed to register user: {str(e)}"}), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    identifier = data.get("email_or_phone", "").strip()
    password = data.get("password", "")

    if not identifier or not password:
        return jsonify({"success": False, "error": "Please provide identifier and password."}), 400

    user = None
    if "@" in identifier:
        user = User.query.filter_by(email=identifier).first()
    else:
        user = User.query.filter_by(phone=identifier).first()

    if not user or not user.check_password(password):
        return jsonify({"success": False, "error": "Invalid credentials. Please verify and try again."}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({
        "success": True,
        "message": "Login successful.",
        "data": {
            "token": token,
            "user": user.to_dict()
        }
    }), 200

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    if not user:
        return jsonify({"success": False, "error": "User account not found."}), 404

    return jsonify({
        "success": True,
        "data": {
            "user": user.to_dict()
        }
    }), 200

@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    if not user:
        return jsonify({"success": False, "error": "User not found."}), 404

    data = request.get_json() or {}
    if "name" in data and data["name"].strip():
        user.name = data["name"].strip()
    if "preferred_language" in data:
        user.preferred_language = data["preferred_language"]
    if "state" in data:
        user.state = data["state"].strip()
    if "district" in data:
        user.district = data["district"].strip()

    try:
        db.session.commit()
        return jsonify({
            "success": True,
            "message": "Profile updated successfully.",
            "data": {
                "user": user.to_dict()
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": f"Update failed: {str(e)}"}), 500
