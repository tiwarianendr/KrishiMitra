import React, { useState } from "react";
import { Settings as SettingsIcon, Bell, Volume2, Globe, Shield, Smartphone } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export const SettingsPage: React.FC = () => {
  const { t, language, setLanguage, availableLanguages } = useLanguage();
  const [audioFeedback, setAudioFeedback] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [offlineCache, setOfflineCache] = useState(true);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-stone-800 text-white flex items-center justify-center shadow-xs">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              App Preferences & Settings
            </h1>
            <p className="text-xs text-stone-500 font-medium">
              Configure speech audio, accessibility, and offline modes.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs divide-y divide-stone-100">
        {/* Language setting */}
        <div className="py-4 first:pt-0 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Application Language</h3>
              <p className="text-xs text-stone-500">Current language across the entire platform</p>
            </div>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-semibold text-stone-800 focus:outline-emerald-600"
          >
            {availableLanguages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeName} ({l.name})
              </option>
            ))}
          </select>
        </div>

        {/* Audio response setting */}
        <div className="py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Voice Assistant Speech</h3>
              <p className="text-xs text-stone-500">Enable audio reading of diagnosis recommendations</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={audioFeedback}
            onChange={(e) => setAudioFeedback(e.target.checked)}
            className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
          />
        </div>

        {/* High contrast setting */}
        <div className="py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Outdoor High-Contrast Display</h3>
              <p className="text-xs text-stone-500">Enhanced sunlight readability for field usage</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={highContrast}
            onChange={(e) => setHighContrast(e.target.checked)}
            className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
          />
        </div>

        {/* Offline caching */}
        <div className="py-4 last:pb-0 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Local Agronomy Database Caching</h3>
              <p className="text-xs text-stone-500">Store symptom guides locally for weak connectivity zones</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={offlineCache}
            onChange={(e) => setOfflineCache(e.target.checked)}
            className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
