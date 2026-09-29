import React, { useState, useEffect } from "react";
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  CloudRain, 
  RefreshCw, 
  MapPin, 
  AlertCircle,
  Sun,
  Cloud,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { api } from "../services/api";
import type { WeatherData } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

export const WeatherWidget: React.FC = () => {
  const { t, language } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [geoState, setGeoState] = useState<"pending" | "granted" | "denied">("pending");

  const fetchWeather = async (latitude: number, longitude: number, locLabel?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getWeather(latitude, longitude, locLabel);
      if (res.data) {
        setWeather(res.data);
      }
    } catch (err: any) {
      setError(err.message || t.weather.error);
    } finally {
      setIsLoading(false);
    }
  };

  const detectLocationAndFetch = () => {
    setIsLoading(true);
    setError(null);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setGeoState("granted");
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setCoords({ lat, lon });

          // Attempt reverse geocoding for city / district
          try {
            const locRes = await api.reverseGeocode(lat, lon);
            const city = (locRes.data?.city && locRes.data.city !== "Unknown")
              ? locRes.data.city
              : (locRes.data?.district && locRes.data.district !== "Unknown")
                ? locRes.data.district
                : (locRes.data?.state || "Local Farm");
            setLocationName(city);
            fetchWeather(lat, lon, city);
          } catch {
            const fallbackLabel = "GPS Location";
            setLocationName(fallbackLabel);
            fetchWeather(lat, lon, fallbackLabel);
          }
        },
        (_err) => {
          setGeoState("denied");
          // Fallback to central Indian regional agricultural coordinates
          const fallbackLat = 28.6139;
          const fallbackLon = 77.2090;
          setCoords({ lat: fallbackLat, lon: fallbackLon });
          const defaultLabel = "New Delhi (Regional)";
          setLocationName(defaultLabel);
          fetchWeather(fallbackLat, fallbackLon, defaultLabel);
        },
        { 
          enableHighAccuracy: false, 
          timeout: 10000, 
          maximumAge: 300000 
        }
      );
    } else {
      setGeoState("denied");
      const fallbackLat = 28.6139;
      const fallbackLon = 77.2090;
      setCoords({ lat: fallbackLat, lon: fallbackLon });
      setLocationName("New Delhi (Regional)");
      fetchWeather(fallbackLat, fallbackLon, "Regional Agriculture Station");
    }
  };

  useEffect(() => {
    detectLocationAndFetch();
  }, []);

  const handleRefresh = () => {
    if (geoState === "granted" && coords) {
      fetchWeather(coords.lat, coords.lon, locationName);
    } else {
      detectLocationAndFetch();
    }
  };

  // Weather spray conditions indicator
  const isSpraySafe = weather 
    ? weather.wind_speed <= 15 && (weather.rain_probability === null || (weather.rain_probability ?? 0) <= 30)
    : false;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900 leading-tight">
              {t.weather.title}
            </h3>
            <button
              type="button"
              onClick={detectLocationAndFetch}
              className="flex items-center gap-1 text-xs text-stone-500 hover:text-emerald-700 font-medium transition-colors text-left"
              title="Click to detect current GPS location"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate max-w-[170px]">{locationName || (geoState === "pending" ? t.dashboard.detectingLocation : "Farm Region")}</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isLoading}
          className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-emerald-700 hover:bg-stone-50 transition-colors"
          title={t.weather.refresh}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-emerald-600" : ""}`} />
        </button>
      </div>

      {/* Loading State */}
      {isLoading && !weather && (
        <div className="py-8 flex flex-col items-center justify-center text-stone-400 gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-xs">{t.weather.loading}</span>
        </div>
      )}

      {/* Error State */}
      {error && !weather && (
        <div className="py-6 px-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-800">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
          <div className="text-xs">
            <p className="font-semibold">{error}</p>
            <p className="mt-1 text-amber-700">Check internet connection or click refresh.</p>
          </div>
        </div>
      )}

      {/* Weather Content */}
      {weather && (
        <div className="space-y-4">
          {/* Main Temperature & Condition */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-stone-900 tracking-tight">
                {weather.temperature}°C
              </span>
              <span className="text-xs text-stone-500 font-medium">
                ({t.weather.feelsLike} {weather.feels_like}°C)
              </span>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                {language === "hi" && weather.weather_condition_hi
                  ? weather.weather_condition_hi
                  : weather.weather_condition}
              </span>
              <p className="text-[11px] text-stone-400 mt-1">
                {weather.source}
              </p>
            </div>
          </div>

          {/* Grid telemetry metrics */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <div className="flex justify-center text-sky-600 mb-1">
                <Droplets className="w-4 h-4" />
              </div>
              <span className="text-xs text-stone-500 block">{t.weather.humidity}</span>
              <span className="text-sm font-bold text-stone-800">{weather.humidity}%</span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <div className="flex justify-center text-teal-600 mb-1">
                <Wind className="w-4 h-4" />
              </div>
              <span className="text-xs text-stone-500 block">{t.weather.wind}</span>
              <span className="text-sm font-bold text-stone-800">{weather.wind_speed} km/h</span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <div className="flex justify-center text-indigo-600 mb-1">
                <CloudRain className="w-4 h-4" />
              </div>
              <span className="text-xs text-stone-500 block">{t.weather.rainProbability}</span>
              <span className="text-sm font-bold text-stone-800">
                {weather.rain_probability !== null ? `${weather.rain_probability}%` : "0%"}
              </span>
            </div>
          </div>

          {/* Spraying Advisory Badge */}
          <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs ${
            isSpraySafe
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-amber-50 border-amber-200 text-amber-800"
          }`}>
            {isSpraySafe ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Spray Condition: Favorable</strong> (Low wind & low rain probability)
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Caution:</strong> Check wind or rain risk before applying foliar fungicides.
                </span>
              </>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-400">
            <span>{t.weather.updated}: {weather.last_updated}</span>
            {geoState === "denied" && (
              <button
                type="button"
                onClick={detectLocationAndFetch}
                className="text-amber-600 hover:text-amber-700 font-medium hover:underline flex items-center gap-1"
                title="Click to retry GPS detection"
              >
                GPS Off (Retry)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
