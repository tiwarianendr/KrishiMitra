import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Sprout, AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const { t, language, availableLanguages } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [prefLang, setPrefLang] = useState(language);
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !identifier.trim() || !password) {
      setError("Please complete all required fields.");
      return;
    }
    if (password.length < 6) {
      setError(t.auth.passwordLengthError);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await signup({
        name: name.trim(),
        email_or_phone: identifier.trim(),
        password,
        preferred_language: prefLang,
        state: state.trim() || undefined,
        district: district.trim() || undefined
      });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to register account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-stone-200 p-8 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
            <Sprout className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900">
            {t.auth.signupTitle}
          </h1>
          <p className="text-xs text-stone-500">
            Create your account to save diagnostic records and customize your language.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              {t.auth.fullName} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Patel"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-emerald-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              {t.auth.emailOrPhone} *
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. 9876543210 or kisan@gmail.com"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {t.auth.password} *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {t.auth.confirmPassword} *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {t.auth.selectLanguage}
              </label>
              <select
                value={prefLang}
                onChange={(e) => setPrefLang(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:outline-emerald-600"
              >
                {availableLanguages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {t.auth.state}
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Punjab"
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-emerald-600"
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
                placeholder="e.g. Ludhiana"
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-emerald-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{t.auth.signupBtn}</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-stone-500 border-t border-stone-100">
          <span>{t.auth.alreadyAccount} </span>
          <Link to="/login" className="font-bold text-emerald-700 hover:underline">
            {t.auth.loginTitle}
          </Link>
        </div>
      </div>
    </div>
  );
};
