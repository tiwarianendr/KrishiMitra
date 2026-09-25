import math
import logging
from typing import Dict, Any, List, Optional
import requests

logger = logging.getLogger(__name__)

# Verified official government & national agricultural assistance centers
OFFICIAL_AGRI_HELPLINES = [
    {
        "id": "kcc-national",
        "name": "Kisan Call Center (KCC) / किसान कॉल सेंटर",
        "category": "Agriculture Office & Advisory",
        "category_key": "advisory",
        "phone": "1800-180-1551",
        "timing": "6:00 AM - 10:00 PM (All 7 Days)",
        "address": "Nationwide Toll-Free Agricultural Expert Line",
        "services": ["Crop disease consultation", "Weather forecasts", "Input subsidy guidance", "Pest outbreak alerts"],
        "is_verified_hotline": True,
        "action_url": "tel:18001801551"
    },
    {
        "id": "enam-mandi",
        "name": "e-NAM (National Agriculture Market) Helpdesk / राष्ट्रीय कृषि बाजार",
        "category": "Agriculture Markets",
        "category_key": "market",
        "phone": "1800-270-0224",
        "timing": "9:00 AM - 6:00 PM (Monday - Saturday)",
        "address": "Department of Agriculture & Farmers Welfare, Govt of India",
        "services": ["Live APMC Mandi commodity rates", "Online crop trading", "Logistics & assaying"],
        "is_verified_hotline": True,
        "action_url": "https://enam.gov.in"
    },
    {
        "id": "kvk-icar",
        "name": "Krishi Vigyan Kendra (KVK) Network / कृषि विज्ञान केंद्र",
        "category": "Agriculture Offices",
        "category_key": "office",
        "phone": "011-25841022",
        "timing": "9:30 AM - 5:00 PM (Mon - Fri)",
        "address": "ICAR District Agronomy & Extension Research Centers",
        "services": ["Certified seed availability", "Soil testing", "Field demonstrations", "Custom hiring centers"],
        "is_verified_hotline": True,
        "action_url": "https://kvk.icar.gov.in"
    },
    {
        "id": "pmfby-helpline",
        "name": "Crop Insurance (PMFBY) Farmer Support / फसल बीमा सहायता",
        "category": "Farmer-Support Resources",
        "category_key": "insurance",
        "phone": "14447",
        "timing": "24x7 Automated & Agent Assistance",
        "address": "Ministry of Agriculture & Farmers Welfare",
        "services": ["Crop loss intimation within 72 hrs", "Claim status tracking", "Localized calamity relief"],
        "is_verified_hotline": True,
        "action_url": "https://pmfby.gov.in"
    }
]

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Haversine formula to compute great-circle distance in kilometers."""
    r = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(r * c, 1)

class ResourceService:
    @staticmethod
    def get_nearby_resources(lat: float, lon: float, radius_km: float = 25.0, category: Optional[str] = None) -> Dict[str, Any]:
        """
        Discover real agricultural resources near farmer coordinates using OpenStreetMap Overpass API,
        augmented with verified government agronomy helplines and portals.
        """
        radius_meters = int(radius_km * 1000)
        found_places: List[Dict[str, Any]] = []
        overpass_success = False

        # Query OpenStreetMap Overpass API for real registered agricultural establishments
        overpass_query = f"""
        [out:json][timeout:8];
        (
          node["amenity"="marketplace"](around:{radius_meters},{lat},{lon});
          node["shop"="agrarian"](around:{radius_meters},{lat},{lon});
          node["shop"="farm"](around:{radius_meters},{lat},{lon});
          node["shop"="fertilizer"](around:{radius_meters},{lat},{lon});
          node["shop"="seeds"](around:{radius_meters},{lat},{lon});
          node["office"="government"]["government"="agriculture"](around:{radius_meters},{lat},{lon});
        );
        out body 15;
        """

        overpass_endpoints = [
            "https://overpass-api.de/api/interpreter",
            "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
        ]

        for endpoint in overpass_endpoints:
            try:
                res = requests.post(endpoint, data={"data": overpass_query}, timeout=6)
                if res.status_code == 200:
                    data = res.json()
                    elements = data.get("elements", [])
                    overpass_success = True

                    for el in elements:
                        tags = el.get("tags", {})
                        name = tags.get("name") or tags.get("name:en") or tags.get("operator")
                        if not name:
                            # Skip unnamed map nodes
                            continue

                        node_lat = el.get("lat")
                        node_lon = el.get("lon")
                        dist = calculate_distance(lat, lon, node_lat, node_lon)

                        # Determine category
                        cat_key = "other"
                        cat_label = "Agricultural Resource"
                        if tags.get("amenity") == "marketplace":
                            cat_key = "market"
                            cat_label = "Agriculture Market (Mandi)"
                        elif tags.get("shop") in ["seeds", "agrarian"]:
                            cat_key = "seeds"
                            cat_label = "Seed & Crop Store"
                        elif tags.get("shop") == "fertilizer":
                            cat_key = "fertilizer"
                            cat_label = "Fertilizer & Agri-Input Store"
                        elif tags.get("office") == "government":
                            cat_key = "office"
                            cat_label = "Agriculture Office / Extension"

                        street = tags.get("addr:street", "")
                        city = tags.get("addr:city", "")
                        addr_str = ", ".join(filter(None, [street, city])) or f"Within {dist} km of your location"

                        found_places.append({
                            "id": f"osm-{el.get('id')}",
                            "name": name,
                            "category": cat_label,
                            "category_key": cat_key,
                            "phone": tags.get("phone") or tags.get("contact:phone") or "Not listed",
                            "address": addr_str,
                            "distance_km": dist,
                            "latitude": node_lat,
                            "longitude": node_lon,
                            "is_verified_hotline": False,
                            "action_url": f"https://www.google.com/maps/search/?api=1&query={node_lat},{node_lon}"
                        })
                    break
            except Exception as e:
                logger.warning(f"Overpass endpoint {endpoint} failed: {e}")

        # Sort places by distance
        found_places.sort(key=lambda x: x.get("distance_km", 999))

        # Filter by category if requested
        helpline_results = OFFICIAL_AGRI_HELPLINES
        if category and category != "all":
            found_places = [p for p in found_places if p.get("category_key") == category]
            helpline_results = [h for h in OFFICIAL_AGRI_HELPLINES if h.get("category_key") == category]

        return {
            "latitude": lat,
            "longitude": lon,
            "search_radius_km": radius_km,
            "overpass_connected": overpass_success,
            "nearby_establishments": found_places,
            "count_nearby": len(found_places),
            "official_helplines": helpline_results
        }
