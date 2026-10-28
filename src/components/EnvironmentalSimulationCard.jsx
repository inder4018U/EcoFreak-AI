import { useState, useEffect } from "react";
import { getSimulationData, SIMULATION_DISCLAIMER } from "../data/simulationData.js";

export default function EnvironmentalSimulationCard({ category, carbonFootprint }) {
  const [pathway, setPathway] = useState("responsible"); // "responsible" | "improper"
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const scenario = getSimulationData(category);
  const currentPath = pathway === "responsible" ? scenario.responsible : scenario.improper;
  const steps = currentPath.steps;

  // Auto-play animation timer
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2400);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const handlePathwayToggle = (newPath) => {
    setPathway(newPath);
    setActiveStepIndex(0);
    setIsPlaying(false);
  };

  const handlePlayToggle = () => {
    if (activeStepIndex >= steps.length - 1) {
      setActiveStepIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const isResponsible = pathway === "responsible";
  const activeStep = steps[activeStepIndex] || steps[0];

  return (
    <div className="mt-5 rounded-2xl parchment-sheet p-5 text-left relative overflow-hidden">
      {/* Tape accent */}
      <div className="washi-tape tape-top" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-kraft-border mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🎬</span>
          <div>
            <h3 className="text-charcoal text-base font-serif font-bold tracking-tight">
              Lifecycle Simulation & Environmental Fate
            </h3>
            <p className="text-charcoal/60 text-xs font-sans">
              Interactive Science Field Journal Comparison
            </p>
          </div>
        </div>
        <span className="rubber-stamp stamp-olive text-[11px] font-bold">
          {scenario.title.split(" ")[0]} Model
        </span>
      </div>

      {/* Pathway Selector Switch */}
      <div className="flex gap-2 p-1.5 bg-paper rounded-xl border border-kraft-border mb-4">
        <button
          onClick={() => handlePathwayToggle("responsible")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-serif font-bold transition-all flex items-center justify-center gap-1.5 ${
            isResponsible
              ? "bg-forest text-parchment shadow-md"
              : "text-charcoal/60 hover:text-charcoal"
          }`}
        >
          <span>🌿</span> Responsible Disposal
        </button>

        <button
          onClick={() => handlePathwayToggle("improper")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-serif font-bold transition-all flex items-center justify-center gap-1.5 ${
            !isResponsible
              ? "bg-terracotta text-parchment shadow-md"
              : "text-charcoal/60 hover:text-charcoal"
          }`}
        >
          <span>⚠️</span> Improper Disposal
        </button>
      </div>

      {/* Pathway Banner */}
      <div
        className={`p-3.5 rounded-xl border mb-4 transition-all duration-300 shadow-paper ${
          isResponsible
            ? "bg-[#F0F6F1] border-forest/30 text-charcoal"
            : "bg-[#FDF3F0] border-terracotta/30 text-charcoal"
        }`}
      >
        <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
          <span className="text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span>{currentPath.icon}</span> {currentPath.pathName}
          </span>
          <span
            className={`text-[10px] font-stamp font-bold px-2 py-0.5 rounded border ${
              isResponsible
                ? "bg-forest/15 text-forest border-forest/30"
                : "bg-terracotta/15 text-terracotta border-terracotta/30"
            }`}
          >
            {currentPath.badge}
          </span>
        </div>
        <p className="text-charcoal/85 text-xs font-sans">
          {currentPath.headline}
        </p>
      </div>

      {/* Interactive Step-by-Step Stage Carousel */}
      <div className="bg-paper rounded-xl border border-kraft-border p-4 mb-4 shadow-paper">
        {/* Progress Bar & Stage Indicator */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-charcoal/60 font-serif text-xs uppercase tracking-wider">
              Simulation Stage {activeStepIndex + 1} of {steps.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayToggle}
              className={`px-2.5 py-1 rounded text-xs font-serif font-semibold border flex items-center gap-1 transition-all ${
                isPlaying
                  ? "bg-terracotta/20 text-terracotta border-terracotta/40"
                  : "bg-parchment text-charcoal border-kraft-border hover:bg-paper"
              }`}
            >
              {isPlaying ? "⏸ Pause" : activeStepIndex >= steps.length - 1 ? "🔄 Replay" : "▶ Auto-Play"}
            </button>
          </div>
        </div>

        {/* Step Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-3.5">
          {steps.map((st, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveStepIndex(i);
                setIsPlaying(false);
              }}
              className={`p-2 rounded-lg text-left border transition-all text-xs ${
                activeStepIndex === i
                  ? isResponsible
                    ? "bg-forest text-parchment border-forest shadow-sm"
                    : "bg-terracotta text-parchment border-terracotta shadow-sm"
                  : "bg-parchment border-kraft-border text-charcoal/70 hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-1 font-bold text-[11px] truncate">
                <span>{st.icon}</span>
                <span>Stage {i + 1}</span>
              </div>
              <span className={`text-[10px] block mt-0.5 truncate ${activeStepIndex === i ? 'text-parchment/80' : 'text-charcoal/50'}`}>
                {st.duration}
              </span>
            </button>
          ))}
        </div>

        {/* Active Stage Animated Card */}
        <div className="p-3.5 rounded-xl bg-parchment border border-kraft-border transition-all animate-fadeIn">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-charcoal font-serif font-bold text-sm flex items-center gap-2">
              <span className="text-xl">{activeStep.icon}</span>
              <span>{activeStep.stage}</span>
            </h4>
            <span className="text-[11px] text-charcoal/60 bg-paper px-2 py-0.5 rounded border border-kraft-border font-stamp">
              ⏱ {activeStep.duration}
            </span>
          </div>

          <p className="text-charcoal/85 text-xs leading-relaxed mb-3 font-sans">
            {activeStep.description}
          </p>

          <div
            className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 border ${
              isResponsible
                ? "bg-[#EAF3EB] text-forest border-forest/30"
                : "bg-[#FAEDE8] text-terracotta border-terracotta/30"
            }`}
          >
            <span className="font-stamp uppercase text-[10px]">📊 Scientific Metric:</span>
            <span>{activeStep.metric}</span>
          </div>
        </div>
      </div>

      {/* Carbon & Environmental Consequence Comparison */}
      <div className="mb-4 bg-paper rounded-xl p-3.5 border border-kraft-border">
        <span className="text-charcoal/60 font-serif text-xs uppercase tracking-wider block mb-1.5">
          Long-Term Environmental Consequence
        </span>
        <p className="text-charcoal/85 text-xs leading-relaxed mb-3 font-sans">
          {currentPath.impactSummary}
        </p>

        {carbonFootprint?.productionEmissionsKg && isResponsible && (
          <div className="pt-2.5 border-t border-kraft-border flex items-center justify-between text-xs flex-wrap gap-1">
            <span className="text-forest font-serif font-semibold">Estimated Emissions Prevented:</span>
            <span className="text-forest font-stamp font-bold text-sm">
              ~{(carbonFootprint.productionEmissionsKg * 0.75).toFixed(3)} kg CO₂e avoided
            </span>
          </div>
        )}
      </div>

      {/* Simulation Disclaimer */}
      <div className="text-[10px] text-charcoal/50 italic text-center font-sans">
        ℹ️ {SIMULATION_DISCLAIMER}
      </div>
    </div>
  );
}
