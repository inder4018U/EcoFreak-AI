import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { runHybridClassification } from "../services/classificationService.js";
import { useLiveClassifier } from "../hooks/useLiveClassifier.js";

// ─── FIELD JOURNAL SCAN LOADER ─────────────────────────────────────────────
export function ScanLoader({ preview, status }) {
  return (
    <div className="relative w-full max-w-sm mx-auto parchment-sheet rounded-2xl overflow-hidden p-6 text-center shadow-paper-lg">
      <div className="washi-tape tape-top" />

      {preview && (
        <div className="polaroid-frame mb-4 max-w-xs mx-auto">
          <div className="relative aspect-video rounded overflow-hidden">
            <img src={preview} alt="Specimen undergoing classification" className="w-full h-full object-cover" />
            <div
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-forest to-transparent animate-field-scan"
            />
          </div>
          <p className="text-[11px] font-stamp text-charcoal/60 mt-1.5 text-center">Specimen Under Examination</p>
        </div>
      )}

      <div className="flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-full border-3 border-forest/30 border-t-forest animate-spin" />
        <span className="rubber-stamp stamp-green text-xs font-bold">
          Field Analysis In Progress…
        </span>
        <p className="text-charcoal/80 text-xs font-serif mt-1 px-4 leading-relaxed">
          {status || "Analyzing specimen via Groq Vision AI..."}
        </p>
        <p className="text-charcoal/40 text-[10px] font-sans">
          EcoFreak AI Classification Pipeline
        </p>
      </div>
    </div>
  );
}

