/**
 * EcoFreak AI - useLiveClassifier Hook
 * 
 * Provides live video frame classification using Teachable Machine (TensorFlow.js)
 * with center-crop preprocessing (224x224, normalized to [-1, 1]), leak-free tf.tidy(),
 * cadence of ~250ms, frame skipping, and confidence gate with hysteresis.
 */

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createConfidenceGate } from "../services/confidenceGate.js";
import { getLiveItemInfo, LIVE_CLASS_CONFIG } from "../services/liveClassMap.js";

const PREDICTION_INTERVAL_MS = 250;

export function useLiveClassifier({ enabled = true } = {}) {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [modelError, setModelError] = useState(null);
  const [labels, setLabels] = useState(() => Object.keys(LIVE_CLASS_CONFIG));
  const [gateResult, setGateResult] = useState({
    status: "idle",
    confirmedClass: null,
    confidence: 0,
    message: "Show me an item"
  });

  const videoRef = useRef(null);
  const modelRef = useRef(null);
  const tfRef = useRef(null);
  const labelsRef = useRef(Object.keys(LIVE_CLASS_CONFIG));
  const isPredictingRef = useRef(false);
  const intervalRef = useRef(null);

  // Stateful confidence gate with hysteresis
  const gate = useMemo(() => createConfidenceGate(), []);

  // ─── 1. LAZY LOAD TENSORFLOW.JS & MODEL ───────────────────────────
  useEffect(() => {
    let isCancelled = false;

    async function loadModel() {
      setIsModelLoading(true);
      setModelError(null);

      try {
        // Fetch metadata.json for model labels
        let loadedLabels = Object.keys(LIVE_CLASS_CONFIG);
        const metaUrls = ["/tm-model/metadata.json", "/model/metadata.json"];
        for (const metaUrl of metaUrls) {
          try {
            const metaResp = await fetch(metaUrl);
            if (metaResp.ok) {
              const metadata = await metaResp.json();
              if (Array.isArray(metadata.labels) && metadata.labels.length > 0) {
                loadedLabels = metadata.labels;
                break;
              }
            }
          } catch {
            // try next
          }
        }

        labelsRef.current = loadedLabels;
        if (!isCancelled) setLabels(loadedLabels);

        // Dynamically import @tensorflow/tfjs
        const tf = await import("@tensorflow/tfjs");
        tfRef.current = tf;

        // Ensure WebGL backend if available
        try {
          if (tf.getBackend() !== "webgl") {
            await tf.setBackend("webgl");
          }
        } catch (e) {
          console.warn("[EcoFreak LiveClassifier] WebGL setBackend notice:", e);
        }

        try {
          tf.env().set("WEBGPU_IMPORT_EXTERNAL_TEXTURE", false);
        } catch {
          // ignore
        }

        await tf.ready();

        // Load Teachable Machine layers model
        let model = null;
        const modelPaths = ["/tm-model/model.json", "/model/model.json"];
        for (const path of modelPaths) {
          try {
            model = await tf.loadLayersModel(path);
            if (model) break;
          } catch (mErr) {
            console.warn(`[EcoFreak LiveClassifier] Could not load from ${path}:`, mErr);
          }
        }

        if (!model) {
          throw new Error("Unable to load model.json from /tm-model/ or /model/");
        }

        if (!isCancelled) {
          modelRef.current = model;
          setIsModelLoading(false);
          console.log("[EcoFreak LiveClassifier] Model loaded successfully with", loadedLabels.length, "labels");
        }
      } catch (err) {
        console.warn("[EcoFreak LiveClassifier] Failed to load TM model:", err);
        if (!isCancelled) {
          setModelError(err.message || "Model load failed");
          setIsModelLoading(false);
        }
      }
    }

    loadModel();

    return () => {
      isCancelled = true;
      if (modelRef.current) {
        try {
          modelRef.current.dispose();
          modelRef.current = null;
        } catch {
          // Ignore disposal errors
        }
      }
    };
  }, []);

  // ─── 2. INFERENCE LOOP (cadence ~250ms with frame-skipping) ───────
  const runPrediction = useCallback(async () => {
    const video = videoRef.current;
    const model = modelRef.current;
    const tf = tfRef.current;

    if (
      !video ||
      !model ||
      !tf ||
      isPredictingRef.current ||
      video.readyState < 2 ||
      !video.videoWidth ||
      !video.videoHeight
    ) {
      return;
    }

    isPredictingRef.current = true;

    try {
      // Center-crop video frame to square, resize to 224x224, normalize to [-1, 1], expand dims
      const tensor = tf.tidy(() => {
        const pixels = tf.browser.fromPixels(video);
        const [h, w] = [pixels.shape[0], pixels.shape[1]];
        const size = Math.min(h, w);
        const startY = Math.floor((h - size) / 2);
        const startX = Math.floor((w - size) / 2);

        const cropped = pixels.slice([startY, startX, 0], [size, size, 3]);
        const resized = tf.image.resizeBilinear(cropped, [224, 224]);
        const normalized = resized.div(127.5).sub(1);
        return normalized.expandDims(0);
      });

      const prediction = model.predict(tensor);
      const probabilities = await prediction.data();

      // Clean up tensors
      tensor.dispose();
      prediction.dispose();

      // Map probabilities to label names using ref to avoid stale closures
      const currentLabels = labelsRef.current.length > 0 ? labelsRef.current : labels;
      const predictions = currentLabels.map((labelName, i) => ({
        className: labelName,
        probability: probabilities[i] || 0
      }));

      // Pass through confidence gate
      const result = gate.processFrame(predictions);
      setGateResult(result);
    } catch (err) {
      console.warn("[EcoFreak LiveClassifier] Prediction error:", err);
    } finally {
      isPredictingRef.current = false;
    }
  }, [labels, gate]);

  // Start/stop interval based on enabled flag
  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(runPrediction, PREDICTION_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, runPrediction]);

  // Reset gate when disabled or remounted
  useEffect(() => {
    if (!enabled) gate.reset();
  }, [enabled, gate]);

  const activeConfirmedClass = gateResult.status === "locked" ? gateResult.confirmedClass : null;
  const itemInfo = activeConfirmedClass ? getLiveItemInfo(activeConfirmedClass) : null;

  // Predict on static canvas or image (e.g. for captured frame or uploaded file)
  const predictElement = useCallback(async (imageOrCanvas) => {
    const model = modelRef.current;
    const tf = tfRef.current;
    if (!model || !tf || !imageOrCanvas) return null;

    try {
      const tensor = tf.tidy(() => {
        const pixels = tf.browser.fromPixels(imageOrCanvas);
        const [h, w] = [pixels.shape[0], pixels.shape[1]];
        const size = Math.min(h, w);
        const startY = Math.floor((h - size) / 2);
        const startX = Math.floor((w - size) / 2);

        const cropped = pixels.slice([startY, startX, 0], [size, size, 3]);
        const resized = tf.image.resizeBilinear(cropped, [224, 224]);
        const normalized = resized.div(127.5).sub(1);
        return normalized.expandDims(0);
      });

      const prediction = model.predict(tensor);
      const probabilities = await prediction.data();
      tensor.dispose();
      prediction.dispose();

      const currentLabels = labelsRef.current.length > 0 ? labelsRef.current : labels;
      const predictions = currentLabels.map((labelName, i) => ({
        className: labelName,
        probability: probabilities[i] || 0
      }));

      const sorted = [...predictions].sort((a, b) => b.probability - a.probability);
      const top = sorted[0] || { className: "Unknown", probability: 0 };
      const info = getLiveItemInfo(top.className);

      return {
        label: top.className,
        confidence: Math.round(top.probability * 100),
        rawProbability: top.probability,
        category: info.categoryId,
        categoryName: info.categoryData?.name || info.displayName,
        displayName: info.displayName,
        topPredictions: sorted.slice(0, 3).map((p) => ({
          className: p.className,
          probability: p.probability,
          percentage: Math.round(p.probability * 100)
        }))
      };
    } catch (e) {
      console.warn("[EcoFreak LiveClassifier] Element prediction error:", e);
      return null;
    }
  }, [labels]);

  return {
    videoRef,
    gateResult,
    itemInfo,
    isModelLoading,
    modelError,
    predictElement
  };
}
