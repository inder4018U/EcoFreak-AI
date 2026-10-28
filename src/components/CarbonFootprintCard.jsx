import { useState, useMemo } from "react";
import {
  calculateCarbonFootprint,
  parseAndValidateWeight
} from "../services/carbonEngine.js";
import {
  MATERIAL_FACTORS,
  METHODOLOGY_INFO
} from "../data/emissionFactors.js";

export default function CarbonFootprintCard({
  wasteItem,
  onOpenEducation
}) {
  // Initial resolution from wasteItem
  const initialRes = useMemo(() => {
    return calculateCarbonFootprint({
      itemName: wasteItem?.itemName,
      wasteType: wasteItem?.type || wasteItem?.wasteType
    });
  }, [wasteItem]);

  const [selectedMaterialId, setSelectedMaterialId] = useState(
    initialRes.success ? initialRes.material.id : "plastic_general"
  );
  const [weightValue, setWeightValue] = useState(
    initialRes.success ? initialRes.weight.weightG.toString() : "20"
  );
  const [weightUnit, setWeightUnit] = useState("g");
  const [isUserWeight, setIsUserWeight] = useState(false);
  const [activeScenarioId, setActiveScenarioId] = useState(() => {
    if (initialRes.success) {
      if (initialRes.material.category === "organic") return "composting";
      if (initialRes.scenarios?.some(s => s.id === "recycling")) return "recycling";
    }
    return "landfill";
  });
  const [showMethodology, setShowMethodology] = useState(false);
  const [showMaterialSelector, setShowMaterialSelector] = useState(false);
  const [inputError, setInputError] = useState(null);

  // Recalculate carbon footprint
  const calculation = useMemo(() => {
    try {
      const numWeight = weightValue.trim() === "" ? undefined : parseFloat(weightValue);
      return calculateCarbonFootprint({
        materialId: selectedMaterialId,
        itemName: wasteItem?.itemName,
        wasteType: wasteItem?.type || wasteItem?.wasteType,
        weight: numWeight,
        unit: weightUnit,
        weightSource: isUserWeight ? "user_entered" : "assumed_default"
      });
    } catch (err) {
      return { success: false, error: "CALCULATION_ERROR", message: err.message };
    }
  }, [selectedMaterialId, wasteItem, weightValue, weightUnit, isUserWeight]);

  // Handle weight changes with validation
  const handleWeightChange = (val) => {
    setWeightValue(val);
    setIsUserWeight(true);
    if (val.trim() === "") {
      setInputError("Enter an approximate weight");
      return;
    }
    const check = parseAndValidateWeight(val, weightUnit);
    if (!check.valid) {
      setInputError(check.error || "Invalid weight");
    } else {
      setInputError(null);
    }
  };

  const handleUnitToggle = (newUnit) => {
    if (newUnit === weightUnit) return;
    const currentNum = parseFloat(weightValue);
    if (!isNaN(currentNum) && currentNum > 0) {
      if (newUnit === "kg") {
        setWeightValue((currentNum / 1000).toFixed(3));
      } else {
        setWeightValue(Math.round(currentNum * 1000).toString());
      }
    }
    setWeightUnit(newUnit);
  };

  const resetToDefaultWeight = () => {
    if (calculation.success && calculation.weight) {
      const mat = MATERIAL_FACTORS[selectedMaterialId];
      if (mat) {
        setWeightValue(mat.defaultWeightG.toString());
        setWeightUnit("g");
        setIsUserWeight(false);
        setInputError(null);
      }
    }
  };

  if (!calculation.success) {
    return (
      <div className="mt-5 rounded-2xl parchment-sheet p-5 text-left shadow-paper">
        <div className="flex items-center gap-2 mb-2 text-terracotta font-serif font-bold text-sm">
          <span>⚠️</span> Carbon Footprint Data Notice
        </div>
        <p className="text-charcoal/80 text-xs leading-relaxed mb-3 font-sans">
          {calculation.explanation || calculation.message}
        </p>
        <p className="text-charcoal/50 text-[11px] italic font-sans">
          {calculation.disclaimer || METHODOLOGY_INFO.disclaimer}
        </p>
      </div>
    );
  }

  const {
    material,
    weight,
    footprint,
    gauge,
    equivalencies,
    confidence,
    scenarios,
    explanation,
    lifecycle,
    methodology
  } = calculation;

  const currentScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];

  return (
    <div className="mt-5 rounded-2xl parchment-sheet p-5 text-left relative overflow-hidden">
      {/* Tape accent */}
      <div className="washi-tape tape-top" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-kraft-border flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🌍</span>
          <div>
            <h3 className="text-charcoal text-base font-serif font-bold tracking-tight">
              Embodied Carbon & Lifecycle Impact
            </h3>
            <p className="text-charcoal/60 text-xs font-sans">
              Scientific Greenhouse Gas Estimation (kg CO₂e)
            </p>
          </div>
        </div>
        {onOpenEducation && (
          <button
            onClick={onOpenEducation}
            className="px-3 py-1 rounded-lg bg-forest/15 hover:bg-forest/25 border border-forest/30 text-forest text-xs font-serif font-bold transition-all"
            title="Learn how carbon footprints are calculated"
          >
            🎓 Field Guide
          </button>
        )}
      </div>

      {/* Main Carbon Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 bg-paper rounded-xl p-4 border border-kraft-border shadow-paper">
        <div>
          <span className="text-charcoal/60 font-serif text-[11px] uppercase tracking-wider block mb-1">
            Cradle-to-Gate Footprint
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-charcoal font-serif tracking-tight">
              {footprint.productionEmissionsKg.toFixed(3)}
            </span>
            <span className="text-forest font-stamp font-bold text-sm">kg CO₂e</span>
          </div>
          <p className="text-charcoal/70 text-[11px] mt-1 font-sans">
            ≈ {(footprint.productionEmissionsKg * 1000).toFixed(1)} grams CO₂ equivalent
          </p>
        </div>

        {/* Visual Gauge */}
        <div className="flex flex-col justify-between pt-1 sm:pt-0">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-charcoal/60 font-serif">Impact Tier:</span>
            <span
              className="font-bold px-2 py-0.5 rounded text-[11px] font-stamp border"
              style={{
                color: gauge.color,
                borderColor: `${gauge.color}70`,
                background: `${gauge.color}15`
              }}
            >
              {gauge.label}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-3 w-full bg-kraft/30 rounded-full overflow-hidden relative border border-kraft-border/40">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${gauge.percentage}%`,
                backgroundColor: gauge.color
              }}
            />
          </div>
          <p className="text-charcoal/50 text-[10px] mt-1 text-right font-sans">
            Scale benchmark: single-use household items
          </p>
        </div>
      </div>

      {/* Material & Weight Controls */}
      <div className="space-y-3 mb-4">
        {/* Material Selection */}
        <div className="bg-paper rounded-xl p-3.5 border border-kraft-border shadow-paper">
          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
            <span className="text-charcoal/60 font-serif text-xs uppercase tracking-wider">Identified Material</span>
            <button
              onClick={() => setShowMaterialSelector(!showMaterialSelector)}
              className="text-forest hover:text-forest-dark text-xs font-serif font-semibold underline"
            >
              {showMaterialSelector ? "Done" : "Change Material"}
            </button>
          </div>

          {!showMaterialSelector ? (
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-charcoal text-sm font-serif font-bold">{material.name}</p>
                <p className="text-charcoal/60 text-xs font-sans">{material.description}</p>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded bg-parchment text-charcoal border border-kraft-border font-stamp">
                {material.cradleToGate} kg CO₂e/kg
              </span>
            </div>
          ) : (
            <div className="mt-2">
              <label htmlFor="material-select" className="text-charcoal/70 text-xs block mb-1 font-serif">
                Select specific material formulation:
              </label>
              <select
                id="material-select"
                value={selectedMaterialId}
                onChange={(e) => {
                  setSelectedMaterialId(e.target.value);
                  setShowMaterialSelector(false);
                }}
                className="w-full bg-parchment border border-kraft-border rounded-lg px-3 py-2 text-charcoal text-xs focus:outline-none focus:border-forest"
              >
                {Object.values(MATERIAL_FACTORS).map((mat) => (
                  <option key={mat.id} value={mat.id}>
                    {mat.name} ({mat.category.toUpperCase()}) — {mat.cradleToGate} kg CO₂e/kg
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Weight Adjustment */}
        <div className="bg-paper rounded-xl p-3.5 border border-kraft-border shadow-paper">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
            <div className="flex items-center gap-1.5">
              <span className="text-charcoal/60 font-serif text-xs uppercase tracking-wider">Object Mass</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-stamp ${
                  weight.source === "assumed_default"
                    ? "bg-kraft-light/50 text-charcoal border border-kraft-border"
                    : "bg-forest/15 text-forest border border-forest/30"
                }`}
              >
                {weight.source === "assumed_default" ? "Standard Default" : "Field Specified"}
              </span>
            </div>

            {weight.source === "user_entered" && (
              <button
                onClick={resetToDefaultWeight}
                className="text-forest hover:text-forest-dark text-[11px] font-serif underline"
              >
                Reset Default
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="number"
                step={weightUnit === "kg" ? "0.001" : "1"}
                min="0.1"
                value={weightValue}
                onChange={(e) => handleWeightChange(e.target.value)}
                placeholder="Enter mass"
                className="w-full bg-parchment border border-kraft-border rounded-lg px-3 py-1.5 text-charcoal text-sm focus:outline-none focus:border-forest font-sans"
              />
            </div>

            {/* Unit Toggle Buttons */}
            <div className="flex bg-parchment rounded-lg p-0.5 border border-kraft-border">
              <button
                type="button"
                onClick={() => handleUnitToggle("g")}
                className={`px-3 py-1 rounded text-xs font-serif font-bold transition-all ${
                  weightUnit === "g"
                    ? "bg-forest text-parchment shadow-sm"
                    : "text-charcoal/60 hover:text-charcoal"
                }`}
              >
                grams (g)
              </button>
              <button
                type="button"
                onClick={() => handleUnitToggle("kg")}
                className={`px-3 py-1 rounded text-xs font-serif font-bold transition-all ${
                  weightUnit === "kg"
                    ? "bg-forest text-parchment shadow-sm"
                    : "text-charcoal/60 hover:text-charcoal"
                }`}
              >
                kilograms (kg)
              </button>
            </div>
          </div>

          {inputError && (
            <p className="text-terracotta text-xs mt-1.5 font-sans">{inputError}</p>
          )}

          {weight.source === "assumed_default" && weight.assumptionReason && (
            <p className="text-charcoal/50 text-[11px] mt-1.5 italic font-sans">
              ℹ️ {weight.assumptionReason}
            </p>
          )}
        </div>
      </div>

      {/* Environmental Explanation */}
      <div className="mb-4 bg-[#F2F7F2] rounded-xl p-3.5 border border-forest/30 shadow-paper">
        <div className="flex items-center gap-1.5 text-forest text-xs font-serif font-bold uppercase tracking-wider mb-1">
          <span>🌱</span> Why This Impact Occurs
        </div>
        <p className="text-charcoal/85 text-xs leading-relaxed font-sans">
          {explanation}
        </p>
      </div>

      {/* Disposal Scenario Interactive Comparison */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
          <span className="text-charcoal/70 font-serif text-xs uppercase tracking-wider font-bold">
            End-of-Life Scenario Comparison
          </span>
          <span className="text-charcoal/50 text-[11px] font-sans">Lifecycle Pathways</span>
        </div>

        {/* Scenario Tab Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-2.5">
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setActiveScenarioId(sc.id)}
              className={`p-2.5 rounded-xl text-left border transition-all text-xs flex flex-col justify-between shadow-paper ${
                activeScenarioId === sc.id
                  ? "bg-forest text-parchment border-forest shadow-md"
                  : "bg-paper border-kraft-border text-charcoal/70 hover:bg-parchment"
              }`}
            >
              <div className="flex items-center gap-1 font-serif font-bold text-xs mb-1">
                <span>{sc.icon}</span>
                <span className="truncate">{sc.label}</span>
              </div>
              <span className={`text-[10px] font-stamp ${
                activeScenarioId === sc.id
                  ? "text-parchment/90"
                  : sc.id === "landfill"
                  ? "text-terracotta"
                  : "text-forest font-bold"
              }`}>
                {sc.id === "landfill" ? `+${sc.endOfLifeEmissionsKg} kg` : `Net: ${sc.endOfLifeEmissionsKg} kg`}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Scenario Details Card */}
        {currentScenario && (
          <div className="bg-paper rounded-xl p-3.5 border border-kraft-border space-y-2 shadow-paper">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <span className="text-charcoal font-serif font-bold text-xs flex items-center gap-1.5">
                <span>{currentScenario.icon}</span> {currentScenario.label}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-stamp font-bold border ${
                  currentScenario.id === "landfill"
                    ? "bg-terracotta/15 text-terracotta border-terracotta/30"
                    : "bg-forest/15 text-forest border-forest/30"
                }`}
              >
                {currentScenario.status}
              </span>
            </div>

            <p className="text-charcoal/85 text-xs leading-relaxed font-sans">
              {currentScenario.impactDescription}
            </p>

            {currentScenario.id !== "landfill" && currentScenario.savingsVsLandfillKg > 0 && (
              <div className="flex items-center justify-between pt-1 border-t border-kraft-border text-xs flex-wrap gap-1">
                <span className="text-forest font-serif font-semibold">Estimated Net Savings vs Landfill:</span>
                <span className="text-forest font-stamp font-bold">
                  {currentScenario.savingsVsLandfillKg.toFixed(3)} kg CO₂e saved
                </span>
              </div>
            )}

            <p className="text-charcoal/50 text-[11px] italic font-sans">
              ℹ️ {currentScenario.methodologyNote}
            </p>
          </div>
        )}
      </div>

      {/* Approximate Everyday Equivalencies */}
      <div className="mb-4">
        <span className="text-charcoal/60 font-serif text-[11px] uppercase tracking-wider block mb-2 font-bold">
          Everyday Equivalencies (Embodied Production)
        </span>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-paper rounded-xl p-2.5 border border-kraft-border shadow-paper">
            <span className="text-base block mb-0.5">📱</span>
            <p className="text-charcoal font-stamp font-bold text-xs">{equivalencies.smartphones}</p>
            <p className="text-charcoal/60 text-[10px] font-sans">Phone charges</p>
          </div>

          <div className="bg-paper rounded-xl p-2.5 border border-kraft-border shadow-paper">
            <span className="text-base block mb-0.5">🚗</span>
            <p className="text-charcoal font-stamp font-bold text-xs">{equivalencies.kmDriven} km</p>
            <p className="text-charcoal/60 text-[10px] font-sans">Gasoline driving</p>
          </div>

          <div className="bg-paper rounded-xl p-2.5 border border-kraft-border shadow-paper">
            <span className="text-base block mb-0.5">💡</span>
            <p className="text-charcoal font-stamp font-bold text-xs">{equivalencies.ledHours} hrs</p>
            <p className="text-charcoal/60 text-[10px] font-sans">10W LED bulb</p>
          </div>
        </div>
        <p className="text-charcoal/40 text-[10px] mt-1.5 text-center italic font-sans">
          *Illustrative approximate benchmarks calculated from US EPA GHG conversion coefficients.
        </p>
      </div>

      {/* Data Confidence & Transparency */}
      <div className="flex items-center justify-between text-xs py-2 px-3 bg-paper rounded-xl border border-kraft-border mb-3 shadow-paper">
        <span className="text-charcoal/60 font-serif text-[11px]">Lifecycle Estimate Confidence:</span>
        <span
          className={`font-stamp font-bold px-2 py-0.5 rounded text-[11px] ${
            confidence.rating === "High"
              ? "text-forest bg-forest/15 border border-forest/30"
              : confidence.rating === "Medium"
              ? "text-sky-dark bg-sky/20 border border-sky/40"
              : "text-terracotta bg-terracotta/15 border border-terracotta/30"
          }`}
        >
          {confidence.rating} Confidence
        </span>
      </div>

      {/* Expandable Methodology & Sources Accordion */}
      <div className="border-t border-kraft-border pt-3">
        <button
          onClick={() => setShowMethodology(!showMethodology)}
          className="w-full flex items-center justify-between text-charcoal/60 hover:text-charcoal text-xs transition-colors py-1"
        >
          <span className="flex items-center gap-1.5 font-serif font-semibold">
            <span>🔬</span> Data Standards, Lifecycle Boundaries & Literature
          </span>
          <span className="text-xs">{showMethodology ? "▲" : "▼"}</span>
        </button>

        {showMethodology && (
          <div className="mt-3 p-3.5 bg-paper rounded-xl text-left border border-kraft-border space-y-2.5 text-xs text-charcoal/80 animate-fadeIn shadow-paper">
            <div>
              <p className="text-charcoal font-serif font-bold text-[11px] uppercase tracking-wider mb-1">
                System Boundary Definition
              </p>
              <p className="text-[11px] leading-relaxed text-charcoal/70 font-sans">
                {lifecycle.stage}. {lifecycle.scopeNotes}
              </p>
            </div>

            <div>
              <p className="text-charcoal font-serif font-bold text-[11px] uppercase tracking-wider mb-1">
                Key Literature & Standards
              </p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-charcoal/70 font-sans">
                {methodology.sources.map((s, idx) => (
                  <li key={idx}>
                    <strong className="text-charcoal">{s.name}</strong> ({s.year}) — {s.scope}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-kraft-border text-[10px] text-charcoal/50 italic font-sans">
              <strong>Disclaimer:</strong> {methodology.disclaimer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
