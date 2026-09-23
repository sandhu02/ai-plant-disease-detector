"use client";

import React, { useState, useEffect } from "react";
import { PlantDiagnosis } from "@/types/diagnosis";
import {
  ArrowLeftIcon,
  Volume2Icon,
  VolumeXIcon,
  Share2Icon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  SproutIcon,
  FlaskIcon,
  DropletIcon,
  SunIcon,
  BugIcon,
  CameraIcon
} from "./Icons";

interface DiagnosisResultProps {
  diagnosis: PlantDiagnosis;
  onScanAnother: () => void;
  onSaveToHistory?: (diagnosis: PlantDiagnosis) => void;
}

export default function DiagnosisResult({
  diagnosis,
  onScanAnother,
  onSaveToHistory
}: DiagnosisResultProps) {
  const [activeTab, setActiveTab] = useState<"organic" | "chemical" | "symptoms" | "prevention">(
    "organic"
  );
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    // Check auto-read setting
    try {
      if (localStorage.getItem("agri_auto_voice") === "true") {
        setTimeout(() => toggleSpeech(), 400);
      }
    } catch {}

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Toggle Voice Readout
  const toggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${diagnosis.plantName}. ${diagnosis.condition}. Severity: ${
      diagnosis.severity
    }. Immediate action: ${diagnosis.immediateAction}. Treatment: ${diagnosis.organicTreatment.join(
      ", "
    )}.`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Copy or Share report
  const handleShare = async () => {
    const shareText = `${diagnosis.plantName} - ${diagnosis.condition} (${diagnosis.severity})\nAction: ${diagnosis.immediateAction}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: diagnosis.plantName,
          text: shareText
        });
        return;
      } catch {}
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Save to history callback
  const handleSave = () => {
    if (onSaveToHistory) {
      onSaveToHistory(diagnosis);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  // Severity color schemes
  const severityColors = {
    Urgent: {
      bg: "bg-[#FEECEB]",
      text: "text-[#DC2626]",
      border: "border-[#FCA5A5]",
      badge: "bg-[#DC2626] text-white"
    },
    Moderate: {
      bg: "bg-[#FEF3C7]",
      text: "text-[#D97706]",
      border: "border-[#FCD34D]",
      badge: "bg-[#D97706] text-white"
    },
    Mild: {
      bg: "bg-[#F0FDF4]",
      text: "text-[#16A34A]",
      border: "border-[#BBF7D0]",
      badge: "bg-[#16A34A] text-white"
    },
    Healthy: {
      bg: "bg-[#E8F5E9]",
      text: "text-[#2E7D32]",
      border: "border-[#A5D6A7]",
      badge: "bg-[#2E7D32] text-white"
    }
  };

  const currentTheme =
    severityColors[diagnosis.severity as keyof typeof severityColors] ||
    severityColors.Moderate;

  return (
    <div className="flex flex-col h-full w-full bg-[#F4F7F2] overflow-y-auto no-scrollbar pb-24">
      {/* Top Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-[#E0E8DC]">
        <button
          onClick={onScanAnother}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#EBF1E6] hover:bg-[#DEE8D8] text-[#203A19] text-xs font-semibold transition active:scale-95"
        >
          <ArrowLeftIcon size={15} />
          <span>Back</span>
        </button>

        <span className="text-xs font-bold text-[#192A15]">Diagnosis</span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleSpeech}
            className={`p-2 rounded-full border transition active:scale-90 ${
              isSpeaking
                ? "bg-[#DC2626] text-white border-[#DC2626] animate-pulse"
                : "bg-[#EBF1E6] text-[#203A19] border-[#D7E3D1]"
            }`}
            title="Read aloud"
            aria-label="Toggle voice"
          >
            {isSpeaking ? <VolumeXIcon size={16} /> : <Volume2Icon size={16} />}
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-[#EBF1E6] text-[#203A19] border border-[#D7E3D1] transition active:scale-90"
            title="Share"
            aria-label="Share"
          >
            <Share2Icon size={16} />
          </button>
        </div>
      </div>

      {copied && (
        <div className="bg-[#203A19] text-[#A6D865] text-xs font-medium py-1 px-4 text-center transition">
          Copied to clipboard
        </div>
      )}

      {/* Main Content */}
      <div className="p-4 space-y-3">
        {/* Hero Card */}
        <div className="rounded-3xl bg-white border border-[#E0E8DC] p-3.5 shadow-xs overflow-hidden">
          <div className="flex gap-3.5 items-center">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-[#D7E3D1] bg-black/5">
              <img
                src={diagnosis.imageUrl}
                alt={diagnosis.plantName}
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute bottom-1 right-1 px-1 py-0.5 rounded text-[8px] font-bold ${currentTheme.badge}`}
              >
                {diagnosis.confidence}%
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border mb-1 ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border}`}
              >
                {diagnosis.isHealthy ? (
                  <CheckCircleIcon size={11} />
                ) : (
                  <AlertTriangleIcon size={11} />
                )}
                {diagnosis.severity}
              </span>

              <h2 className="text-sm font-bold text-[#192A15] leading-snug truncate">
                {diagnosis.condition}
              </h2>
              <p className="text-[11px] font-medium text-[#4B7D3F] mt-0.5 flex items-center gap-1 truncate">
                <SproutIcon size={12} className="shrink-0" />
                <span className="truncate">{diagnosis.plantName}</span>
              </p>
            </div>
          </div>

          {diagnosis.description && (
            <p className="mt-2.5 pt-2.5 border-t border-[#EDF2EB] text-[11px] text-[#4A5944] leading-relaxed">
              {diagnosis.description}
            </p>
          )}
        </div>

        {/* Rapid Indicator Badges */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-white border border-[#E0E8DC] p-2.5 shadow-xs">
            <span className="text-[9px] font-semibold uppercase text-[#61735B] block mb-0.5">Type</span>
            <span className="text-xs font-bold text-[#192A15] truncate block">
              {diagnosis.pathogen}
            </span>
          </div>

          <div className="rounded-2xl bg-white border border-[#E0E8DC] p-2.5 shadow-xs">
            <span className="text-[9px] font-semibold uppercase text-[#61735B] block mb-0.5">Moisture</span>
            <span className="text-xs font-bold text-[#192A15] truncate block">
              {diagnosis.metrics.moisture}
            </span>
          </div>

          <div className="rounded-2xl bg-white border border-[#E0E8DC] p-2.5 shadow-xs">
            <span className="text-[9px] font-semibold uppercase text-[#61735B] block mb-0.5">Spread Risk</span>
            <span
              className={`text-xs font-bold truncate block ${
                diagnosis.metrics.spreadRisk === "High"
                  ? "text-[#DC2626]"
                  : diagnosis.metrics.spreadRisk === "Moderate"
                  ? "text-[#D97706]"
                  : "text-[#16A34A]"
              }`}
            >
              {diagnosis.metrics.spreadRisk}
            </span>
          </div>
        </div>

        {/* Immediate Action */}
        {diagnosis.immediateAction && (
          <div className="rounded-2xl bg-[#203A19] p-3.5 text-white shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A6D865] block mb-1">
              Immediate Action
            </span>
            <p className="text-xs font-medium text-white/95 leading-snug">
              {diagnosis.immediateAction}
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex rounded-2xl bg-[#E8EFE5] p-1 border border-[#D7E3D1]">
          <button
            onClick={() => setActiveTab("organic")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
              activeTab === "organic"
                ? "bg-white text-[#203A19] shadow-xs"
                : "text-[#61735B]"
            }`}
          >
            Organic
          </button>
          <button
            onClick={() => setActiveTab("chemical")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
              activeTab === "chemical"
                ? "bg-white text-[#203A19] shadow-xs"
                : "text-[#61735B]"
            }`}
          >
            Chemical
          </button>
          <button
            onClick={() => setActiveTab("symptoms")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
              activeTab === "symptoms"
                ? "bg-white text-[#203A19] shadow-xs"
                : "text-[#61735B]"
            }`}
          >
            Symptoms
          </button>
          <button
            onClick={() => setActiveTab("prevention")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
              activeTab === "prevention"
                ? "bg-white text-[#203A19] shadow-xs"
                : "text-[#61735B]"
            }`}
          >
            Care
          </button>
        </div>

        {/* Tab Content */}
        <div className="rounded-3xl bg-white border border-[#E0E8DC] p-3.5 shadow-xs">
          {activeTab === "organic" && (
            <div className="space-y-2">
              {diagnosis.organicTreatment.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2 rounded-xl bg-[#F8FAF6] border border-[#E8EFE5] text-xs text-[#2A3B24]"
                >
                  <span className="w-4 h-4 rounded-full bg-[#E0EDD9] text-[#2F5427] font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "chemical" && (
            <div className="space-y-2">
              {diagnosis.chemicalTreatment.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2 rounded-xl bg-[#FFFDF5] border border-[#FDE68A]/60 text-xs text-[#3D3012]"
                >
                  <FlaskIcon size={14} className="text-[#D97706] shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "symptoms" && (
            <div className="space-y-2">
              {diagnosis.symptoms.map((symptom, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2 rounded-xl bg-[#F4F7FB] border border-[#E0E7FF] text-xs text-[#1E293B]"
                >
                  <span className="text-[#3B82F6] font-bold">•</span>
                  <span>{symptom}</span>
                </div>
              ))}
              {diagnosis.causes && (
                <p className="text-[11px] text-[#61735B] pt-2 border-t border-[#EDF2EB] mt-2">
                  <strong className="text-[#192A15]">Cause:</strong> {diagnosis.causes}
                </p>
              )}
            </div>
          )}

          {activeTab === "prevention" && (
            <div className="space-y-2">
              {diagnosis.prevention.map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#14532D]"
                >
                  <ShieldCheckIcon size={14} className="text-[#16A34A] shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={onScanAnother}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#203A19] hover:bg-[#182C13] text-white font-semibold text-xs transition active:scale-95"
          >
            <CameraIcon size={16} className="text-[#A6D865]" />
            <span>Scan Another</span>
          </button>

          {onSaveToHistory && (
            <button
              onClick={handleSave}
              disabled={saved}
              className="py-3 px-4 rounded-2xl bg-white border border-[#D7E3D1] text-[#203A19] font-semibold text-xs transition active:scale-95 flex items-center gap-1.5"
            >
              <CheckCircleIcon
                size={15}
                className={saved ? "text-[#16A34A]" : "text-[#61735B]"}
              />
              <span>{saved ? "Saved" : "Save"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
