"use client";

import React, { useState, useEffect } from "react";
import CameraView from "@/components/CameraView";
import DiagnosisResult from "@/components/DiagnosisResult";
import ScanHistoryModal from "@/components/ScanHistoryModal";
import SettingsModal from "@/components/SettingsModal";
import { PlantDiagnosis } from "@/types/diagnosis";
import {
  CameraIcon,
  SparklesIcon,
  HistoryIcon,
  SettingsIcon,
  SproutIcon,
  LeafIcon,
  AlertTriangleIcon
} from "@/components/Icons";

type ScreenState = "camera" | "analyzing" | "result";

export default function Home() {
  const [screen, setScreen] = useState<ScreenState>("camera");
  const [currentDiagnosis, setCurrentDiagnosis] = useState<PlantDiagnosis | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [history, setHistory] = useState<PlantDiagnosis[]>([]);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("agri_scan_history");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch {}
  }, []);

  // Save history to localStorage
  const saveToHistory = (diagnosis: PlantDiagnosis) => {
    try {
      if (localStorage.getItem("agri_auto_save") === "false") return;
    } catch {}

    setHistory((prev) => {
      if (prev.some((item) => item.id === diagnosis.id)) return prev;
      const updated = [diagnosis, ...prev].slice(0, 30);
      try {
        localStorage.setItem("agri_scan_history", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("agri_scan_history");
    } catch {}
  };

  // Main Image Analysis Pipeline
  const handleAnalyzeImage = async (base64Image: string) => {
    setCapturedImage(base64Image);
    setScreen("analyzing");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image: base64Image
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.details || errorData.error || `Error analyzing image (${response.status})`
        );
      }

      const result = await response.json();

      if (result.data) {
        setCurrentDiagnosis(result.data);
        saveToHistory(result.data);
        setScreen("result");
      } else {
        throw new Error("Could not detect plant diagnosis.");
      }
    } catch (err: any) {
      console.error("Analysis error:", err);
      setErrorMessage(
        err.message || "Could not analyze leaf. Please ensure leaf is in good lighting."
      );
      setScreen("camera");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#172714] flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#4B7D3F]/40 via-[#1D3318]/50 to-[#142211]" />

      {/* Main Container */}
      <main className="relative w-full sm:max-w-md h-[100dvh] sm:h-[860px] bg-[#F4F7F2] sm:rounded-[36px] overflow-hidden shadow-2xl flex flex-col border border-[#2E4F24]/50 z-10">
        {/* Header - Minimal & Clean */}
        <header className="shrink-0 flex items-center justify-between px-5 py-3 bg-[#203A19] text-white safe-top border-b border-[#2C4E23]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#2F5427] border border-[#8EC349]/30 flex items-center justify-center text-[#8EC349]">
              <SproutIcon size={16} />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">AgriGuard</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHistoryOpen(true)}
              className="p-2 rounded-full bg-[#2B4C22] hover:bg-[#365E2B] text-white/90 border border-white/10 transition active:scale-90"
              title="History"
              aria-label="History"
            >
              <HistoryIcon size={16} />
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-full bg-[#2B4C22] hover:bg-[#365E2B] text-white/90 border border-white/10 transition active:scale-90"
              title="Settings"
              aria-label="Settings"
            >
              <SettingsIcon size={16} />
            </button>
          </div>
        </header>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="bg-[#FEE2E2] text-[#991B1B] border-b border-[#FCA5A5] px-4 py-2 text-xs font-medium flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5">
              <AlertTriangleIcon size={14} className="shrink-0" />
              <span className="truncate max-w-[280px]">{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-[#991B1B] font-bold text-xs ml-2 hover:opacity-75"
            >
              ✕
            </button>
          </div>
        )}

        {/* Central Screen Body */}
        <div className="flex-1 w-full overflow-hidden relative flex flex-col">
          {screen === "camera" && (
            <CameraView
              onCapture={handleAnalyzeImage}
              isAnalyzing={false}
            />
          )}

          {screen === "analyzing" && (
            <div className="relative flex-1 w-full bg-[#142211] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
              {/* Captured Photo with Scanning Laser */}
              <div className="relative w-60 h-60 rounded-3xl overflow-hidden border-2 border-[#8EC349] shadow-[0_0_30px_rgba(142,195,73,0.3)] bg-black mb-6">
                {capturedImage && (
                  <img
                    src={capturedImage}
                    alt="Scanning leaf"
                    className="w-full h-full object-cover filter brightness-90"
                  />
                )}
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#A6D865] to-transparent shadow-[0_0_16px_#A6D865] animate-scan-laser" />
                <div className="absolute inset-0 bg-[#8EC349]/10" />
              </div>

              {/* Minimal Clean Status: Simply "Analyzing image..." */}
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-[#A6D865] font-semibold text-sm">
                  <SparklesIcon size={18} className="animate-spin text-[#8EC349]" />
                  <span>Analyzing image...</span>
                </div>
                <div className="w-36 h-1.5 bg-[#2B4C22] rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#4B7D3F] via-[#8EC349] to-[#A6D865] rounded-full w-2/3 animate-pulse" />
                </div>
              </div>
            </div>
          )}

          {screen === "result" && currentDiagnosis && (
            <DiagnosisResult
              diagnosis={currentDiagnosis}
              onScanAnother={() => {
                setScreen("camera");
                setCapturedImage(null);
              }}
              onSaveToHistory={saveToHistory}
            />
          )}
        </div>

        {/* Bottom Navigation Bar */}
        <nav className="shrink-0 flex items-center justify-around px-4 py-2 bg-white border-t border-[#E0E8DC] safe-bottom shadow-lg">
          <button
            onClick={() => setScreen("camera")}
            className={`flex flex-col items-center gap-0.5 transition ${
              screen === "camera" ? "text-[#203A19] font-bold" : "text-[#71846C] hover:text-[#203A19]"
            }`}
          >
            <CameraIcon size={20} className={screen === "camera" ? "text-[#4B7D3F]" : ""} />
            <span className="text-[10px]">Scanner</span>
          </button>

          <button
            onClick={() => {
              if (currentDiagnosis) setScreen("result");
            }}
            disabled={!currentDiagnosis}
            className={`flex flex-col items-center gap-0.5 transition ${
              screen === "result"
                ? "text-[#203A19] font-bold"
                : currentDiagnosis
                ? "text-[#71846C] hover:text-[#203A19]"
                : "text-gray-300 cursor-not-allowed"
            }`}
          >
            <LeafIcon size={20} className={screen === "result" ? "text-[#4B7D3F]" : ""} />
            <span className="text-[10px]">Report</span>
          </button>

          <button
            onClick={() => setHistoryOpen(true)}
            className="flex flex-col items-center gap-0.5 text-[#71846C] hover:text-[#203A19] transition"
          >
            <HistoryIcon size={20} />
            <span className="text-[10px]">History</span>
          </button>

          <button
            onClick={() => setSettingsOpen(true)}
            className="flex flex-col items-center gap-0.5 text-[#71846C] hover:text-[#203A19] transition"
          >
            <SettingsIcon size={20} />
            <span className="text-[10px]">Settings</span>
          </button>
        </nav>
      </main>

      {/* Field History Modal */}
      <ScanHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onSelectScan={(diag) => {
          setCurrentDiagnosis(diag);
          setScreen("result");
        }}
        onClearHistory={clearHistory}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onClearHistory={clearHistory}
      />
    </div>
  );
}
