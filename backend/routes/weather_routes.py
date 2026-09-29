import logging
from flask import Blueprint, request, jsonify
from backend.services.weather_service import WeatherService

logger = logging.getLogger(__name__)
weather_bp = Blueprint("weather", __name__, url_prefix="/api/weather")

@weather_bp.route("", methods=["GET"])
def get_weather():
    lat = request.args.get("lat", type=float)
    lon = request.args.get("lon", type=float)
    loc_name = request.args.get("location_name", type=str)

    # If coordinates are missing or invalid, default to representative central agricultural zone (e.g., Bhopal / New Delhi)
    if lat is None or lon is None or not (-90.0 <= lat <= 90.0) or not (-180.0 <= lon <= 180.0):
        lat, lon = 28.6139, 77.2090
        loc_name = loc_name or "New Delhi (Default)"

    try:
        weather_data = WeatherService.get_weather(lat, lon, location_name=loc_name)
        return jsonify({
            "success": True,
            "data": weather_data
        }), 200
    except Exception as e:
        logger.error(f"Weather route failed: {e}")
        return jsonify({
            "success": False,
            "error": "Failed to fetch live weather. Please check internet connection or location permissions."
        }), 503
