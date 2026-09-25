import React from "react";
import { CheckCircle2, AlertTriangle, AlertOctagon, Info } from "lucide-react";

interface ConfidenceBarProps {
  confidence: number;
  severity?: string;
  isHealthy?: boolean;
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ confidence, severity = "Moderate", isHealthy = false }) => {
  // Determine color and status badge
  let barColor = "bg-amber-500";
  let textColor = "text-amber-700";
  let bgColor = "bg-amber-50 border-amber-200";
  let Icon = AlertTriangle;

  if (isHealthy) {
    barColor = "bg-emerald-500";
    textColor = "text-emerald-700";
    bgColor = "bg-emerald-50 border-emerald-200";
    Icon = CheckCircle2;
  } else if (severity.toLowerCase() === "critical") {
    barColor = "bg-rose-600";
    textColor = "text-rose-700";
    bgColor = "bg-rose-50 border-rose-200";
    Icon = AlertOctagon;
  } else if (severity.toLowerCase() === "high") {
    barColor = "bg-orange-500";
    textColor = "text-orange-700";
    bgColor = "bg-orange-50 border-orange-200";
    Icon = AlertTriangle;
  } else if (severity.toLowerCase() === "low") {
    barColor = "bg-sky-500";
    textColor = "text-sky-700";
    bgColor = "bg-sky-50 border-sky-200";
    Icon = Info;
  }

  // Ensure confidence is between 0 and 100
  const clampedConfidence = Math.min(Math.max(confidence, 0), 100);

  return (
    <div className={`p-4 rounded-xl border ${bgColor}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${textColor}`} />
          <span className={`text-sm font-bold ${textColor}`}>
            {isHealthy ? "Condition: Healthy Plant" : `Severity: ${severity}`}
          </span>
        </div>
        <span className={`text-lg font-extrabold ${textColor}`}>
          {clampedConfidence.toFixed(1)}% Match
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full bg-stone-200/80 rounded-full h-3 overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${clampedConfidence}%` }}
        />
      </div>

      <div className="flex justify-between items-center mt-1.5 text-[11px] text-stone-500 font-medium">
        <span>Low Confidence</span>
        <span>Standard Precision Range</span>
        <span>High Confidence</span>
      </div>
    </div>
  );
};
