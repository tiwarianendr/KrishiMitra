import React from "react";
import { Link } from "react-router-dom";
import { Sprout, PhoneCall, ShieldCheck, Heart } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {t.brand}
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              {t.tagline}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-[11px] text-emerald-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Agronomy Aligned AI
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <Link to="/predict" className="hover:text-emerald-400 transition-colors">
                  {t.nav.predict}
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="hover:text-emerald-400 transition-colors">
                  {t.nav.assistant}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
                  {t.nav.dashboard}
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-emerald-400 transition-colors">
                  {t.nav.resources}
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-emerald-400 transition-colors">
                  {t.nav.history}
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Crops */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Diagnostic Coverage
            </h4>
            <div className="flex flex-wrap gap-1.5 text-xs text-stone-300">
              <span className="px-2.5 py-1 rounded-md bg-stone-800 border border-stone-700">Potato (आलू)</span>
              <span className="px-2.5 py-1 rounded-md bg-stone-800 border border-stone-700">Tomato (टमाटर)</span>
              <span className="px-2.5 py-1 rounded-md bg-stone-800 border border-stone-700">Rice (धान)</span>
              <span className="px-2.5 py-1 rounded-md bg-stone-800 border border-stone-700">Wheat (गेहूं)</span>
              <span className="px-2.5 py-1 rounded-md bg-stone-800 border border-stone-700">Pea (मटर)</span>
            </div>
            <p className="text-xs text-stone-400 mt-3 leading-relaxed">
              25+ pathogen and physiological stress categories diagnosed via deep neural computer vision.
            </p>
          </div>

          {/* Farmer Emergency Helplines */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Emergency Hotlines
            </h4>
            <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700 space-y-2">
              <div className="text-xs text-stone-400">Kisan Call Center (All India):</div>
              <a 
                href="tel:18001801551" 
                className="text-base font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
              >
                <PhoneCall className="w-4 h-4" /> 1800-180-1551
              </a>
              <div className="text-[11px] text-stone-400 border-t border-stone-700 pt-1.5">
                Toll-free 6 AM - 10 PM daily in 22 languages
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3">
          <p>
            © {new Date().getFullYear()} KrishiMitra. Developed for Indian Farmers with AI & Agronomic Sciences.
          </p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for India's Agricultural Future
          </p>
        </div>
      </div>
    </footer>
  );
};
