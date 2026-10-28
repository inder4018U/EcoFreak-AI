import { useState } from "react";
import { getHazardAndDisposalGuidance } from "../data/hazardAndDisposalData.js";

export default function HazardAssessmentCard({ category, itemName }) {
  const [showSources, setShowSources] = useState(false);
  const guidance = getHazardAndDisposalGuidance(category, itemName);

  const levelColorMap = {
    Critical: "stamp-rust",
    Moderate: "stamp-charcoal",
    Low: "stamp-green",
  };

  return (
    <div className="mt-5 rounded-2xl parchment-sheet p-5 text-left relative overflow-hidden">
      {/* Tape accent */}
      <div className="washi-tape tape-top" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-kraft-border mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="text-charcoal text-base font-serif font-bold tracking-tight">
              Safety Assessment & Material Risks
            </h3>
            <p className="text-charcoal/60 text-xs font-sans">
              Material evaluation & handling protocols
            </p>
          </div>
        </div>

        <span
          className={`rubber-stamp text-[11px] font-bold ${
            levelColorMap[guidance.hazardLevel] || "stamp-charcoal"
          }`}
        >
          {guidance.hazardLevel} Hazard
        </span>
      </div>

      {/* Hazard Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {guidance.hazardTags.map((tag, i) => (
          <span
            key={i}
            className="text-[11px] px-2.5 py-0.5 rounded-full bg-kraft-light/40 text-charcoal border border-kraft-border font-stamp"
          >
            • {tag}
          </span>
        ))}
      </div>

      {/* General Category Hazard Summary */}
      <p className="text-charcoal/85 text-xs leading-relaxed mb-4 font-sans">
        {guidance.summary}
      </p>

      {/* Category-Specific Guidance Callout */}
      {guidance.matchedSpecificGuidance && (
        <div className="mb-4 rounded-xl border-2 border-dashed border-terracotta bg-[#FAF0E6] p-4 text-xs shadow-paper">
          <div className="flex items-center gap-2 text-terracotta font-serif font-bold text-sm mb-1">
            <span>🚨</span>
            <span>{guidance.matchedSpecificGuidance.title}</span>
          </div>
          <p className="text-charcoal font-medium text-xs mb-2">
            {guidance.matchedSpecificGuidance.warning}
          </p>
          <ul className="list-disc list-inside space-y-1 text-charcoal/80 text-[11px] pl-1">
            {guidance.matchedSpecificGuidance.precautions.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Handling Precautions */}
      <div className="mb-4 bg-paper rounded-xl p-3.5 border border-kraft-border">
        <span className="text-forest text-xs font-serif font-bold uppercase tracking-wider block mb-2">
          🛡️ Field Handling Precautions
        </span>
        <ul className="space-y-1.5 text-xs text-charcoal/85">
          {guidance.precautions.map((prec, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-forest font-bold mt-0.5">✔</span>
              <span>{prec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Mandatory Safety Disclaimer */}
      <div className="p-3.5 rounded-xl bg-[#FFF9E6] border border-amber-600/30 text-charcoal/90 text-[11px] leading-relaxed mb-3">
        <strong className="text-amber-800 font-serif block mb-1">
          🛑 Important Environmental Rule:
        </strong>
        {guidance.safetyDisclaimer}
      </div>

      {/* Regulatory Sources Accordion */}
      <div className="border-t border-kraft-border pt-2 text-right">
        <button
          onClick={() => setShowSources(!showSources)}
          className="text-forest hover:text-forest-dark text-[11px] font-serif font-semibold underline"
        >
          {showSources ? "Hide Source Standards ▲" : "View Regulatory References ▼"}
        </button>

        {showSources && (
          <div className="mt-2 text-left bg-paper p-3 rounded-lg border border-kraft-border text-[11px] text-charcoal/70 space-y-1 animate-fadeIn">
            <p className="font-stamp text-[10px] text-charcoal font-bold uppercase">
              Regulatory References & Data Standards:
            </p>
            <ul className="list-disc list-inside space-y-0.5 pl-1">
              {guidance.regulatorySources.map((src, i) => (
                <li key={i}>{src}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
