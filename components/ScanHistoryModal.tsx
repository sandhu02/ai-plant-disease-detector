"use client";

import React from "react";
import { PlantDiagnosis } from "@/types/diagnosis";
import {
  XIcon,
  Trash2Icon,
  SproutIcon,
  HistoryIcon,
  ChevronRightIcon,
  AlertTriangleIcon,
  CheckCircleIcon
} from "./Icons";

interface ScanHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: PlantDiagnosis[];
  onSelectScan: (diagnosis: PlantDiagnosis) => void;
  onClearHistory: () => void;
}

export default function ScanHistoryModal({
  isOpen,
  onClose,
  history,
  onSelectScan,
  onClearHistory
}: ScanHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md max-h-[85vh] bg-[#F4F7F2] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-[#E0E8DC]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-[#E0E8DC]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#EBF1E6] text-[#2F5427] flex items-center justify-center">
              <HistoryIcon size={16} />
            </div>
            <h3 className="text-sm font-bold text-[#192A15]">History</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#61735B] transition active:scale-95"
            aria-label="Close"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {history.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center px-4">
              <div className="w-14 h-14 rounded-full bg-[#E8EFE5] text-[#4B7D3F] flex items-center justify-center mb-3">
                <SproutIcon size={28} />
              </div>
              <h4 className="text-sm font-bold text-[#192A15] mb-1">No Past Scans Yet</h4>
              <p className="text-xs text-[#61735B] max-w-xs leading-relaxed">
                Take a photo of a leaf or test with sample leaves to build your field log.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectScan(item);
                  onClose();
                }}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white hover:bg-[#F9FAF8] border border-[#E0E8DC] transition cursor-pointer active:scale-[0.98] shadow-xs group"
              >
                <img
                  src={item.imageUrl}
                  alt={item.plantName}
                  className="w-14 h-14 rounded-xl object-cover border border-[#D7E3D1] shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        item.severity === "Urgent"
                          ? "bg-[#FEECEB] text-[#DC2626]"
                          : item.severity === "Moderate"
                          ? "bg-[#FEF3C7] text-[#D97706]"
                          : "bg-[#E8F5E9] text-[#2E7D32]"
                      }`}
                    >
                      {item.severity}
                    </span>
                    <span className="text-[10px] text-[#869581]">
                      {new Date(item.timestamp).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric"
                      })}
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-[#192A15] truncate group-hover:text-[#2F5427] transition">
                    {item.condition}
                  </h5>
                  <p className="text-[11px] text-[#61735B] truncate mt-0.5">
                    {item.plantName}
                  </p>
                </div>

                <ChevronRightIcon size={16} className="text-[#869581] group-hover:translate-x-0.5 transition" />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="px-5 py-3 bg-white border-t border-[#E0E8DC] flex justify-between items-center">
            <button
              onClick={onClearHistory}
              className="text-xs font-semibold text-[#DC2626] hover:text-[#B91C1C] flex items-center gap-1 transition"
            >
              <Trash2Icon size={14} />
              Clear History
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#203A19] text-white text-xs font-semibold hover:bg-[#182C13] transition active:scale-95"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
