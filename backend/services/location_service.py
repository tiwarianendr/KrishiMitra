import logging
from typing import Dict, Any, Optional
import requests

logger = logging.getLogger(__name__)

class LocationService:
    @staticmethod
    def reverse_geocode(lat: float, lon: float) -> Dict[str, Any]:
        """
        Reverse geocode latitude and longitude into human-readable address.
        Uses OpenStreetMap Nominatim API with standard user-agent header.
        """
        headers = {
            "User-Agent": "KrishiMitra-FarmerApp/1.0 (contact@krishimitra.local)"
        }
        url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json&addressdetails=1"

        try:
            res = requests.get(url, headers=headers, timeout=6)
            if res.status_code == 200:
                data = res.json()
                address = data.get("address", {})
                
                village_or_town = (
                    address.get("village")
                    or address.get("town")
                    or address.get("suburb")
                    or address.get("city")
                    or address.get("county")
                    or "Local Area"
                )
                district = address.get("state_district") or address.get("county") or address.get("city") or ""
                state = address.get("state", "")
                country = address.get("country", "")
                postcode = address.get("postcode", "")

                formatted_name = ", ".join(filter(None, [village_or_town, district, state])) or data.get("display_name", "")

                return {
                    "formatted_address": formatted_name,
                    "city": village_or_town,
                    "district": district,
                    "state": state,
                    "country": country,
                    "postcode": postcode,
                    "latitude": lat,
                    "longitude": lon
                }
            else:
                logger.warning(f"Nominatim returned status {res.status_code}")
                return {
                    "formatted_address": f"{lat:.4f}, {lon:.4f}",
                    "city": "Unknown",
                    "district": "",
                    "state": "",
                    "country": "",
                    "latitude": lat,
                    "longitude": lon
                }
        except Exception as e:
            logger.error(f"Reverse geocode failed: {e}")
            return {
                "formatted_address": f"{lat:.4f}, {lon:.4f}",
                "city": "Location Available",
                "district": "",
                "state": "",
                "country": "",
                "latitude": lat,
                "longitude": lon,
                "error": str(e)
            }
