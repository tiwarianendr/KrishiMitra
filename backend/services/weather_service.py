import os
import logging
from datetime import datetime
from typing import Dict, Any, Optional
import requests

logger = logging.getLogger(__name__)

# Weather code descriptions from WMO standard
WMO_WEATHER_CODES = {
    0: ("Clear sky", "साफ आसमान", "sun"),
    1: ("Mainly clear", "मुख्यतः साफ", "sun"),
    2: ("Partly cloudy", "आंशिक रूप से बादल", "cloud-sun"),
    3: ("Overcast", "बादल छाए रहेंगे", "cloud"),
    45: ("Foggy", "कोहरा", "cloud-fog"),
    48: ("Depositing rime fog", "घना कोहरा", "cloud-fog"),
    51: ("Light drizzle", "हल्की बूंदाबांदी", "cloud-drizzle"),
    53: ("Moderate drizzle", "मध्यम बूंदाबांदी", "cloud-drizzle"),
    55: ("Dense drizzle", "तेज बूंदाबांदी", "cloud-rain"),
    61: ("Slight rain", "हल्की बारिश", "cloud-rain"),
    63: ("Moderate rain", "मध्यम बारिश", "cloud-rain"),
    65: ("Heavy rain", "भारी बारिश", "cloud-rain-wind"),
    71: ("Slight snow", "हल्की बर्फबारी", "cloud-snow"),
    73: ("Moderate snow", "मध्यम बर्फबारी", "cloud-snow"),
    75: ("Heavy snow", "भारी बर्फबारी", "cloud-snow"),
    80: ("Slight rain showers", "हल्की बौछारें", "cloud-drizzle"),
    81: ("Moderate rain showers", "मध्यम बौछारें", "cloud-rain"),
    82: ("Violent rain showers", "तेज मूसलाधार बौछारें", "cloud-lightning"),
    95: ("Thunderstorm", "गरज के साथ तूफान", "cloud-lightning"),
    96: ("Thunderstorm with slight hail", "ओलावृष्टि के साथ तूफान", "cloud-hail"),
    99: ("Thunderstorm with heavy hail", "भारी ओलावृष्टि के साथ तूफान", "cloud-hail")
}

REQUEST_HEADERS = {
    "User-Agent": "KrishiMitra-AgriPlatform/1.0 (https://krishi-mitra-woad.vercel.app; krishimitra@gmail.com)",
    "Accept": "application/json"
}

