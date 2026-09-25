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

class WeatherService:
    @staticmethod
    def get_weather(lat: float, lon: float, location_name: Optional[str] = None) -> Dict[str, Any]:
        """
        Fetch real-time weather data.
        Primary: Open-Meteo API (High precision, reliable, no key required).
        Secondary: OpenWeatherMap (if OPENWEATHER_API_KEY is configured).
        """
        api_key = os.getenv("OPENWEATHER_API_KEY", "").strip()

        # If OpenWeather API key is provided and valid, try it first
        if api_key:
            try:
                owm_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
                res = requests.get(owm_url, timeout=5)
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

        # Primary / Fallback: Open-Meteo API
        try:
            url = (
                f"https://api.open-meteo.com/v1/forecast?"
                f"latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,"
                f"apparent_temperature,precipitation,rain,weather_code,wind_speed_10m"
                f"&hourly=precipitation_probability&forecast_days=1&timezone=auto"
            )
            response = requests.get(url, timeout=6)
            if response.status_code == 200:
                data = response.json()
                current = data.get("current", {})
                w_code = current.get("weather_code", 0)
                condition_en, condition_hi, icon_name = WMO_WEATHER_CODES.get(
                    w_code, ("Fair", "सामान्य", "sun")
                )

                # Get hourly precipitation probability for current hour if available
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
                logger.error(f"Open-Meteo API error HTTP {response.status_code}: {response.text}")
                raise RuntimeError(f"Open-Meteo returned status {response.status_code}")
        except Exception as e:
            logger.error(f"Weather fetch failed: {e}")
            raise RuntimeError(f"Unable to retrieve live weather data: {str(e)}")
