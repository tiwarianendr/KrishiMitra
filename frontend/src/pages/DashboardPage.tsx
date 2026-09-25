import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ScanLine, 
  Bot, 
  CloudSun, 
  MapPin, 
  Clock, 
  Camera, 
  Upload, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  ExternalLink,
  PhoneCall,
  Sparkles,
  Layers,
  ChevronRight,
  TrendingUp,
  RefreshCw
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import type { PredictionResult } from "../services/api";
import { WeatherWidget } from "../components/WeatherWidget";

export const DashboardPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [recentScans, setRecentScans] = useState<PredictionResult[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);
  const [assistantPrompt, setAssistantPrompt] = useState<string>("");

  useEffect(() => {
    const fetchRecentScans = async () => {
      setIsLoadingHistory(true);
      try {
        if (isAuthenticated) {
          const res = await api.getHistory(1, 5);
          if (res.data?.predictions) {
            setRecentScans(res.data.predictions);
          }
        } else {
          // If not logged in, user can still see dashboard with quick links
          setRecentScans([]);
        }
      } catch {
        setRecentScans([]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchRecentScans();
  }, [isAuthenticated]);

  const handleAssistantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistantPrompt.trim()) return;
    navigate("/assistant");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Welcome Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-emerald-800 via-teal-800 to-stone-900 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kisan Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.dashboard.welcome}, {user ? user.name : "Kisan Mitr"}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Monitor crop health in real-time, get proactive weather warnings, and diagnose foliar plant diseases instantly with AI.
          </p>
          {user?.state && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-200/90 font-medium pt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              <span>{user.district ? `${user.district}, ` : ""}{user.state}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10 shrink-0">
          <Link
            to="/predict"
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-900 font-bold text-sm shadow-md transition-all hover:scale-105 flex items-center gap-2"
          >
            <ScanLine className="w-4 h-4" />
            <span>{t.dashboard.quickDetect}</span>
          </Link>
          <Link
            to="/assistant"
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur transition-colors flex items-center gap-2"
          >
            <Bot className="w-4 h-4 text-emerald-300" />
            <span>{t.nav.assistant}</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Weather + Quick Detection + Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Farm Weather */}
        <div className="lg:col-span-1 space-y-6">
          <WeatherWidget />

          {/* Kisan Call Center Card */}
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <PhoneCall className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold">
                {t.dashboard.officialHelpline}
              </h3>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Connect directly with agricultural scientists for regional advice, free of charge.
            </p>
            <a
              href="tel:18001801551"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{t.dashboard.callNow}</span>
            </a>
          </div>
        </div>

        {/* Right Columns: Quick Disease Detection + AI Assistant Widget */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Disease Detection Launcher Card */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ScanLine className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    {t.dashboard.quickDetect}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {t.dashboard.quickDetectDesc}
                  </p>
                </div>
              </div>
              <Link
                to="/predict"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                Open Scanner <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Link
                to="/predict"
                className="p-4 rounded-2xl border border-dashed border-stone-300 hover:border-emerald-500 hover:bg-emerald-50/40 text-stone-700 hover:text-emerald-800 transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-emerald-100 text-stone-600 group-hover:text-emerald-700 flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold">{t.dashboard.openCamera}</h4>
                  <span className="text-[11px] text-stone-500">Take leaf photo in field</span>
                </div>
              </Link>

              <Link
                to="/predict"
                className="p-4 rounded-2xl border border-dashed border-stone-300 hover:border-emerald-500 hover:bg-emerald-50/40 text-stone-700 hover:text-emerald-800 transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-emerald-100 text-stone-600 group-hover:text-emerald-700 flex items-center justify-center shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold">{t.dashboard.uploadPhoto}</h4>
                  <span className="text-[11px] text-stone-500">From gallery or files</span>
                </div>
              </Link>
            </div>
          </div>

          {/* AI Farmer Assistant Quick Input Box */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    {t.dashboard.farmerAssistant}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Ask in Hindi, English, or 8 other Indian languages.
                  </p>
                </div>
              </div>
              <Link
                to="/assistant"
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                Full Chat <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <form onSubmit={handleAssistantSubmit} className="flex gap-2">
              <input
                type="text"
                value={assistantPrompt}
                onChange={(e) => setAssistantPrompt(e.target.value)}
                placeholder={t.dashboard.askQuestionPlaceholder}
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs sm:text-sm focus:outline-emerald-600"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
              >
                Ask Assistant
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 6. Recent Predictions & Supported Crops Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Diagnoses List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <h3 className="text-base font-bold text-stone-900">
                {t.dashboard.recentDetections}
              </h3>
            </div>
            {recentScans.length > 0 && (
              <Link
                to="/history"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                {t.dashboard.viewAllHistory}
              </Link>
            )}
          </div>

          {isLoadingHistory ? (
            <div className="py-8 flex justify-center text-stone-400">
              <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
            </div>
          ) : recentScans.length > 0 ? (
            <div className="divide-y divide-stone-100">
              {recentScans.map((scan) => (
                <div key={scan.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                      {scan.image_url ? (
                        <img src={scan.image_url} alt={scan.crop} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg flex items-center justify-center h-full">🌿</span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">
                        {scan.crop} – {scan.disease}
                      </h4>
                      <span className="text-[11px] text-stone-400">
                        {scan.created_at ? new Date(scan.created_at).toLocaleDateString() : "Recent"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      scan.is_healthy 
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}>
                      {scan.confidence}%
                    </span>
                    <Link
                      to="/history"
                      className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
                <ScanLine className="w-6 h-6" />
              </div>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {t.dashboard.noRecentDetections}
              </p>
              <Link
                to="/predict"
                className="inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
              >
                Diagnose Leaf Now
              </Link>
            </div>
          )}
        </div>

        {/* Supported Crops Quick Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-base font-bold text-stone-900">
              {t.dashboard.supportedCropsTitle}
            </h3>
            <span className="text-xs text-emerald-700 font-bold">5 Active Crops</span>
          </div>

          <div className="space-y-2.5">
            {[
              { name: "Potato (आलू)", count: "3 Conditions", icon: "🥔" },
              { name: "Tomato (टमाटर)", count: "10 Conditions", icon: "🍅" },
              { name: "Rice (धान)", count: "4 Conditions", icon: "🌾" },
              { name: "Wheat (गेहूं)", count: "4 Conditions", icon: "🌱" },
              { name: "Pea (मटर)", count: "4 Conditions", icon: "🫛" }
            ].map((crop, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">{crop.icon}</span>
                  <span className="font-semibold text-stone-800">{crop.name}</span>
                </div>
                <span className="text-emerald-700 font-medium">{crop.count}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              to="/resources"
              className="w-full py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 flex items-center justify-center gap-1.5 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Explore Nearby Mandis & Stores</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