class WeatherService:
    @staticmethod
    def _map_condition_text(desc: str):
        desc_lower = desc.lower()
        if any(k in desc_lower for k in ["clear", "sunny"]):
            return ("Clear sky", "साफ आसमान", "sun", 0)
        elif "partly cloudy" in desc_lower:
            return ("Partly cloudy", "आंशिक रूप से बादल", "cloud-sun", 2)
        elif any(k in desc_lower for k in ["cloud", "overcast"]):
            return ("Overcast", "बादल छाए रहेंगे", "cloud", 3)
        elif any(k in desc_lower for k in ["thunder", "storm", "lightning"]):
            return ("Thunderstorm", "गरज के साथ तूफान", "cloud-lightning", 95)
        elif any(k in desc_lower for k in ["heavy rain", "torrential", "shower"]):
            return ("Heavy rain", "भारी बारिश", "cloud-rain-wind", 65)
        elif any(k in desc_lower for k in ["rain", "drizzle"]):
            return ("Moderate rain", "बारिश", "cloud-rain", 61)
        elif any(k in desc_lower for k in ["fog", "mist", "haze"]):
            return ("Foggy", "कोहरा", "cloud-fog", 45)
        elif "snow" in desc_lower:
            return ("Snow", "बर्फबारी", "cloud-snow", 71)
        return (desc.title(), desc.title(), "cloud-sun", 1)

    @staticmethod
    def get_weather(lat: float, lon: float, location_name: Optional[str] = None) -> Dict[str, Any]:
        """
        Fetch real-time weather data.
        Primary: OpenWeatherMap (if OPENWEATHER_API_KEY is configured).
        Secondary: Open-Meteo API (High precision, reliable, no key required).
        Tertiary: wttr.in API (High resilience live meteorological data fallback).
        """
        api_key = os.getenv("OPENWEATHER_API_KEY", "").strip()

        # 1. If OpenWeather API key is provided and valid, try it first
        if api_key:
            try:
                owm_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
                res = requests.get(owm_url, headers=REQUEST_HEADERS, timeout=6)
                if res.status_code == 200:
                    data = res.json()
                    return {
                        "source": "OpenWeatherMap",
                        "location": location_name or data.get("name", f"{lat:.2f}, {lon:.2f}"),
                        "latitude": lat,
                        "longitude": lon,
                        "temperature": round(data["main"]["temp"], 1),
                        "feels_like": round(data["main"].get("feels_like", data["main"]["temp"]), 1),
                        "humidity": data["main"]["humidity"],
                        "wind_speed": round(data["wind"]["speed"] * 3.6, 1),  # convert m/s to km/h
                        "weather_condition": data["weather"][0]["main"],
                        "weather_description": data["weather"][0]["description"].title(),
                        "weather_icon": data["weather"][0]["icon"],
                        "rainfall_mm": data.get("rain", {}).get("1h", 0.0),
                        "rain_probability": None,
                        "last_updated": datetime.now().strftime("%I:%M %p, %d %b %Y")
                    }
            except Exception as e:
                logger.warning(f"OpenWeatherMap request failed, falling back to Open-Meteo: {e}")

        # 2. Primary Free: Open-Meteo API
        try:
            url = (
                f"https://api.open-meteo.com/v1/forecast?"
                f"latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,"
                f"apparent_temperature,precipitation,rain,weather_code,wind_speed_10m"
                f"&hourly=precipitation_probability&forecast_days=1&timezone=auto"
            )
            response = requests.get(url, headers=REQUEST_HEADERS, timeout=9)
            if response.status_code == 200:
                data = response.json()
                current = data.get("current", {})
                w_code = current.get("weather_code", 0)
                condition_en, condition_hi, icon_name = WMO_WEATHER_CODES.get(
                    w_code, ("Fair", "सामान्य", "sun")
                )

                rain_prob = None
                hourly_probs = data.get("hourly", {}).get("precipitation_probability", [])
                if hourly_probs:
                    now_hour = datetime.now().hour
                    if now_hour < len(hourly_probs):
                        rain_prob = hourly_probs[now_hour]
                    else:
                        rain_prob = hourly_probs[0]

                return {
                    "source": "Open-Meteo",
                    "location": location_name or f"Lat: {lat:.2f}, Lon: {lon:.2f}",
                    "latitude": lat,
                    "longitude": lon,
                    "temperature": round(current.get("temperature_2m", 25.0), 1),
                    "feels_like": round(current.get("apparent_temperature", current.get("temperature_2m", 25.0)), 1),
                    "humidity": current.get("relative_humidity_2m", 60),
                    "wind_speed": round(current.get("wind_speed_10m", 10.0), 1),
                    "weather_condition": condition_en,
                    "weather_condition_hi": condition_hi,
                    "weather_code": w_code,
                    "weather_icon": icon_name,
                    "rainfall_mm": current.get("precipitation", 0.0),
                    "rain_probability": rain_prob,
                    "last_updated": datetime.now().strftime("%I:%M %p, %d %b %Y")
                }
            else:
                logger.warning(f"Open-Meteo returned HTTP {response.status_code}, attempting wttr.in fallback")
        except Exception as e:
            logger.warning(f"Open-Meteo request failed: {e}, attempting wttr.in fallback")

        # 3. Tertiary Free Live Fallback: wttr.in
        try:
            wttr_url = f"https://wttr.in/{lat:.4f},{lon:.4f}?format=j1"
            response = requests.get(wttr_url, headers=REQUEST_HEADERS, timeout=9)
            if response.status_code == 200:
                wttr_data = response.json()
                curr = wttr_data["current_condition"][0]
                desc = curr["weatherDesc"][0]["value"]
                condition_en, condition_hi, icon_name, w_code = WeatherService._map_condition_text(desc)
                temp_c = float(curr.get("temp_C", 25.0))
                feels_c = float(curr.get("FeelsLikeC", temp_c))
                humidity_val = int(curr.get("humidity", 60))
                wind_kmh = float(curr.get("windspeedKmph", 10.0))
                precip = float(curr.get("precipMM", 0.0))

                return {
                    "source": "wttr.in",
                    "location": location_name or f"Lat: {lat:.2f}, Lon: {lon:.2f}",
                    "latitude": lat,
                    "longitude": lon,
                    "temperature": round(temp_c, 1),
                    "feels_like": round(feels_c, 1),
                    "humidity": humidity_val,
                    "wind_speed": round(wind_kmh, 1),
                    "weather_condition": condition_en,
                    "weather_condition_hi": condition_hi,
                    "weather_code": w_code,
                    "weather_icon": icon_name,
                    "rainfall_mm": precip,
                    "rain_probability": None,
                    "last_updated": datetime.now().strftime("%I:%M %p, %d %b %Y")
                }
        except Exception as e:
            logger.error(f"wttr.in fallback failed: {e}")

        # 4. Final attempt: simplified Open-Meteo query (without timezone=auto / hourly calculations)
        try:
            simplified_url = (
                f"https://api.open-meteo.com/v1/forecast?"
                f"latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code"
            )
            response = requests.get(simplified_url, headers=REQUEST_HEADERS, timeout=9)
            if response.status_code == 200:
                data = response.json()
                current = data.get("current", {})
                w_code = current.get("weather_code", 0)
                condition_en, condition_hi, icon_name = WMO_WEATHER_CODES.get(
                    w_code, ("Fair", "सामान्य", "sun")
                )
                return {
                    "source": "Open-Meteo-Lite",
                    "location": location_name or f"Lat: {lat:.2f}, Lon: {lon:.2f}",
                    "latitude": lat,
                    "longitude": lon,
                    "temperature": round(current.get("temperature_2m", 25.0), 1),
                    "feels_like": round(current.get("temperature_2m", 25.0), 1),
                    "humidity": current.get("relative_humidity_2m", 60),
                    "wind_speed": round(current.get("wind_speed_10m", 10.0), 1),
                    "weather_condition": condition_en,
                    "weather_condition_hi": condition_hi,
                    "weather_code": w_code,
                    "weather_icon": icon_name,
                    "rainfall_mm": 0.0,
                    "rain_probability": None,
                    "last_updated": datetime.now().strftime("%I:%M %p, %d %b %Y")
                }
        except Exception as e:
            logger.error(f"Simplified Open-Meteo fallback failed: {e}")

        raise RuntimeError("Unable to retrieve live weather data from any active meteorological service.")
