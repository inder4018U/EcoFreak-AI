import { useState } from "react";
import { CONFIDENCE_THRESHOLDS } from "../data/hazardAndDisposalData.js";

const ALL_CATEGORIES = [
  { id: "organic", label: "Organic", emoji: "🌿" },
  { id: "plastic", label: "Plastic", emoji: "🧴" },
  { id: "paper", label: "Paper", emoji: "📄" },
  { id: "glass", label: "Glass", emoji: "👓" },
  { id: "metal", label: "Metal / E-Waste", emoji: "🥫" },
  { id: "hazardous", label: "Hazardous", emoji: "⚠️" },
];

export default function UncertaintyWarningBanner({
  confidence,
  predictedCategory,
  currentCategory,
  isScreenshot,
  onCategoryChange
}) {
  const [showSelector, setShowSelector] = useState(false);

  const hasConfidenceScore = typeof confidence === "number" && !isNaN(confidence);
  const isLowConfidence = hasConfidenceScore && confidence < CONFIDENCE_THRESHOLDS.LOW;
  const isLikelyScreenshot = typeof isScreenshot === "number" && isScreenshot > 60;
  const isOverridden = currentCategory !== predictedCategory;

  const needsWarning = isLowConfidence || isLikelyScreenshot || !hasConfidenceScore;

  return (
    <div className="mb-4">
      {/* Alert banner if confidence is low, unrated, or likely screenshot */}
      {needsWarning && (
        <div className="rounded-xl border-2 border-dashed border-terracotta bg-[#FAF0E6] p-4 mb-3 text-left shadow-paper relative">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">⚠️</span>
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="rubber-stamp stamp-rust text-xs font-bold">
                  Field Journal Notice • Review Suggested
                </span>
                {hasConfidenceScore ? (
                  <span className="text-xs font-stamp text-terracotta bg-terracotta/10 px-2 py-0.5 rounded border border-terracotta/30">
                    {confidence}% AI Confidence
                  </span>
                ) : (
                  <span className="text-xs font-stamp text-charcoal/60 bg-black/5 px-2 py-0.5 rounded">
                    Confidence Unrated
                  </span>
                )}
              </div>

              <p className="text-charcoal/90 text-xs mt-2 leading-relaxed font-sans">
                {isLikelyScreenshot ? (
                  <>
                    This specimen appears to be a <strong>digital screenshot ({isScreenshot}% likelihood)</strong> rather than an authentic camera photo. Cloud and on-device vision precision is optimal when scanning real physical objects.
                  </>
                ) : isLowConfidence ? (
                  <>
                    The vision model flagged lower certainty (<strong>{confidence}% confidence</strong>). The item may be obscured, soiled, or consist of composite multi-layer materials.
                  </>
                ) : (
                  <>
                    The model did not provide a verified confidence score. Please verify the physical material before taking disposal action.
                  </>
                )}
              </p>

              <div className="mt-3 pt-2.5 border-t border-terracotta/20 flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs text-charcoal/70">
                  Preliminary: <strong className="text-charcoal capitalize">{predictedCategory}</strong>
                  {isOverridden && (
                    <span className="text-forest ml-1.5 font-semibold">
                      → Adjusted to: <strong className="capitalize">{currentCategory}</strong>
                    </span>
                  )}
                </span>
                <button
                  onClick={() => setShowSelector(!showSelector)}
                  className="px-2.5 py-1 rounded bg-terracotta/15 hover:bg-terracotta/25 border border-terracotta text-terracotta font-serif font-bold text-xs transition-all"
                >
                  {showSelector ? "Close Selection" : "✏️ Adjust Category"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Category Correction Pill Bar */}
      {!needsWarning && (
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-parchment rounded-xl border border-kraft-border mb-3 text-xs shadow-paper">
          <div className="flex items-center gap-1.5 text-charcoal/80 flex-wrap">
            <span className="font-stamp text-[11px] text-forest uppercase font-bold">Field Specimen:</span>
            <strong className="text-charcoal capitalize">{currentCategory}</strong>
            {hasConfidenceScore && (
              <span className="text-forest font-semibold ml-1">({confidence}%)</span>
            )}
            {isOverridden && (
              <span className="text-forest text-[10px] bg-forest/10 px-1.5 py-0.5 rounded border border-forest/30 font-serif">
                Field Corrected
              </span>
            )}
          </div>
          <button
            onClick={() => setShowSelector(!showSelector)}
            className="text-forest hover:text-forest-dark font-serif font-semibold text-xs underline ml-2"
          >
            {showSelector ? "Cancel" : "Change Category"}
          </button>
        </div>
      )}

      {/* Interactive Category Selector (Collapsible) */}
      {showSelector && (
        <div className="p-4 rounded-xl bg-parchment border-2 border-dashed border-kraft-border mb-3 text-left shadow-paper animate-fadeIn">
          <p className="text-charcoal font-serif font-bold text-xs mb-2">
            Select the verified waste category to adjust disposal instructions & carbon metrics:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onCategoryChange(cat.id);
                  setShowSelector(false);
                }}
                className={`p-2.5 rounded-lg text-xs font-medium border flex items-center gap-2 transition-all ${
                  currentCategory === cat.id
                    ? "bg-forest text-parchment border-forest shadow-md font-bold"
                    : "bg-paper hover:bg-parchment border-kraft-border text-charcoal hover:border-forest/50"
                }`}
              >
                <span className="text-lg">{cat.emoji}</span>
                <span className="truncate">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
