import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  History, 
  Trash2, 
  Eye, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  X, 
  Calendar,
  Layers,
  ArrowRight,
  LogIn
} from "lucide-react";
import { api } from "../services/api";
import type { PredictionResult } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { ConfidenceBar } from "../components/ConfidenceBar";

export const HistoryPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();

  const [records, setRecords] = useState<PredictionResult[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const fetchRecords = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getHistory(1, 50);
      if (res.data?.predictions) {
        setRecords(res.data.predictions);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load diagnostic records.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [isAuthenticated]);

  const handleDelete = async (id: number) => {
    if (!window.confirm(t.history.deleteConfirm)) return;
    setIsDeleting(id);
    try {
      await api.deletePrediction(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
      if (selectedRecord?.id === id) {
        setSelectedRecord(null);
      }
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleOpenDetails = async (id: number) => {
    try {
      const res = await api.getPredictionDetails(id);
      if (res.data) {
        setSelectedRecord(res.data);
      }
    } catch (err: any) {
      alert(`Failed to fetch details: ${err.message}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
          <History className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-stone-900">
          Sign In to Access Diagnostic History
        </h2>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          Your past plant diagnoses, disease trends, and treatment schedules are securely linked to your farmer account.
        </p>
        <div className="pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Log In to View Records</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                {t.history.title}
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                {t.history.subtitle}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchRecords}
          disabled={isLoading}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-600" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="py-16 flex flex-col items-center justify-center text-stone-400 gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-xs">{t.common.loading}</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && records.length === 0 && (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">
            {t.history.emptyTitle}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            {t.history.emptyDesc}
          </p>
          <Link
            to="/predict"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            <span>Scan Crop Leaf Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Records Grid */}
      {!isLoading && records.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {records.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                    {record.crop}
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    record.is_healthy 
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-rose-100 text-rose-800"
                  }`}>
                    {record.confidence}%
                  </span>
                </div>

                <div className="h-40 rounded-xl bg-stone-100 overflow-hidden mb-3 border border-stone-200">
                  {record.image_url ? (
                    <img
                      src={record.image_url}
                      alt={record.disease}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      🌿
                    </div>
                  )}
                </div>

                <h3 className="text-sm font-bold text-stone-900 line-clamp-1">
                  {record.disease}
                </h3>

                <div className="flex items-center gap-1 text-[11px] text-stone-400 mt-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {record.created_at ? new Date(record.created_at).toLocaleDateString([], {
                      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                    }) : "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => record.id && handleOpenDetails(record.id)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t.history.viewDetails}</span>
                </button>

                <button
                  type="button"
                  onClick={() => record.id && handleDelete(record.id)}
                  disabled={isDeleting === record.id}
                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedRecord(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                {selectedRecord.crop} Record #{selectedRecord.id}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
                {selectedRecord.disease}
              </h2>
            </div>

            <ConfidenceBar
              confidence={selectedRecord.confidence}
              severity={selectedRecord.severity}
              isHealthy={selectedRecord.is_healthy}
            />

            {selectedRecord.description && (
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {selectedRecord.description}
              </p>
            )}

            {/* Treatments */}
            {selectedRecord.treatment && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
                  <h4 className="font-bold flex items-center gap-1.5">
                    <span>🌿</span> Organic Remediation
                  </h4>
                  <ul className="space-y-1">
                    {selectedRecord.treatment.organic?.map((t, idx) => (
                      <li key={idx}>• {t}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                  <h4 className="font-bold flex items-center gap-1.5">
                    <span>🧪</span> Chemical Sprays
                  </h4>
                  <ul className="space-y-1">
                    {selectedRecord.treatment.chemical?.map((t, idx) => (
                      <li key={idx}>• {t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
