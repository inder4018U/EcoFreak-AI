import { useState } from "react";
import { CATEGORIES_DATA } from "../data/categoriesData.js";
import UncertaintyWarningBanner from "./UncertaintyWarningBanner.jsx";
import HazardAssessmentCard from "./HazardAssessmentCard.jsx";
import DosAndDontsCard from "./DosAndDontsCard.jsx";
import CarbonFootprintCard from "./CarbonFootprintCard.jsx";
import EnvironmentalSimulationCard from "./EnvironmentalSimulationCard.jsx";
import MiniQuizCard from "./MiniQuizCard.jsx";
import CarbonEducationModal from "./CarbonEducationModal.jsx";
import CarbonErrorBoundary from "./CarbonErrorBoundary.jsx";

export default function ResultCard({
  result,
  preview,
  onReset,
  onNavigateToFacilities
}) {
  const [activeCategory, setActiveCategory] = useState(result.type);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "disposal" | "carbon" | "safety" | "simulation" | "quiz"
  const [showCarbonEducation, setShowCarbonEducation] = useState(false);

  const categoryInfo = CATEGORIES_DATA[activeCategory] || CATEGORIES_DATA[result.type] || CATEGORIES_DATA.hazardous;
  const currentResult = { ...result, type: activeCategory };
  const tfjs = result.tfjsPrediction;
  const comparison = result.modelComparison;

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto text-left">
      {/* Back Link */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-charcoal/70 hover:text-charcoal font-serif font-bold text-xs transition-colors"
        >
          <span>←</span> Back to Scanner
        </button>
        <span className="rubber-stamp stamp-green text-[10px] font-bold">
          Field Report #EF-{(Math.random() * 9000 + 1000).toFixed(0)}
        </span>
      </div>

      {/* Main Specimen & Classification Card */}
      <div className="parchment-sheet rounded-3xl p-5 sm:p-7 shadow-paper-lg border-2 border-kraft-border relative mb-6">
        <div className="washi-tape tape-top" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Specimen Photograph Polaroid */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="polaroid-frame w-full max-w-xs relative">
              <div className="washi-tape tape-corner-left" />
              <div className="relative aspect-[4/3] rounded overflow-hidden bg-kraft/20 border border-kraft-border/40">
                {preview ? (
                  <img
                    src={preview}
                    alt={result.itemName || "Scanned specimen"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    {categoryInfo.emoji}
                  </div>
                )}
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur text-[10px] font-stamp text-parchment">
                  {result.confidence}% Confidence
                </div>
              </div>

              <div className="pt-2 text-center">
                <p className="font-hand text-lg text-charcoal font-bold leading-tight">
                  {result.itemName || "Field Specimen"}
                </p>
                <p className="text-[10px] font-stamp text-charcoal/50">
                  Documented: {new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>

            {/* Authenticity Bar */}
            {result.isScreenshot !== undefined && (
              <div className="w-full max-w-xs mt-3 bg-paper p-3 rounded-xl border border-kraft-border text-xs shadow-paper">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-serif text-[11px] text-charcoal/60">Image Authenticity</span>
                  <span className={`font-stamp text-[11px] font-bold ${result.isScreenshot > 60 ? 'text-terracotta' : 'text-forest'}`}>
                    {result.isScreenshot > 60 ? "⚠️ Likely Screenshot" : "✅ Real Camera Photo"}
                  </span>
                </div>
                <div className="w-full h-2 bg-kraft/30 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${100 - result.isScreenshot}%`,
                      backgroundColor: result.isScreenshot > 60 ? "#B85C38" : "#2F4F35"
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-[10px] font-sans text-charcoal/60">
                  <span>{100 - result.isScreenshot}% physical photo</span>
                  <span>{result.isScreenshot}% digital render</span>
                </div>
              </div>
            )}
          </div>

          {/* Classification Details */}
          <div className="md:col-span-7">
            {/* Category Stamp & Confidence */}
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <span className={`rubber-stamp text-sm font-bold ${categoryInfo.stampClass}`}>
                {categoryInfo.emoji} {categoryInfo.name.toUpperCase()}
              </span>
              <span className="font-stamp text-xs text-charcoal/70 bg-paper px-2.5 py-1 rounded border border-kraft-border">
                AI Confidence: <strong className="text-forest">{result.confidence}%</strong>
              </span>
            </div>

            {/* Likely Item Name Headline */}
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal mt-1 mb-2 leading-tight">
              {result.itemName || `${categoryInfo.name} Waste Item`}
            </h1>

            {/* Reason / Explanation */}
            <p className="text-charcoal/80 text-xs sm:text-sm font-sans leading-relaxed mb-4">
              {result.reason || `Identified as ${categoryInfo.name.toLowerCase()} waste based on visual analysis.`}
            </p>

            {/* ─── HYBRID AI SYSTEM BREAKDOWN CARD ─── */}
            <div className="bg-paper rounded-2xl p-4 border border-kraft-border shadow-paper mb-4 space-y-2.5">
              <div className="flex items-center justify-between border-b border-kraft-border/60 pb-2">
                <span className="font-serif font-bold text-xs text-charcoal flex items-center gap-1.5">
                  <span>🔬</span> Hybrid Multi-Stage AI Synthesis
                </span>
                <span className="font-stamp text-[10px] text-charcoal/60 uppercase">
                  TF.js + Groq Vision
                </span>
              </div>

              {/* Models comparison grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* Groq Cloud */}
                <div className="p-2.5 rounded-xl bg-parchment border border-kraft-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-stamp text-[10px] text-forest font-bold uppercase">Cloud Vision (Groq)</span>
                    <span className="font-stamp text-[10px] text-forest font-bold">{result.confidence}%</span>
                  </div>
                  <p className="font-serif font-bold text-charcoal truncate">{result.itemName}</p>
                  <p className="text-[10px] text-charcoal/60 font-sans">Final Classification Authority</p>
                </div>

                {/* TensorFlow.js On-Device */}
                <div className="p-2.5 rounded-xl bg-parchment border border-kraft-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-stamp text-[10px] text-olive font-bold uppercase">On-Device (TF.js)</span>
                    <span className="font-stamp text-[10px] text-olive font-bold">
                      {tfjs ? `${tfjs.confidence}%` : "Observed"}
                    </span>
                  </div>
                  <p className="font-serif font-bold text-charcoal truncate">
                    {tfjs?.label || "19-Class Edge Inference"}
                  </p>
                  <p className="text-[10px] text-charcoal/60 font-sans">
                    {tfjs?.category ? `Category: ${tfjs.category}` : "Preliminary Context"}
                  </p>
                </div>
              </div>

              {/* Agreement Status */}
              {comparison && comparison.hasComparison && (
                <div className={`p-2.5 rounded-xl border text-[11px] leading-relaxed font-sans ${
                  comparison.agreement
                    ? "bg-[#EAF3EB] border-forest/30 text-forest"
                    : "bg-[#FDF3EE] border-terracotta/30 text-charcoal"
                }`}>
                  <strong className="font-serif block mb-0.5">
                    {comparison.agreement ? "✅ Model Consensus:" : "ℹ️ Model Variance Notice:"}
                  </strong>
                  {comparison.message}
                </div>
              )}
            </div>

            {/* Uncertainty Banner with category selector */}
            <UncertaintyWarningBanner
              confidence={result.confidence}
              predictedCategory={result.type}
              currentCategory={activeCategory}
              isScreenshot={result.isScreenshot}
              onCategoryChange={(newCat) => setActiveCategory(newCat)}
            />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {[
          { id: "overview", label: "Overview", icon: "📋" },
          { id: "disposal", label: "Do’s & Don’ts", icon: "✅" },
          { id: "carbon", label: "Carbon Impact", icon: "🌍" },
          { id: "safety", label: "Handling Safety", icon: "⚠️" },
          { id: "simulation", label: "Simulation", icon: "🎬" },
          { id: "quiz", label: "Field Quiz", icon: "🧠" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold whitespace-nowrap transition-all shadow-paper flex items-center gap-1.5 ${
              activeTab === tab.id
                ? "bg-forest text-parchment border border-forest shadow-md"
                : "bg-paper text-charcoal/70 hover:text-charcoal hover:bg-parchment border border-kraft-border"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === "overview" && (
        <div className="space-y-5 animate-fadeIn">
          {/* How to dispose numbered steps */}
          <div className="parchment-sheet rounded-3xl p-6 border-2 border-kraft-border shadow-paper-lg relative">
            <div className="washi-tape tape-top" />
            <h3 className="font-serif font-bold text-lg text-charcoal mb-3 flex items-center gap-2">
              <span>🗑️</span> How to Dispose of {categoryInfo.name} Waste
            </h3>

            <div className="space-y-3">
              {categoryInfo.disposalSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-paper p-3.5 rounded-xl border border-kraft-border shadow-paper">
                  <span className="w-6 h-6 rounded-full bg-forest text-parchment font-stamp text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-charcoal/85 text-xs font-sans leading-relaxed pt-0.5">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {/* Carbon context callout */}
            <div className="mt-4 p-4 rounded-xl bg-[#F0F6F1] border border-forest/30 flex items-start gap-3">
              <span className="text-2xl mt-0.5">🌿</span>
              <div>
                <p className="font-serif font-bold text-xs text-forest uppercase tracking-wider mb-1">
                  Carbon Context
                </p>
                <p className="text-charcoal/80 text-xs font-sans leading-relaxed">
                  {categoryInfo.carbonContext}
                </p>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="mt-5 pt-4 border-t border-kraft-border flex flex-wrap gap-3 items-center justify-between">
              <button
                onClick={() => onNavigateToFacilities ? onNavigateToFacilities() : window.open(`https://www.google.com/maps/search/${encodeURIComponent(categoryInfo.mapsQuery)}`, '_blank')}
                className="px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-light text-parchment font-serif font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
              >
                <span>📍</span> Find Nearby Facilities →
              </button>

              <button
                onClick={onReset}
                className="px-4 py-2.5 rounded-xl bg-paper hover:bg-parchment border border-kraft-border text-charcoal font-serif font-semibold text-xs transition-all"
              >
                ↩ Analyze Another Specimen
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "disposal" && (
        <div className="animate-fadeIn">
          <DosAndDontsCard category={activeCategory} itemName={result.itemName} />
        </div>
      )}

      {activeTab === "carbon" && (
        <div className="animate-fadeIn">
          <CarbonErrorBoundary>
            <CarbonFootprintCard
              key={(result?.itemName || '') + '_' + activeCategory}
              wasteItem={currentResult}
              onOpenEducation={() => setShowCarbonEducation(true)}
            />
          </CarbonErrorBoundary>
        </div>
      )}

      {activeTab === "safety" && (
        <div className="animate-fadeIn">
          <HazardAssessmentCard category={activeCategory} itemName={result.itemName} />
        </div>
      )}

      {activeTab === "simulation" && (
        <div className="animate-fadeIn">
          <EnvironmentalSimulationCard
            category={activeCategory}
            carbonFootprint={currentResult}
          />
        </div>
      )}

      {activeTab === "quiz" && (
        <div className="animate-fadeIn">
          <MiniQuizCard key={activeCategory} category={activeCategory} />
        </div>
      )}

      {showCarbonEducation && (
        <CarbonEducationModal onClose={() => setShowCarbonEducation(false)} />
      )}
    </div>
  );
}