// ─── LIVE FIELD CAMERA (WITH REAL TENSORFLOW.JS + HYSTERESIS) ──────────────
export function LiveCamera({ onResult, onAnalyzing, onClose }) {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [capturing, setCapturing] = useState(false);

  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const isStartingRef = useRef(false);

  // High-accuracy live classifier with center-crop, 224x224, [-1, 1], and hysteresis gate
  const {
    videoRef,
    gateResult,
    itemInfo,
    isModelLoading,
    modelError
  } = useLiveClassifier({ enabled: cameraActive });

  // Lock body scroll when camera is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // ─── CAMERA INITIALIZATION & LIFECYCLE ──────────────────────────────────
  const startCamera = useCallback(async () => {
    if (isStartingRef.current) return;
    isStartingRef.current = true;
    setCameraError(null);

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error("Camera API not accessible (requires HTTPS and supported browser).");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;

      const video = videoRef.current;
      if (video) {
        video.setAttribute("playsinline", "true");
        video.setAttribute("webkit-playsinline", "true");
        video.muted = true;
        video.srcObject = stream;

        try {
          await video.play();
          setCameraActive(true);
        } catch (playErr) {
          console.warn("[LiveCamera] Direct video.play() note:", playErr);
        }

        video.onloadeddata = () => setCameraActive(true);
        video.onplaying = () => setCameraActive(true);
        video.oncanplay = () => setCameraActive(true);
      }
    } catch (err) {
      console.warn("[LiveCamera] Camera access error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError("Camera permission was denied. Please allow camera access in browser settings.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError("No camera found on this device.");
      } else {
        setCameraError(`Unable to start camera: ${err.message || "Unknown error"}.`);
      }
      setCameraActive(false);
    } finally {
      isStartingRef.current = false;
    }
  }, [videoRef]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // ─── CAPTURE & GROQ CLASSIFICATION WORKFLOW ─────────────────────────────
  const handleCapture = useCallback(async () => {
    if (capturing || !videoRef.current || !canvasRef.current) return;

    setCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Save preliminary TF.js context from the live stream
    const preliminaryTfjs = gateResult.status === "locked" && itemInfo ? {
      label: itemInfo.displayName,
      rawLabel: itemInfo.rawClass,
      confidence: Math.round((gateResult.confidence || 0.9) * 100),
      category: itemInfo.categoryId
    } : null;

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setCapturing(false);
        alert("Failed to capture photo from camera feed.");
        return;
      }

      const previewUrl = canvas.toDataURL("image/jpeg", 0.85);

      try {
        stopCamera();
        onAnalyzing(previewUrl);
        onClose();

        // Final classification via Groq Vision AI (informed by preliminary TF.js)
        const result = await runHybridClassification(blob, {
          tfjsPrediction: preliminaryTfjs
        });

        onResult(result, previewUrl);
      } catch (err) {
        console.error("Capture classification error:", err);
        alert(`Classification error: ${err.message || "Unknown error"}. Please try again.`);
        onClose();
      }
    }, "image/jpeg", 0.9);
  }, [capturing, gateResult, itemInfo, onAnalyzing, onClose, onResult, stopCamera, videoRef]);

  const isLocked = gateResult.status === "locked" && itemInfo;
  const isUncertain = gateResult.status === "uncertain";
  const confidencePercent = Math.round((gateResult.confidence || 0) * 100);

  return createPortal(
    <div className="fixed inset-0 z-[9999] w-screen h-screen h-[100dvh] bg-[#141815] flex flex-col text-parchment animate-fadeIn overflow-hidden select-none">
      {/* ─── TOP STATUS HEADER ─── */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-black/85 backdrop-blur-md border-b border-kraft-border/20 shrink-0 z-40">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌿</span>
          <div>
            <h3 className="font-serif font-bold text-sm text-parchment leading-tight">
              EcoFreak AI • Live Field Scanner
            </h3>
            <p className="text-[10px] font-sans text-parchment/60">
              On-Device MobileNet + Cloud Groq Vision Pipeline
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          type="button"
          className="px-3 py-1.5 rounded-xl bg-parchment/10 hover:bg-parchment/20 text-parchment font-serif text-xs transition-colors border border-parchment/20 flex items-center gap-1 active:scale-95"
        >
          <span>✕</span> Close
        </button>
      </div>

      {/* ─── MAIN VIEWFINDER SCREEN ─── */}
      <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
        {cameraError ? (
          <div className="max-w-xs text-center p-6 bg-terracotta/20 border border-terracotta/40 rounded-2xl mx-4">
            <span className="text-3xl block mb-2">📷</span>
            <p className="font-serif font-bold text-sm text-parchment mb-2">Camera Unavailable</p>
            <p className="text-xs text-parchment/80 mb-4">{cameraError}</p>
            <button
              onClick={startCamera}
              className="px-4 py-2 bg-forest text-parchment font-serif font-bold text-xs rounded-xl hover:bg-forest-light"
            >
              Retry Camera
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Model Error Notice */}
            {modelError && (
              <div className="absolute top-4 left-4 right-4 z-40 bg-amber-500/20 border border-amber-500/40 rounded-xl p-3 flex items-start gap-2.5 backdrop-blur-md">
                <span className="text-amber-300 text-sm">⚠️</span>
                <p className="text-amber-100 text-xs">
                  On-device model notice: {modelError}. Tap shutter to classify directly via Groq Vision.
                </p>
              </div>
            )}

            {/* ─── TARGET BRACKETS & LASER SCAN LINE ─── */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 border border-dashed border-parchment/30 rounded-3xl">
                {/* 4 Corner brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-forest rounded-tl-sm" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-forest rounded-tr-sm" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-forest rounded-bl-sm" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-forest rounded-br-sm" />

                {/* Animated field scanning laser line */}
                {cameraActive && (
                  <div
                    className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-forest to-transparent animate-field-scan"
                  />
                )}

                <div className="absolute -bottom-8 left-0 right-0 text-center">
                  <span className="text-[11px] font-hand text-parchment/80 bg-black/60 px-3 py-1 rounded-full border border-parchment/20">
                    Position waste specimen inside the brackets
                  </span>
                </div>
              </div>
            </div>

            {/* ─── TOP FLOATING HUD PREDICTION BAR ─── */}
            <div className="absolute top-4 left-4 right-4 flex flex-col items-center pointer-events-none z-30">
              {isModelLoading ? (
                <div className="px-4 py-2 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-forest-light text-xs font-medium flex items-center gap-2 shadow-lg">
                  <span className="w-3 h-3 rounded-full border-2 border-forest border-t-transparent animate-spin" />
                  <span>Loading Live Vision Model…</span>
                </div>
              ) : isLocked ? (
                <div className="w-full max-w-xs px-4 py-3 rounded-2xl bg-black/80 backdrop-blur-md border border-forest/60 shadow-xl flex flex-col items-center animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <span className="rubber-stamp stamp-green text-[10px] font-bold">LOCKED</span>
                    <span className="text-white font-serif font-bold text-sm tracking-tight text-center">
                      {itemInfo.displayName}
                    </span>
                  </div>

                  {/* Confidence Bar */}
                  <div className="w-full mt-2 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/15 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-forest rounded-full transition-all duration-300 shadow-sm shadow-forest/50"
                        style={{ width: `${confidencePercent}%` }}
                      />
                    </div>
                    <span className="text-forest-light text-xs font-stamp font-bold tabular-nums">
                      {confidencePercent}%
                    </span>
                  </div>
                </div>
              ) : isUncertain ? (
                <div className="px-4 py-2 rounded-full bg-black/75 backdrop-blur-md border border-amber-500/40 text-amber-200 text-xs font-serif flex items-center gap-2 shadow-lg animate-fadeIn">
                  <span>⚠️</span>
                  <span>Not sure, move closer or change angle</span>
                </div>
              ) : (
                <div className="px-4 py-2 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-parchment/80 text-xs font-serif flex items-center gap-2 shadow-lg animate-fadeIn">
                  <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
                  <span>Show me an item</span>
                </div>
              )}
            </div>

            {/* ─── BOTTOM FLOATING INFO CARDS (CARBON & DISPOSAL) ─── */}
            <div className="absolute bottom-4 left-4 right-4 pointer-events-none z-30 flex justify-center">
              <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm">
                {/* Left Card: Carbon Emission */}
                <div className="p-3 rounded-2xl bg-black/80 backdrop-blur-md border border-white/15 text-left flex flex-col justify-between shadow-lg">
                  <div>
                    <p className="text-parchment/50 text-[10px] font-stamp uppercase tracking-wider font-bold">
                      Carbon Emission
                    </p>
                    <p className="text-parchment/70 text-[10px] font-sans mt-0.5">
                      Est. CO₂ saved if recycled:
                    </p>
                  </div>
                  <div className="mt-2">
                    <p className="text-forest-light font-serif font-bold text-sm leading-tight">
                      {isLocked ? itemInfo.carbonText : "Point at item"}
                    </p>
                    <p className="text-parchment/40 text-[9px] font-sans mt-0.5">
                      {isLocked ? "(Verified Estimate)" : "Awaiting scan"}
                    </p>
                  </div>
                </div>

                {/* Right Card: Dispose In */}
                <div className="p-3 rounded-2xl bg-black/80 backdrop-blur-md border border-white/15 text-left flex flex-col justify-between shadow-lg">
                  <div>
                    <p className="text-parchment/50 text-[10px] font-stamp uppercase tracking-wider font-bold">
                      Dispose In
                    </p>
                    <div className="mt-1">
                      {isLocked ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-forest/30 text-forest-light border border-forest/40 inline-block">
                          {itemInfo.binColor} Bin
                        </span>
                      ) : (
                        <span className="text-parchment/40 text-[11px]">Awaiting scan</span>
                      )}
                    </div>
                  </div>
                  <p className="text-parchment/70 text-[10px] font-sans mt-1.5 leading-snug line-clamp-2">
                    {isLocked ? itemInfo.tip : "Align within brackets"}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ─── VIEWFINDER BOTTOM CONTROL SHUTTER ─── */}
      <div className="p-5 sm:p-6 bg-black/85 border-t border-kraft-border/20 flex flex-col items-center gap-2 shrink-0 z-40">
        <button
          onClick={handleCapture}
          disabled={!cameraActive || capturing}
          type="button"
          className={`w-20 h-20 rounded-full border-4 flex items-center justify-center text-3xl transition-all duration-200 active:scale-95 shadow-xl ${
            !cameraActive || capturing
              ? "border-parchment/20 bg-parchment/5 opacity-50 cursor-not-allowed"
              : "border-forest bg-forest/20 hover:bg-forest/30 text-parchment shadow-forest/30"
          }`}
          title="Capture frame and classify via Groq Vision"
        >
          {capturing ? (
            <div className="w-8 h-8 rounded-full border-3 border-parchment border-t-transparent animate-spin" />
          ) : (
            "📸"
          )}
        </button>

        <p className="text-[11px] font-serif text-parchment/70 text-center">
          {capturing
            ? "Capturing specimen and consulting Groq Vision AI…"
            : "Tap shutter to capture & finalize classification via Groq"}
        </p>
      </div>
    </div>,
    document.body
  );
}

