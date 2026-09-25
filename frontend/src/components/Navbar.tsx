import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Sprout, 
  Languages, 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  ScanLine, 
  Bot, 
  History, 
  MapPin, 
  Home, 
  LayoutDashboard,
  PhoneCall
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

export const Navbar: React.FC = () => {
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: t.nav.home, icon: Home },
    { to: "/dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    { to: "/predict", label: t.nav.predict, icon: ScanLine, highlight: true },
    { to: "/assistant", label: t.nav.assistant, icon: Bot },
    { to: "/history", label: t.nav.history, icon: History },
    { to: "/resources", label: t.nav.resources, icon: MapPin },
  ];

  const currentLangObj = availableLanguages.find(l => l.code === language) || availableLanguages[0];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200 shadow-xs">
      {/* Top emergency / helpline ticker */}
      <div className="bg-emerald-800 text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-medium">Kisan Helpline 24x7:</span>
            <a href="tel:18001801551" className="underline font-bold text-white hover:text-emerald-200 flex items-center gap-1">
              <PhoneCall className="w-3 h-3 inline" /> 1800-180-1551 (Toll-Free)
            </a>
          </div>
          <div className="hidden sm:block text-emerald-200">
            AI Multi-Crop Health System: Potato • Tomato • Rice • Wheat • Pea
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-stone-900 flex items-center gap-1">
                {t.brand}
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold uppercase tracking-wider">
                  AI
                </span>
              </span>
              <p className="text-[10px] text-stone-500 font-medium hidden sm:block leading-none">
                {t.tagline.slice(0, 42)}...
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    link.highlight
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                      : isActive
                      ? "bg-stone-100 text-emerald-700 font-semibold"
                      : "text-stone-600 hover:text-emerald-700 hover:bg-stone-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Header Controls (Language Selector & Auth) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-300 bg-stone-50 hover:bg-stone-100 text-xs sm:text-sm font-medium text-stone-700 transition-colors"
                title="Change Language"
              >
                <Languages className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">{currentLangObj.nativeName}</span>
              </button>

              {isLangDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-stone-200 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setIsLangDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider border-b border-stone-100">
                    Select Language / भाषा चुनें
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {availableLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between transition-colors ${
                          language === lang.code 
                            ? "bg-emerald-50 text-emerald-700 font-semibold" 
                            : "text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        <span>{lang.nativeName}</span>
                        <span className="text-xs text-stone-400 font-normal">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Auth State */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-sm font-medium transition-colors"
                  title="Farmer Profile"
                >
                  <UserIcon className="w-4 h-4 text-emerald-600" />
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title={t.nav.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-sm font-medium text-stone-700 hover:text-emerald-700 transition-colors"
                >
                  {t.nav.login}
                </Link>
                <Link
                  to="/signup"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 shadow-xs transition-colors"
                >
                  {t.nav.signup}
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  link.highlight
                    ? "bg-emerald-600 text-white font-semibold"
                    : isActive
                    ? "bg-emerald-50 text-emerald-700 font-bold"
                    : "text-stone-700 hover:bg-stone-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-700 hover:bg-stone-50 font-medium"
                >
                  <UserIcon className="w-5 h-5 text-emerald-600" />
                  <span>{t.nav.profile} ({user?.name})</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-rose-600 hover:bg-rose-50 font-medium text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{t.nav.logout}</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center rounded-lg border border-stone-300 text-sm font-semibold text-stone-700"
                >
                  {t.nav.login}
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center rounded-lg bg-emerald-600 text-white text-sm font-semibold"
                >
                  {t.nav.signup}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
