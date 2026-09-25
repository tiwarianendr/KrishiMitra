import React from "react";
import { Link } from "react-router-dom";
import { 
  ScanLine, 
  Bot, 
  CloudSun, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  PhoneCall,
  Sparkles,
  Layers,
  Leaf
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export const HomePage: React.FC = () => {
  const { t } = useLanguage();

  const supportedCrops = [
    { name: "Potato", nameHi: "आलू", diseases: "Early Blight, Late Blight", icon: "🥔", color: "from-amber-500/10 to-amber-700/10" },
    { name: "Tomato", nameHi: "टमाटर", diseases: "10+ Blights, Spots & Viruses", icon: "🍅", color: "from-rose-500/10 to-rose-700/10" },
    { name: "Rice", nameHi: "धान", diseases: "Bacterial Blight, Brown Spot, Smut", icon: "🌾", color: "from-emerald-500/10 to-emerald-700/10" },
    { name: "Wheat", nameHi: "गेहूं", diseases: "Yellow Rust, Brown Rust, Mildew", icon: "🌱", color: "from-yellow-500/10 to-yellow-700/10" },
    { name: "Pea", nameHi: "मटर", diseases: "Powdery & Downy Mildew, Rust", icon: "🫛", color: "from-green-500/10 to-green-700/10" }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 bg-linear-to-b from-emerald-50/70 via-stone-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold mb-6 shadow-xs border border-emerald-200">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{t.hero.badge}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            {t.hero.title}{" "}
            <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy">
              {t.hero.titleHighlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/predict"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-base hover:bg-emerald-700 shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <ScanLine className="w-5 h-5" />
              <span>{t.hero.ctaDetect}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/assistant"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white border border-stone-300 text-stone-800 font-bold text-base hover:bg-stone-50 hover:border-emerald-600 flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Bot className="w-5 h-5 text-emerald-600" />
              <span>{t.hero.ctaAssistant}</span>
            </Link>
          </div>

          <div className="mt-6 text-xs text-stone-500 font-medium">
            {t.hero.cropsCovered}
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Comprehensive Digital Agricultural Suite
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Engineered specifically to solve real challenges faced by Indian farmers in the field.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-4 group-hover:scale-110 transition-transform">
              <ScanLine className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">
              {t.features.aiDetectTitle}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t.features.aiDetectDesc}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 mb-4 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">
              {t.features.assistantTitle}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t.features.assistantDesc}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700 mb-4 group-hover:scale-110 transition-transform">
              <CloudSun className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">
              {t.features.weatherTitle}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t.features.weatherDesc}
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 mb-4 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">
              {t.features.mandiTitle}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t.features.mandiDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Supported Crops Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-linear-to-br from-emerald-900 to-stone-900 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  Initial High-Impact Crops
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Supported Crop Diagnostic Registry
                </h2>
              </div>
              <Link
                to="/predict"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-900 font-bold text-sm transition-colors shadow-sm"
              >
                Scan a Crop Now
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {supportedCrops.map((crop) => (
                <div
                  key={crop.name}
                  className="p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/10 hover:bg-white/15 transition-all text-center"
                >
                  <div className="text-4xl mb-2">{crop.icon}</div>
                  <h4 className="text-base font-bold text-white">
                    {crop.name} ({crop.nameHi})
                  </h4>
                  <p className="text-xs text-emerald-300 mt-1 font-medium">
                    {crop.diseases}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Step-by-Step */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            How KrishiMitra Works
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Three simple steps to protect your harvest from devastating crop pathogens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 relative">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-4">
              1
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-2">
              Capture or Upload Leaf Photo
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Use your phone's camera in the field or upload an existing image of an infected leaf.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 relative">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-4">
              2
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-2">
              Instant AI Neural Diagnosis
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Our CNN computer vision pipeline inspects foliar lesions and identifies the specific pathogen.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 relative">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-4">
              3
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-2">
              Get Actionable Treatment
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Receive organic remedies, recommended chemical sprays with exact dosages, and prevention strategies.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Hotline Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-950">
                Need Immediate Agronomist Consultation?
              </h3>
              <p className="text-xs text-emerald-800">
                Call the Government of India Kisan Call Center toll-free at 1800-180-1551 (6:00 AM to 10:00 PM).
              </p>
            </div>
          </div>
          <a
            href="tel:18001801551"
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shrink-0 transition-colors"
          >
            Call 1800-180-1551
          </a>
        </div>
      </section>
    </div>
  );
};
