import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Sprout, AlertCircle, ArrowRight, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await login(identifier.trim(), password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid login credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 p-8 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
            <Sprout className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900">
            {t.auth.loginTitle}
          </h1>
          <p className="text-xs text-stone-500">
            Access your agricultural diagnostic records and assistant.
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
              {t.auth.emailOrPhone}
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. kisan@krishi.in or 9876543210"
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-emerald-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              {t.auth.password}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-emerald-600"
            />
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
                <LogIn className="w-4 h-4" />
                <span>{t.auth.loginBtn}</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-stone-500 border-t border-stone-100">
          <span>{t.auth.noAccount} </span>
          <Link to="/signup" className="font-bold text-emerald-700 hover:underline">
            {t.auth.signupTitle}
          </Link>
        </div>
      </div>
    </div>
  );
};
