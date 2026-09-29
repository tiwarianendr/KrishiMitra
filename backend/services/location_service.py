import logging
from typing import Dict, Any, Optional
import requests

logger = logging.getLogger(__name__)

class LocationService:
    @staticmethod
    def reverse_geocode(lat: float, lon: float) -> Dict[str, Any]:
        """
        Reverse geocode latitude and longitude into a human-readable agricultural address.
        Tier 1: BigDataCloud Reverse Geocoding API (Fast, cloud-friendly, reliable).
        Tier 2: OpenStreetMap Nominatim API (with valid User-Agent).
        Tier 3: Graceful coordinates fallback.
        """
        headers = {
            "User-Agent": "KrishiMitra-AgriPlatform/1.0 (https://krishi-mitra-woad.vercel.app; krishimitra@gmail.com)",
            "Accept": "application/json"
        }

        # Tier 1: BigDataCloud Reverse Geocoding API
        try:
            bdc_url = (
                f"https://api.bigdatacloud.net/data/reverse-geocode-client?"
                f"latitude={lat}&longitude={lon}&localityLanguage=en"
            )
            res = requests.get(bdc_url, headers=headers, timeout=6)
            if res.status_code == 200:
                data = res.json()
                city = data.get("locality") or data.get("city") or "Local Area"
                state = data.get("principalSubdivision") or ""
                country = data.get("countryName") or "India"
                postcode = data.get("postcode") or ""

                # Extract administrative district if available
                district = ""
                for admin in data.get("localityInfo", {}).get("administrative", []):
                    if admin.get("adminLevel") in [4, 5, 6]:
                        district = admin.get("name", "")
                        break
                if not district:
                    district = state

                parts = [p for p in [city, district if district != city else "", state if state != district else "", country] if p]
                formatted_name = ", ".join(parts) or f"{lat:.4f}, {lon:.4f}"

                return {
                    "formatted_address": formatted_name,
                    "city": city,
                    "district": district,
                    "state": state,
                    "country": country,
                    "postcode": postcode,
                    "latitude": lat,
                    "longitude": lon,
                    "source": "BigDataCloud"
                }
        except Exception as e:
            logger.warning(f"BigDataCloud reverse geocode failed, falling back to Nominatim: {e}")

        # Tier 2: OpenStreetMap Nominatim API
        try:
            osm_url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json&addressdetails=1"
            res = requests.get(osm_url, headers=headers, timeout=6)
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
                    "longitude": lon,
                    "source": "Nominatim"
                }
            else:
                logger.warning(f"Nominatim returned status {res.status_code}")
        except Exception as e:
            logger.warning(f"Nominatim reverse geocode failed: {e}")

        # Tier 3: Coordinate fallback
        return {
            "formatted_address": f"{lat:.4f}, {lon:.4f}",
            "city": "Farm Location",
            "district": "",
            "state": "",
            "country": "",
            "latitude": lat,
            "longitude": lon,
            "source": "CoordinateFallback"
        }
