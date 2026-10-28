import { useState } from "react";
import CarbonFootprintCard from "./CarbonFootprintCard.jsx";
import CarbonEducationModal from "./CarbonEducationModal.jsx";
import CarbonErrorBoundary from "./CarbonErrorBoundary.jsx";

export default function CarbonImpactPage({ onScanItem }) {
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [calculatorCategory, setCalculatorCategory] = useState("plastic");

  const sampleItems = {
    plastic: { itemName: "PET Beverage Bottle", type: "plastic" },
    metal: { itemName: "Aluminium Drink Can", type: "metal" },
    paper: { itemName: "Corrugated Cardboard Box", type: "paper" },
    organic: { itemName: "Kitchen Food Scrap", type: "organic" },
    glass: { itemName: "Glass Beverage Bottle", type: "glass" },
    hazardous: { itemName: "Household Battery Cell", type: "hazardous" }
  };

  return (
    <div className="animate-fadeIn max-w-5xl mx-auto text-left">
      {/* Header Banner on Parchment (Moodboard #06) */}
      <div className="parchment-sheet rounded-3xl p-6 sm:p-8 border-2 border-kraft-border shadow-paper-lg relative mb-8">
        <div className="washi-tape tape-top" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="rubber-stamp stamp-green text-xs font-bold">
                Field Journal • Climate Module
              </span>
              <span className="text-xs font-stamp text-charcoal/50">CO₂e Lifecycle Accounting</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal tracking-tight">
              Why It Matters
            </h1>
            <p className="text-charcoal/70 text-xs sm:text-sm font-sans mt-1 max-w-2xl leading-relaxed">
              Correct sorting keeps materials in circulation, reduces the need for virgin resource extraction, and prevents thousands of metric tons of associated greenhouse emissions.
            </p>
          </div>

          <button
            onClick={() => setShowEducationModal(true)}
            className="px-4 py-2.5 rounded-xl bg-paper hover:bg-parchment border border-kraft-border text-charcoal font-serif font-bold text-xs flex items-center gap-2 shadow-paper transition-all self-start sm:self-center shrink-0 active:scale-95"
          >
            <span>📖</span> Carbon Field Guide
          </button>
        </div>

        {/* ─── VINTAGE CIRCULAR ECONOMY FLOWCHART (From Moodboard #06 & #09) ─── */}
        <div className="mt-6 p-5 sm:p-7 rounded-2xl bg-paper border border-kraft-border shadow-paper relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <span className="font-serif font-bold text-sm text-charcoal flex items-center gap-2">
              <span>🔄</span> The Closed-Loop Circular Lifecycle Flow
            </span>
            <span className="rubber-stamp stamp-rust text-[10px] font-bold">
              There Is No Planet B
            </span>
          </div>

          {/* Diagram Flow Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10 mb-6">
            {/* Stage 1: Raw Materials */}
            <div className="p-4 rounded-xl bg-parchment border border-kraft-border shadow-paper flex flex-col justify-between">
              <div>
                <span className="text-2xl mb-1 block">⛏️</span>
                <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-charcoal">
                  1. Raw Extraction
                </h3>
                <p className="text-[11px] font-sans text-charcoal/70 mt-1 leading-relaxed">
                  Drilling crude petroleum, logging timber, and mining virgin bauxite ores.
                </p>
              </div>
              <span className="rubber-stamp stamp-rust text-[9px] font-bold mt-3 self-start">
                High Energy & Fossil CO₂
              </span>
            </div>

            {/* Stage 2: Production */}
            <div className="p-4 rounded-xl bg-parchment border border-kraft-border shadow-paper flex flex-col justify-between">
              <div>
                <span className="text-2xl mb-1 block">🏭</span>
                <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-charcoal">
                  2. Manufacturing
                </h3>
                <p className="text-[11px] font-sans text-charcoal/70 mt-1 leading-relaxed">
                  Smelting, refining, thermal polymerization, and international freight.
                </p>
              </div>
              <span className="text-[10px] font-stamp text-charcoal/60 mt-3">
                Embodied Carbon Accrues
              </span>
            </div>

            {/* Stage 3: Product In Use */}
            <div className="p-4 rounded-xl bg-parchment border border-kraft-border shadow-paper flex flex-col justify-between">
              <div>
                <span className="text-2xl mb-1 block">📦</span>
                <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-charcoal">
                  3. Everyday Use
                </h3>
                <p className="text-[11px] font-sans text-charcoal/70 mt-1 leading-relaxed">
                  Packaging, food containers, devices, and clothing in consumer hands.
                </p>
              </div>
              <span className="font-hand text-forest font-bold text-sm mt-3">
                Pivot point: where does it go?
              </span>
            </div>

            {/* Stage 4: Closed Loop Recovery */}
            <div className="p-4 rounded-xl bg-[#EAF3EB] border border-forest/40 shadow-paper flex flex-col justify-between">
              <div>
                <span className="text-2xl mb-1 block">♻️</span>
                <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-forest">
                  4. Circular Loop
                </h3>
                <p className="text-[11px] font-sans text-charcoal/80 mt-1 leading-relaxed">
                  Recovered secondary feedstock cycles directly back into manufacturing!
                </p>
              </div>
              <span className="rubber-stamp stamp-green text-[9px] font-bold mt-3 self-start">
                Saves up to 95% Emissions
              </span>
            </div>
          </div>

          {/* Divergent Paths Banner: Recycling vs Landfill */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#F0F6F1] border border-forest/30 flex items-start gap-3">
              <span className="text-2xl mt-0.5">🌿</span>
              <div>
                <h4 className="font-serif font-bold text-xs text-forest uppercase tracking-wider mb-1">
                  Responsible Sorting Pathway
                </h4>
                <p className="text-xs font-sans text-charcoal/80 leading-relaxed">
                  Recycling an aluminum can uses 95% less energy than mining virgin bauxite. Composting food scraps stops anaerobic decomposition, intercepting potent methane before it escapes.
                </p>
                <div className="mt-2 text-forest font-stamp text-[10px] font-bold">
                  ★ A CIRCULAR ECONOMY • A CLEANER PLANET
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FDF3EE] border border-terracotta/30 flex items-start gap-3">
              <span className="text-2xl mt-0.5">⚠️</span>
              <div>
                <h4 className="font-serif font-bold text-xs text-terracotta uppercase tracking-wider mb-1">
                  Landfill Burial Consequence
                </h4>
                <p className="text-xs font-sans text-charcoal/80 leading-relaxed">
                  Organic waste rotting under tons of trash without oxygen releases fugitive methane (CH₄) — a greenhouse gas with 28× the heat-trapping capacity of standard carbon dioxide.
                </p>
                <div className="mt-2 text-terracotta font-stamp text-[10px] font-bold">
                  ★ MORE VIRGIN EXTRACTION = HIGHER EMISSIONS
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── INTERACTIVE SCIENTIFIC CARBON CALCULATOR ─── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-2xl font-serif font-bold text-charcoal">
              Interactive Carbon Footprint Engine
            </h2>
            <p className="text-charcoal/60 text-xs font-sans">
              Test lifecycle emissions for representative everyday specimens
            </p>
          </div>

          {/* Specimen Switcher Pills */}
          <div className="flex gap-1.5 bg-paper p-1 rounded-xl border border-kraft-border">
            {Object.entries(sampleItems).map(([key, item]) => (
              <button
                key={key}
                onClick={() => setCalculatorCategory(key)}
                className={`px-3 py-1 rounded-lg text-xs font-serif font-bold capitalize transition-all ${
                  calculatorCategory === key
                    ? "bg-forest text-parchment shadow-sm"
                    : "text-charcoal/60 hover:text-charcoal"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        <CarbonErrorBoundary>
          <CarbonFootprintCard
            key={calculatorCategory}
            wasteItem={sampleItems[calculatorCategory]}
            onOpenEducation={() => setShowEducationModal(true)}
          />
        </CarbonErrorBoundary>
      </div>

      {showEducationModal && (
        <CarbonEducationModal onClose={() => setShowEducationModal(false)} />
      )}
    </div>
  );
}
