import logging
from flask import Blueprint, request, jsonify
from backend.services.location_service import LocationService

logger = logging.getLogger(__name__)
location_bp = Blueprint("location", __name__, url_prefix="/api/location")

@location_bp.route("/reverse", methods=["GET"])
def reverse_geocode():
    lat = request.args.get("lat", type=float)
    lon = request.args.get("lon", type=float)

    if lat is None or lon is None:
        return jsonify({"success": False, "error": "Query parameters 'lat' and 'lon' are required."}), 400

    try:
        location_data = LocationService.reverse_geocode(lat, lon)
        return jsonify({
            "success": True,
            "data": location_data
        }), 200
    except Exception as e:
        logger.error(f"Location reverse geocode error: {e}")
        return jsonify({
            "success": False,
            "error": "Failed to determine location details."
        }), 500
