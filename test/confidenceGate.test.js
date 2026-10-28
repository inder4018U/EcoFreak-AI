import { describe, it, expect } from "vitest";
import {
  createConfidenceGate,
  MIN_CONFIDENCE,
  MIN_MARGIN,
  LOCK_FRAMES,
  RELEASE_FRAMES,
  IDLE_THRESHOLD
} from "../src/services/confidenceGate.js";

describe("Confidence Gate with Hysteresis", () => {
  it("verifies gate threshold constants", () => {
    expect(MIN_CONFIDENCE).toBe(0.8);
    expect(MIN_MARGIN).toBe(0.2);
    expect(LOCK_FRAMES).toBe(5);
    expect(RELEASE_FRAMES).toBe(8);
    expect(IDLE_THRESHOLD).toBe(0.45);
  });

  it("locks after exactly 5 consecutive stable frames", () => {
    const gate = createConfidenceGate();
    const framePlastic = [
      { className: "Plastic", probability: 0.92 },
      { className: "Trash", probability: 0.05 }
    ];

    // Frames 1 through 4: accumulating candidate, status uncertain
    for (let i = 1; i <= 4; i++) {
      const res = gate.processFrame(framePlastic);
      expect(res.status).toBe("uncertain");
      expect(res.confirmedClass).toBeNull();
    }

    // Frame 5: locks
    const lockRes = gate.processFrame(framePlastic);
    expect(lockRes.status).toBe("locked");
    expect(lockRes.confirmedClass).toBe("Plastic");
    expect(lockRes.confidence).toBe(0.92);
  });

  it("hysteresis prevents flickering: 1-7 bad frames hold the lock", () => {
    const gate = createConfidenceGate();
    const goodFrame = [
      { className: "Plastic", probability: 0.90 },
      { className: "Trash", probability: 0.05 }
    ];
    const noisyFrame = [
      { className: "Shoes", probability: 0.50 },
      { className: "Plastic", probability: 0.40 }
    ];

    // Lock first with 5 good frames
    for (let i = 0; i < 5; i++) {
      gate.processFrame(goodFrame);
    }
    expect(gate.getLockedClass()).toBe("Plastic");

    // Feed 7 noisy frames: lock must hold without flickering
    for (let i = 1; i <= 7; i++) {
      const res = gate.processFrame(noisyFrame);
      expect(res.status).toBe("locked");
      expect(res.confirmedClass).toBe("Plastic");
      expect(res.isReleasing).toBe(true);
    }

    // A good frame recovers lock before threshold
    const recoverRes = gate.processFrame(goodFrame);
    expect(recoverRes.status).toBe("locked");
    expect(recoverRes.isReleasing).toBeUndefined();
  });

  it("releases lock after 8 consecutive unmatching frames", () => {
    const gate = createConfidenceGate();
    const goodFrame = [
      { className: "Plastic", probability: 0.90 },
      { className: "Trash", probability: 0.05 }
    ];
    const unmatchingFrame = [
      { className: "Shoes", probability: 0.85 },
      { className: "Trash", probability: 0.10 }
    ];

    // Lock onto Plastic
    for (let i = 0; i < 5; i++) {
      gate.processFrame(goodFrame);
    }
    expect(gate.getLockedClass()).toBe("Plastic");

    // Feed 7 unmatching frames (hold lock)
    for (let i = 1; i <= 7; i++) {
      const res = gate.processFrame(unmatchingFrame);
      expect(res.status).toBe("locked");
    }

    // 8th unmatching frame triggers release
    const released = gate.processFrame(unmatchingFrame);
    expect(released.confirmedClass).not.toBe("Plastic");
    expect(gate.getLockedClass()).toBeNull();
  });

  it("rejects insufficient margin between top-2 classes", () => {
    const gate = createConfidenceGate();
    // High probability (0.85), but margin is 0.85 - 0.75 = 0.10 (< 0.20 required)
    const closeMarginFrame = [
      { className: "Plastic", probability: 0.85 },
      { className: "Glasses", probability: 0.75 }
    ];

    for (let i = 0; i < 10; i++) {
      const res = gate.processFrame(closeMarginFrame);
      expect(res.status).toBe("uncertain");
      expect(res.confirmedClass).toBeNull();
    }
    expect(gate.getLockedClass()).toBeNull();
  });

  it("enters idle state when top class is below idle threshold", () => {
    const gate = createConfidenceGate();
    const lowFrame = [
      { className: "Plastic", probability: 0.30 },
      { className: "Trash", probability: 0.25 }
    ];

    const res = gate.processFrame(lowFrame);
    expect(res.status).toBe("idle");
    expect(res.message).toBe("Show me an item");
  });
});
