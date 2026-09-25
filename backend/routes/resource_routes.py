import logging
from flask import Blueprint, request, jsonify
from backend.services.resource_service import ResourceService

logger = logging.getLogger(__name__)
resource_bp = Blueprint("resources", __name__, url_prefix="/api/resources")

@resource_bp.route("", methods=["GET"])
def get_resources():
    lat = request.args.get("lat", type=float)
    lon = request.args.get("lon", type=float)
    radius_km = request.args.get("radius", 25.0, type=float)
    category = request.args.get("category", "all", type=str)

    # If coordinates are missing, provide default coordinates (e.g. 28.6139, 77.2090)
    if lat is None or lon is None:
        lat, lon = 28.6139, 77.2090

    try:
        data = ResourceService.get_nearby_resources(lat, lon, radius_km=radius_km, category=category)
        return jsonify({
            "success": True,
            "data": data
        }), 200
    except Exception as e:
        logger.error(f"Error fetching resources: {e}")
        return jsonify({
            "success": False,
            "error": "Failed to retrieve agricultural resources."
        }), 500
