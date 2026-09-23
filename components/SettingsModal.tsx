"use client";

import React, { useState, useEffect } from "react";
import { XIcon, SettingsIcon, Trash2Icon, CheckCircleIcon } from "./Icons";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearHistory: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  onClearHistory
}: SettingsModalProps) {
  const [autoVoice, setAutoVoice] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [clearedNotice, setClearedNotice] = useState(false);

  useEffect(() => {
    try {
      const voice = localStorage.getItem("agri_auto_voice") === "true";
      const save = localStorage.getItem("agri_auto_save") !== "false";
      setAutoVoice(voice);
      setAutoSave(save);
    } catch {}
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleVoice = () => {
    const next = !autoVoice;
    setAutoVoice(next);
    try {
      localStorage.setItem("agri_auto_voice", String(next));
    } catch {}
  };

  const toggleSave = () => {
    const next = !autoSave;
    setAutoSave(next);
    try {
      localStorage.setItem("agri_auto_save", String(next));
    } catch {}
  };

  const handleClear = () => {
    onClearHistory();
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#F4F7F2] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-[#E0E8DC]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-[#E0E8DC]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#EBF1E6] text-[#2F5427] flex items-center justify-center">
              <SettingsIcon size={16} />
            </div>
            <h3 className="text-sm font-bold text-[#192A15]">Settings</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#61735B] transition active:scale-95"
            aria-label="Close"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Options */}
        <div className="p-4 space-y-3 text-xs">
          {/* Audio toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#E0E8DC]">
            <div>
              <span className="font-semibold text-[#192A15] block">Voice Guidance</span>
              <span className="text-[11px] text-[#61735B]">Read diagnosis aloud</span>
            </div>
            <button
              onClick={toggleVoice}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                autoVoice ? "bg-[#4B7D3F]" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  autoVoice ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Auto save toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#E0E8DC]">
            <div>
              <span className="font-semibold text-[#192A15] block">Save Scans</span>
              <span className="text-[11px] text-[#61735B]">Store history on device</span>
            </div>
            <button
              onClick={toggleSave}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                autoSave ? "bg-[#4B7D3F]" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  autoSave ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Clear history */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E0E8DC] flex items-center justify-between">
            <span className="font-semibold text-[#192A15]">Clear History</span>
            <button
              onClick={handleClear}
              className="px-3 py-1.5 rounded-xl border border-[#FCA5A5] text-[#DC2626] font-semibold text-xs hover:bg-[#FEECEB] transition active:scale-95 flex items-center gap-1"
            >
              {clearedNotice ? (
                <>
                  <CheckCircleIcon size={13} className="text-[#16A34A]" />
                  <span className="text-[#16A34A]">Cleared</span>
                </>
              ) : (
                <>
                  <Trash2Icon size={13} />
                  <span>Clear</span>
                </>
              )}
            </button>
          </div>

          {/* App Info */}
          <div className="pt-2 text-center text-[#869581] text-[11px]">
            <span>AgriGuard • Plant Disease Detector v1.0</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-white border-t border-[#E0E8DC] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#203A19] text-white font-semibold text-xs hover:bg-[#182C13] transition active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
