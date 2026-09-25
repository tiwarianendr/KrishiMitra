import React, { useState, useEffect } from "react";
import { User as UserIcon, Save, RefreshCw, CheckCircle2, AlertCircle, MapPin, Globe } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export const ProfilePage: React.FC = () => {
  const { user, updateUser, isAuthenticated } = useAuth();
  const { t, language, setLanguage, availableLanguages } = useLanguage();

  const [name, setName] = useState("");
  const [prefLang, setPrefLang] = useState(language);
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPrefLang(user.preferred_language || language);
      setState(user.state || "");
      setDistrict(user.district || "");
    }
  }, [user, language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await updateUser({
        name: name.trim(),
        preferred_language: prefLang,
        state: state.trim() || undefined,
        district: district.trim() || undefined
      });
      setLanguage(prefLang);
      setSuccessMsg(t.profile.updateSuccess);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <p className="text-sm text-stone-600">Please sign in to view and edit your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {t.profile.title}
            </h1>
            <p className="text-xs text-stone-500 font-medium">
              {t.profile.subtitle}
            </p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            {t.profile.personalInfo}
          </h2>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              {t.auth.fullName}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-emerald-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Registered Identifier (Email / Phone)
            </label>
            <input
              type="text"
              disabled
              value={user?.email || user?.phone || ""}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-stone-500 text-sm cursor-not-allowed"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            {t.profile.preferredLanguage}
          </h2>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Interface & Assistant Language
            </label>
            <select
              value={prefLang}
              onChange={(e) => setPrefLang(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:outline-emerald-600"
            >
              {availableLanguages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeName} ({l.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            {t.profile.locationInfo}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {t.auth.state}
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Uttar Pradesh"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {t.auth.district}
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Varanasi"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-emerald-600"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{t.profile.updateBtn}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
