import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Camera, 
  Upload, 
  RefreshCw, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ShieldAlert, 
  Layers, 
  FileText, 
  ArrowRight,
  Info,
  History,
  CornerDownRight,
  Flame,
  Check
} from "lucide-react";
import { api } from "../services/api";
import type { PredictionResult } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import { ConfidenceBar } from "../components/ConfidenceBar";

export const PredictPage: React.FC = () => {
  const { t, language } = useLanguage();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cropHint, setCropHint] = useState<string>("");
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError(null);
    setError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(t.predict.cameraNotSupported);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError(t.predict.cameraPermissionDenied);
      } else {
        setCameraError(`${t.predict.cameraError} (${err.message || "Unknown hardware error"})`);
      }
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `leaf_capture_${Date.now()}.jpg`, { type: "image/jpeg" });
          handleFileSelection(file);
          stopCameraStream();
        }
      }, "image/jpeg", 0.92);
    }
  };

  const handleFileSelection = (file: File) => {
    setError(null);
    setPrediction(null);
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setPrediction(null);
    setError(null);
    stopCameraStream();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select or capture a crop leaf image first.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await api.predictDisease(selectedFile, cropHint || undefined);
      if (res.data) {
        setPrediction(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to analyze leaf image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Multispectral AI Computer Vision</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          {t.predict.title}
        </h1>
        <p className="text-sm text-stone-600 max-w-xl mx-auto">
          {t.predict.subtitle}
        </p>
      </div>

      {/* Main Upload / Camera Workspace */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            {prediction ? "Diagnosis Result Ready" : t.predict.step1}
          </span>
          <span className="text-xs text-stone-400 font-medium">
            Supported: Potato • Tomato • Rice • Wheat • Pea
          </span>
        </div>

        {/* Camera Live Stream View */}
        {isCameraActive ? (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-h-[420px] flex items-center justify-center">
              <video
                ref={videoRef}
                playsInline
                autoPlay
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Viewfinder crosshairs */}
              <div className="absolute inset-8 border-2 border-white/50 rounded-xl pointer-events-none flex items-center justify-center">
                <span className="text-xs text-white/80 bg-black/40 px-3 py-1 rounded-full backdrop-blur">
                  Position leaf in center
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={capturePhoto}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-emerald-600/30 transition-all hover:scale-105"
              >
                <Camera className="w-4 h-4" />
                {t.predict.capturePhoto}
              </button>
              <button
                type="button"
                onClick={stopCameraStream}
                className="px-5 py-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-semibold text-sm transition-colors"
              >
                {t.predict.stopCamera}
              </button>
            </div>
          </div>
        ) : previewUrl ? (
          /* Image Selected & Preview */
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 max-h-[380px] flex items-center justify-center">
              <img
                src={previewUrl}
                alt="Selected plant leaf"
                className="max-h-[380px] w-auto object-contain mx-auto"
              />
              <button
                type="button"
                onClick={clearSelection}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                title={t.predict.removeImage}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Optional Crop Hint Dropdown */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block">
                  {t.predict.cropSelectLabel}
                </label>
                <span className="text-[11px] text-stone-500">
                  Select crop type if known, or leave as Auto.
                </span>
              </div>
              <select
                value={cropHint}
                onChange={(e) => setCropHint(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-sm font-medium text-stone-800 focus:outline-emerald-600"
              >
                <option value="">{t.predict.allCropsAuto}</option>
                <option value="Potato">Potato (आलू)</option>
                <option value="Tomato">Tomato (टमाटर)</option>
                <option value="Rice">Rice (धान)</option>
                <option value="Wheat">Wheat (गेहूं)</option>
                <option value="Pea">Pea (मटर)</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold"
                >
                  {t.predict.changeImage}
                </button>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="px-4 py-2.5 rounded-xl text-stone-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold"
                >
                  {t.predict.removeImage}
                </button>
              </div>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02]"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t.predict.analyzingBtn}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{t.predict.analyzeBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Dropzone & Camera Trigger */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all ${
              isDragging
                ? "border-emerald-600 bg-emerald-50/50 scale-[1.01]"
                : "border-stone-300 hover:border-emerald-500 bg-stone-50/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileSelection(e.target.files[0]);
                }
              }}
            />

            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-xs">
              <Upload className="w-8 h-8" />
            </div>

            <h3 className="text-base font-bold text-stone-900 mb-1">
              {t.predict.dragDropText}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
              Upload clear leaf photographs taken in daylight showing symptoms clearly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-stone-300 hover:border-emerald-600 text-stone-800 font-semibold text-sm shadow-xs transition-colors"
              >
                {t.predict.browseFiles}
              </button>
              <button
                type="button"
                onClick={startCamera}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span>{t.predict.useCamera}</span>
              </button>
            </div>
          </div>
        )}

        {/* Camera Permission / Error Alert */}
        {cameraError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <p className="font-bold">Camera Access Issue</p>
              <p className="mt-0.5">{cameraError}</p>
              <p className="mt-1 text-stone-600">
                You can still upload pictures directly from your device using the file browser.
              </p>
            </div>
          </div>
        )}

        {/* General Error Banner */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <p className="font-bold">Diagnosis Error</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Prediction Result Display Card */}
      {prediction && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm animate-in fade-in duration-300">
          {/* Header Banner */}
          <div className={`p-6 sm:p-8 text-white ${
            prediction.is_healthy
              ? "bg-linear-to-r from-emerald-800 to-teal-800"
              : prediction.severity.toLowerCase() === "critical"
              ? "bg-linear-to-r from-rose-900 to-stone-900"
              : "bg-linear-to-r from-amber-800 to-stone-900"
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold tracking-wider uppercase text-emerald-300">
                  Identified Crop: {prediction.crop} {language === "hi" && `(${prediction.crop_hi})`}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
                  {language === "hi" && prediction.disease_hi ? prediction.disease_hi : prediction.disease}
                </h2>
                {language === "hi" && (
                  <p className="text-xs text-stone-300 mt-1 font-mono">
                    {prediction.disease}
                  </p>
                )}
              </div>

              <div className="shrink-0">
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  prediction.is_healthy 
                    ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400"
                    : "bg-rose-500/20 text-rose-200 border border-rose-400"
                }`}>
                  {prediction.is_healthy ? (
                    <><Check className="w-4 h-4" /> {t.predict.healthyStatus}</>
                  ) : (
                    <><ShieldAlert className="w-4 h-4" /> {t.predict.infectedStatus}</>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Confidence Bar */}
            <ConfidenceBar
              confidence={prediction.confidence}
              severity={prediction.severity}
              isHealthy={prediction.is_healthy}
            />

            {/* Description */}
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider text-xs">
                Agronomic Condition Overview
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed">
                {language === "hi" && prediction.description_hi
                  ? prediction.description_hi
                  : prediction.description}
              </p>
            </div>

            {/* Symptoms */}
            {prediction.symptoms && prediction.symptoms.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  {t.predict.symptomsTitle}
                </h4>
                <ul className="space-y-1.5">
                  {(language === "hi" && prediction.symptoms_hi?.length ? prediction.symptoms_hi : prediction.symptoms).map((symptom, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                      <CornerDownRight className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Treatment Cards (Organic vs Chemical) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Organic */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌿</span>
                  <h4 className="text-sm font-bold text-emerald-950">
                    {t.predict.organicTreatmentTitle}
                  </h4>
                </div>
                <ul className="space-y-2 text-xs text-emerald-900">
                  {prediction.treatment.organic.map((treat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{treat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Chemical */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🧪</span>
                  <h4 className="text-sm font-bold text-amber-950">
                    {t.predict.chemicalTreatmentTitle}
                  </h4>
                </div>
                <ul className="space-y-2 text-xs text-amber-900">
                  {prediction.treatment.chemical.map((chem, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                      <span>{chem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Prevention & Next Steps */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                {t.predict.preventionTitle}
              </h4>
              <ul className="space-y-1.5 text-xs text-stone-700">
                {prediction.prevention.map((prev, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{prev}</span>
                  </li>
                ))}
              </ul>
              {prediction.next_steps && (
                <div className="pt-2 border-t border-stone-200 text-xs text-stone-800 font-semibold">
                  <span className="text-emerald-700 font-bold">Action Alert: </span>
                  {prediction.next_steps}
                </div>
              )}
            </div>

            {/* Top Predictions Transparency Breakdown */}
            {prediction.top_predictions && prediction.top_predictions.length > 1 && (
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Model Confidence Breakdown</span>
                </div>
                <div className="space-y-2">
                  {prediction.top_predictions.map((top, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-stone-600">
                      <span>{top.crop} – {top.disease}</span>
                      <span className="font-bold font-mono">{top.confidence.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Responsible Use Disclaimer */}
            <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-stone-600 text-[11px] leading-relaxed flex items-start gap-2.5">
              <Info className="w-4 h-4 shrink-0 text-stone-500 mt-0.5" />
              <p>{t.predict.disclaimer}</p>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={clearSelection}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-colors"
              >
                {t.predict.newPrediction}
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  to="/assistant"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-sm text-center transition-colors"
                >
                  Consult AI Assistant on this Disease
                </Link>
                <Link
                  to="/history"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-sm text-center transition-colors"
                >
                  {t.nav.history}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
