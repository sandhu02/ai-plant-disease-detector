"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  CameraIcon,
  FlipCameraIcon,
  UploadIcon,
  ZapIcon
} from "./Icons";

interface CameraViewProps {
  onCapture: (base64Image: string) => void;
  isAnalyzing: boolean;
}

export default function CameraView({
  onCapture,
  isAnalyzing
}: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Initialize and stop camera stream
  const startCamera = useCallback(async () => {
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCamera(false);
        return;
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setHasCamera(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Check torch capability
      const track = mediaStream.getVideoTracks()[0];
      const capabilities: any = track.getCapabilities ? track.getCapabilities() : {};
      setHasTorch(Boolean(capabilities.torch));
    } catch {
      setHasCamera(false);
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // Toggle Torch/Flash
  const toggleTorch = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    try {
      const newTorch = !torchOn;
      await (track as any).applyConstraints({
        advanced: [{ torch: newTorch }]
      });
      setTorchOn(newTorch);
    } catch (err) {
      console.warn("Torch failed:", err);
    }
  };

  // Flip Camera
  const flipCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  // Resize and compress high-res mobile photos
  const processAndResizeImage = (fileOrBlob: File | Blob) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement("canvas");
        const MAX_DIM = 1440;
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_DIM) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else if (height > MAX_DIM) {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.88);
          onCapture(compressedDataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(fileOrBlob);
  };

  // Single unified shutter trigger
  const capturePhoto = () => {
    if (isAnalyzing) return;

    if (hasCamera && videoRef.current && videoRef.current.videoWidth > 0) {
      const video = videoRef.current;
      const canvas = canvasRef.current || document.createElement("canvas");
      canvas.width = video.videoWidth || 1080;
      canvas.height = video.videoHeight || 1920;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        onCapture(dataUrl);
        return;
      }
    }

    // Direct native camera trigger
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full bg-[#142211] overflow-hidden select-none">
      <canvas ref={canvasRef} className="hidden" />

      {/* Mobile Native Camera Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processAndResizeImage(file);
        }}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Gallery Input */}
      <input
        type="file"
        ref={galleryInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processAndResizeImage(file);
        }}
        accept="image/*"
        className="hidden"
      />

      {/* Viewfinder */}
      <div
        onClick={() => {
          if (!hasCamera) capturePhoto();
        }}
        className={`relative flex-1 w-full bg-black overflow-hidden flex items-center justify-center ${
          !hasCamera ? "cursor-pointer" : ""
        }`}
      >
        {hasCamera ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          /* Standby Viewfinder */
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#182C13] via-[#142211] to-[#0F1A0D]">
            <div className="relative w-64 h-64 rounded-3xl border-2 border-dashed border-[#8EC349]/70 flex flex-col items-center justify-center p-4 bg-[#233C1D]/30 backdrop-blur-sm shadow-[0_0_24px_rgba(142,195,73,0.15)]">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#8EC349] rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#8EC349] rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#8EC349] rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#8EC349] rounded-br-2xl" />

              <div className="w-16 h-16 rounded-full bg-[#4B7D3F]/40 border border-[#8EC349] flex items-center justify-center text-[#A6D865] mb-3 animate-agri-pulse">
                <CameraIcon size={30} />
              </div>

              <span className="text-sm font-semibold text-white">Tap to capture leaf</span>
            </div>
          </div>
        )}

        {/* Framing Grid Overlay (when camera is live) */}
        {hasCamera && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
            <div className="relative w-full max-w-[320px] aspect-square rounded-3xl border-2 border-dashed border-[#8EC349]/50 overflow-hidden shadow-[0_0_0_9999px_rgba(15,26,13,0.55)]">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#8EC349] rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#8EC349] rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#8EC349] rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#8EC349] rounded-br-2xl" />
              <div className="absolute left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-[#8EC349] to-transparent shadow-[0_0_12px_#8EC349] animate-scan-laser" />
            </div>
          </div>
        )}

        {/* Viewfinder Top Status Pill */}
        {hasCamera && (
          <div className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none px-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full glass-agri-dark text-white/90 text-xs font-medium border border-white/15">
              <span className="w-2 h-2 rounded-full bg-[#8EC349] animate-pulse" />
              <span>Align leaf</span>
            </div>
          </div>
        )}

        {/* Top Controls (Torch & Camera Flip when stream active) */}
        <div className="absolute top-4 right-4 flex flex-col gap-2.5">
          {hasTorch && (
            <button
              onClick={toggleTorch}
              className={`p-2.5 rounded-full glass-agri-dark border text-white transition active:scale-90 ${
                torchOn ? "bg-[#8EC349] text-[#142211] border-[#8EC349]" : "border-white/20"
              }`}
              title="Flash"
              aria-label="Toggle Flash"
            >
              <ZapIcon size={16} />
            </button>
          )}

          {hasCamera && (
            <button
              onClick={flipCamera}
              className="p-2.5 rounded-full glass-agri-dark border border-white/20 text-white transition active:scale-90"
              title="Switch Camera"
              aria-label="Switch Camera"
            >
              <FlipCameraIcon size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Shutter Bar - Clean & Minimal: Gallery on left, Single Shutter in center */}
      <div className="w-full bg-[#142211] px-8 py-5 safe-bottom flex items-center justify-between">
        {/* Gallery button on the left */}
        <button
          onClick={() => galleryInputRef.current?.click()}
          disabled={isAnalyzing}
          className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition active:scale-95 w-14"
          title="Choose photo from gallery"
        >
          <div className="w-11 h-11 rounded-full glass-agri-dark border border-white/15 flex items-center justify-center">
            <UploadIcon size={18} className="text-[#8EC349]" />
          </div>
          <span className="text-[10px] font-medium">Gallery</span>
        </button>

        {/* The ONE and only Primary Shutter Button in the center */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-20 h-20 rounded-full border-2 border-[#8EC349]/40 animate-agri-pulse pointer-events-none" />
          <button
            onClick={capturePhoto}
            disabled={isAnalyzing}
            className="relative w-18 h-18 rounded-full p-1 bg-gradient-to-br from-[#8EC349] via-[#4B7D3F] to-[#203A19] shadow-[0_4px_24px_rgba(142,195,73,0.35)] transition transform active:scale-90 flex items-center justify-center"
            title="Take Photo"
            aria-label="Capture Photo"
          >
            <div className="w-full h-full rounded-full border-2 border-white/70 bg-[#1D3318] flex items-center justify-center text-white">
              <CameraIcon size={28} className="text-[#A6D865]" />
            </div>
          </button>
        </div>

        {/* Balanced spacer on the right */}
        <div className="w-14" />
      </div>
    </div>
  );
}