// ─── UPLOAD AND CAMERA LAUNCH CARD (NO FAKE SWITCH BUTTON) ─────────────────
export default function ScannerSection({ onResult, onAnalyzing }) {
  const [dragging, setDragging] = useState(false);
  const [liveCamera, setLiveCamera] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [classificationError, setClassificationError] = useState(null);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleProcessFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPEG, PNG, WEBP).");
      return;
    }

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setProcessing(true);
    setClassificationError(null);
    onAnalyzing(preview);

    try {
      // Direct Groq Vision classification (EcoScanAI canonical pipeline)
      const result = await runHybridClassification(file, {
        onStatus: setStatusMessage
      });

      setProcessing(false);
      onResult(result, preview);
    } catch (err) {
      console.error("Upload classification error:", err);
      setProcessing(false);
      setClassificationError(err.message || "Failed to classify image. Please try again.");
    }
  }, [onAnalyzing, onResult]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  }, [handleProcessFile]);

  if (processing) {
    return <ScanLoader preview={previewUrl} status={statusMessage} />;
  }

  return (
    <>
      {liveCamera && (
        <LiveCamera
          onResult={(res, url) => {
            setLiveCamera(false);
            onResult(res, url);
          }}
          onAnalyzing={(url) => {
            setLiveCamera(false);
            setPreviewUrl(url);
            setProcessing(true);
            onAnalyzing(url);
          }}
          onClose={() => setLiveCamera(false)}
        />
      )}

      <div className="relative parchment-sheet rounded-3xl p-6 sm:p-8 text-center shadow-paper-lg transition-all border-2 border-kraft-border">
        {/* Tape strips on corners */}
        <div className="washi-tape tape-corner-left" />
        <div className="washi-tape tape-corner-right" />

        {/* Error banner if previous run failed */}
        {classificationError && (
          <div className="mb-4 p-3.5 rounded-xl bg-terracotta/15 border border-terracotta text-left text-xs shadow-paper animate-fadeIn">
            <div className="flex items-center gap-2 text-terracotta font-serif font-bold text-sm mb-1">
              <span>⚠️</span> Classification Issue
            </div>
            <p className="text-charcoal/85 mb-2 font-sans">{classificationError}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setClassificationError(null)}
                className="px-3 py-1 bg-terracotta text-parchment font-serif font-bold rounded-lg text-xs"
              >
                Retry Scan
              </button>
            </div>
          </div>
        )}

        {/* Drop Zone Box */}
        <div
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 sm:p-8 flex flex-col items-center gap-3.5 transition-all ${
            dragging
              ? "border-forest bg-[#EBF4EC] scale-[1.01]"
              : "border-kraft-border bg-paper/60 hover:bg-paper hover:border-forest"
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-parchment border-2 border-kraft-border flex items-center justify-center text-3xl shadow-paper">
            🌿
          </div>

          <div>
            <h3 className="text-charcoal font-serif font-bold text-lg sm:text-xl">
              Drop Specimen Photo Here
            </h3>
            <p className="text-charcoal/60 text-xs sm:text-sm font-sans mt-0.5">
              or choose an input method below to classify your waste item
            </p>
          </div>

          {/* Action Buttons: Live Camera, Snap Photo, File Browse */}
          <div className="flex flex-wrap gap-2.5 justify-center mt-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setLiveCamera(true)}
              className="px-4 py-2.5 rounded-xl bg-forest hover:bg-forest-light text-parchment font-serif font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <span>🎥</span> Live Camera Scan
            </button>

            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-olive hover:bg-olive-light text-parchment font-serif font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <span>📷</span> Snap Photo
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-paper hover:bg-parchment border border-kraft-border text-charcoal font-serif font-semibold text-xs flex items-center gap-2 shadow-paper transition-all active:scale-95"
            >
              <span>📁</span> Browse Files
            </button>
          </div>

          <div className="mt-2 text-center">
            <span className="rubber-stamp stamp-green text-[10px] font-bold">
              Real-Time Vision & Groq Cloud Classification
            </span>
          </div>
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleProcessFile(e.target.files[0]);
            }
          }}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleProcessFile(e.target.files[0]);
            }
          }}
        />
      </div>
    </>
  );
}
