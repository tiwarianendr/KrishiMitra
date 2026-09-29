import React, { useState, useEffect } from "react";
import { 
  MapPin, 
  PhoneCall, 
  ExternalLink, 
  RefreshCw, 
  Store, 
  Building2, 
  ShieldCheck, 
  Search,
  Filter,
  AlertCircle
} from "lucide-react";
import { api } from "../services/api";
import type { AgriResource } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

export const ResourcesPage: React.FC = () => {
  const { t } = useLanguage();

  const [resources, setResources] = useState<AgriResource[]>([]);
  const [helplines, setHelplines] = useState<AgriResource[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [locationLabel, setLocationLabel] = useState<string>("Locating...");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = async (lat?: number, lon?: number, category: string = "all") => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getNearbyResources(lat, lon, 30, category);
      if (res.data) {
        setResources(res.data.nearby_establishments || []);
        setHelplines(res.data.official_helplines || []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load agricultural resources.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setCoords({ lat, lon });
          try {
            const locRes = await api.reverseGeocode(lat, lon);
            const address = (locRes.data?.formatted_address && !locRes.data.formatted_address.includes("Unknown"))
              ? locRes.data.formatted_address
              : (locRes.data?.city && locRes.data.city !== "Unknown")
                ? locRes.data.city
                : `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
            setLocationLabel(address);
          } catch {
            setLocationLabel(`${lat.toFixed(2)}, ${lon.toFixed(2)}`);
          }
          fetchResources(lat, lon, activeCategory);
        },
        () => {
          // Default station
          const defaultLat = 28.6139;
          const defaultLon = 77.2090;
          setCoords({ lat: defaultLat, lon: defaultLon });
          setLocationLabel("Central Agriculture Zone (Delhi / NCR)");
          fetchResources(defaultLat, defaultLon, activeCategory);
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
      );
    } else {
      fetchResources(28.6139, 77.2090, activeCategory);
    }
  }, []);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    if (coords) {
      fetchResources(coords.lat, coords.lon, cat);
    }
  };

  const categories = [
    { key: "all", label: t.resources.categoryAll },
    { key: "market", label: t.resources.categoryMarkets },
    { key: "seeds", label: t.resources.categorySeeds },
    { key: "fertilizer", label: t.resources.categoryFertilizers },
    { key: "office", label: t.resources.categoryOffices },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                {t.resources.title}
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                {t.resources.subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-semibold max-w-[200px] truncate">{locationLabel}</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => handleCategoryChange(cat.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeCategory === cat.key
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white border border-stone-300 text-stone-700 hover:bg-stone-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="py-12 flex flex-col items-center justify-center text-stone-400 gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-xs">{t.common.loading}</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Nearby Overpass Establishments (if found) */}
      {!isLoading && resources.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-600" />
            <span>Registered Local Centers ({resources.length} Found)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-emerald-500 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-emerald-700 uppercase">
                      {item.category}
                    </span>
                    {item.distance_km && (
                      <span className="text-[11px] font-medium text-stone-400">
                        {item.distance_km} {t.resources.kmAway}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-stone-900 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                    {item.address}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  {item.phone && item.phone !== "Not listed" ? (
                    <a
                      href={`tel:${item.phone.replace(/[^0-9+]/g, "")}`}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{item.phone}</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-stone-400">No phone listed</span>
                  )}

                  <a
                    href={item.action_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1"
                  >
                    <span>{t.resources.viewOnMap}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verified Government Agricultural Helplines Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-stone-900">
            {t.resources.nationalHelplinesTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {helplines.map((helpline) => (
            <div
              key={helpline.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:border-emerald-500 transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase mb-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{t.resources.verifiedHelplineBadge}</span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900">
                    {helpline.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {helpline.address}
                  </p>
                </div>

                <a
                  href={helpline.action_url}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {helpline.phone}</span>
                </a>
              </div>

              {(helpline as any).services && (
                <div className="pt-2 border-t border-stone-100">
                  <span className="text-[11px] font-bold text-stone-600 uppercase block mb-1">
                    Available Support:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(helpline as any).services.map((srv: string, idx: number) => (
                      <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
