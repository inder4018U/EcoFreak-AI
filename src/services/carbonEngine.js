/**
 * EcoFreak AI - Carbon Footprint Calculation Engine
 * 
 * Implements rigorous lifecycle greenhouse gas estimation based on
 * mass-balance formulas and published emission factor benchmarks.
 */

import {
  MATERIAL_FACTORS,
  ITEM_NAME_MAPPINGS,
  CATEGORY_DEFAULT_MATERIALS,
  EQUIVALENCIES,
  METHODOLOGY_INFO
} from "../data/emissionFactors.js";

/**
 * Resolves an item's material definition from its name, category, or explicit ID.
 * 
 * @param {Object} options
 * @param {string} [options.materialId] - Explicit material ID (e.g. 'plastic_pet')
 * @param {string} [options.itemName] - Detected name (e.g. 'Plastic Water Bottle')
 * @param {string} [options.wasteType] - Waste category (e.g. 'plastic', 'organic')
 * @returns {Object|null} Material factor configuration or null if not resolved
 */
export function resolveMaterial({ materialId, itemName, wasteType }) {
  // 1. Direct ID lookup
  if (materialId && MATERIAL_FACTORS[materialId]) {
    return MATERIAL_FACTORS[materialId];
  }

  // 2. Keyword heuristic lookup on item name
  if (itemName && typeof itemName === "string") {
    const cleanName = itemName.toLowerCase().trim();
    for (const mapping of ITEM_NAME_MAPPINGS) {
      for (const kw of mapping.keywords) {
        if (cleanName.includes(kw)) {
          return MATERIAL_FACTORS[mapping.materialId] || null;
        }
      }
    }
  }

  // 3. Fallback to default material for category
  if (wasteType && typeof wasteType === "string") {
    const cleanType = wasteType.toLowerCase().trim();
    const fallbackId = CATEGORY_DEFAULT_MATERIALS[cleanType];
    if (fallbackId && MATERIAL_FACTORS[fallbackId]) {
      return MATERIAL_FACTORS[fallbackId];
    }
  }

  return null;
}

/**
 * Finds default weight and mapping info for an item name
 * 
 * @param {string} itemName
 * @returns {{ defaultWeightG: number, materialId: string } | null}
 */
export function getArchetypeInfo(itemName) {
  if (!itemName || typeof itemName !== "string") return null;
  const cleanName = itemName.toLowerCase().trim();
  for (const mapping of ITEM_NAME_MAPPINGS) {
    for (const kw of mapping.keywords) {
      if (cleanName.includes(kw)) {
        return {
          defaultWeightG: mapping.defaultWeightG,
          materialId: mapping.materialId
        };
      }
    }
  }
  return null;
}

/**
 * Validates and converts weight to kilograms
 * 
 * @param {number|string} weight - Numerical weight
 * @param {"g"|"kg"} [unit="g"] - Weight unit
 * @returns {{ valid: boolean, weightKg: number, error?: string }}
 */
export function parseAndValidateWeight(weight, unit = "g") {
  if (weight === null || weight === undefined || weight === "") {
    return { valid: false, weightKg: 0, error: "Weight is required." };
  }

  const num = typeof weight === "number" ? weight : parseFloat(String(weight).trim());

  if (isNaN(num)) {
    return { valid: false, weightKg: 0, error: "Weight must be a valid number." };
  }

  if (num <= 0) {
    return { valid: false, weightKg: 0, error: "Weight must be greater than zero." };
  }

  if (!isFinite(num)) {
    return { valid: false, weightKg: 0, error: "Weight must be a finite number." };
  }

  if (num > 1000000 && unit === "g") {
    return { valid: false, weightKg: 0, error: "Weight exceeds reasonable single-object threshold (1,000 kg)." };
  }

  if (num > 1000 && unit === "kg") {
    return { valid: false, weightKg: 0, error: "Weight exceeds reasonable single-object threshold (1,000 kg)." };
  }

  const weightKg = unit === "kg" ? num : num / 1000;

  return { valid: true, weightKg };
}

/**
 * Calculates environmental gauge rating and qualitative tier based on emissions
 * 
 * @param {number} emissionsKgCO2e
 * @returns {{ tier: string, label: string, color: string, percentage: number, explanation: string }}
 */
export function getEmissionGauge(emissionsKgCO2e) {
  if (typeof emissionsKgCO2e !== "number" || isNaN(emissionsKgCO2e) || emissionsKgCO2e < 0) {
    return {
      tier: "unknown",
      label: "Unknown",
      color: "#94a3b8",
      percentage: 0,
      explanation: "Emissions data not available."
    };
  }

  if (emissionsKgCO2e < 0.05) {
    return {
      tier: "very_low",
      label: "Very Low",
      color: "#10b981", // emerald-500
      percentage: Math.min(100, Math.max(10, Math.round((emissionsKgCO2e / 0.05) * 20))),
      explanation: "Minimal carbon footprint (<0.05 kg CO₂e), typical of ultra-light packaging like plastic film or single paper sheets."
    };
  }

  if (emissionsKgCO2e < 0.20) {
    return {
      tier: "low",
      label: "Low",
      color: "#34d399", // emerald-400
      percentage: Math.min(40, 20 + Math.round(((emissionsKgCO2e - 0.05) / 0.15) * 20)),
      explanation: "Low carbon footprint (0.05–0.20 kg CO₂e), typical of single-use bottles, beverage cans, or small fruit portions."
    };
  }

  if (emissionsKgCO2e < 0.60) {
    return {
      tier: "moderate",
      label: "Moderate",
      color: "#f59e0b", // amber-500
      percentage: Math.min(65, 40 + Math.round(((emissionsKgCO2e - 0.20) / 0.40) * 25)),
      explanation: "Moderate carbon footprint (0.20–0.60 kg CO₂e), typical of heavy glass containers, shipping boxes, or dense food scraps."
    };
  }

  if (emissionsKgCO2e < 2.0) {
    return {
      tier: "high",
      label: "High",
      color: "#f97316", // orange-500
      percentage: Math.min(85, 65 + Math.round(((emissionsKgCO2e - 0.60) / 1.40) * 20)),
      explanation: "High carbon footprint (0.60–2.0 kg CO₂e), typical of apparel, complex packaging, or large batches of organic waste."
    };
  }

  return {
    tier: "very_high",
    label: "Very High",
    color: "#ef4444", // red-500
    percentage: Math.min(100, 85 + Math.round(Math.min(1.0, (emissionsKgCO2e - 2.0) / 3.0) * 15)),
    explanation: "Very high carbon footprint (>2.0 kg CO₂e), typical of consumer electronics, batteries, or industrial composite products."
  };
}

/**
 * Calculates educational everyday equivalents for a given CO₂e quantity
 * 
 * @param {number} emissionsKgCO2e
 * @returns {Object} Approximate equivalent activities
 */
export function calculateEquivalencies(emissionsKgCO2e) {
  if (typeof emissionsKgCO2e !== "number" || emissionsKgCO2e <= 0) {
    return {
      smartphones: 0,
      kmDriven: 0,
      ledHours: 0,
      treeDays: 0,
      disclaimer: "Equivalent conversions are approximate benchmarks based on EPA GHG calculators."
    };
  }

  return {
    smartphones: Number((emissionsKgCO2e * EQUIVALENCIES.smartphonesChargedPerKg).toFixed(1)),
    kmDriven: Number((emissionsKgCO2e * EQUIVALENCIES.kmDrivenPerKg).toFixed(2)),
    ledHours: Number((emissionsKgCO2e * EQUIVALENCIES.ledBulbHoursPerKg).toFixed(1)),
    treeDays: Number((emissionsKgCO2e * EQUIVALENCIES.treeAbsorptionDaysPerKg).toFixed(1)),
    disclaimer: "Equivalents are illustrative approximations derived from US EPA greenhouse gas equivalency formulas."
  };
}

/**
 * Determines overall estimation confidence score and rationale.
 * Separate from AI computer vision confidence.
 * 
 * @param {Object} params
 * @param {string} params.weightSource - 'measured' | 'user_entered' | 'assumed_default'
 * @param {boolean} params.isDirectMaterialMatch - whether material was matched specifically or category fallback
 * @param {string} params.materialUncertainty - uncertainty rating from material database
 * @returns {{ rating: "High" | "Medium" | "Low/Range", explanation: string }}
 */
export function assessEstimateConfidence({ weightSource, isDirectMaterialMatch, materialUncertainty }) {
  if (weightSource === "measured" && isDirectMaterialMatch) {
    return {
      rating: "High",
      explanation: "Verified material subtype with precise measured weight. Estimate is grounded in published lifecycle benchmarks."
    };
  }

  if (weightSource === "user_entered" && isDirectMaterialMatch) {
    return {
      rating: "High",
      explanation: "Specific material profile with user-adjusted weight. Minor variations remain based on regional electricity grid mix."
    };
  }

  if (weightSource === "assumed_default" && isDirectMaterialMatch) {
    return {
      rating: "Medium",
      explanation: "Identified material archetype using an assumed average weight. You can adjust the weight above for higher accuracy."
    };
  }

  if (!isDirectMaterialMatch) {
    return {
      rating: "Low/Range",
      explanation: "Broad category default factor used because the specific material formulation could not be verified from the image alone."
    };
  }

  return {
    rating: "Medium",
    explanation: `Based on average industry emission factors (${materialUncertainty || 'Medium'} empirical uncertainty).`
  };
}

/**
 * Core estimation function
 * 
 * @param {Object} input
 * @param {string} [input.materialId] - Material identifier
 * @param {string} [input.itemName] - Name of detected object
 * @param {string} [input.wasteType] - Category (plastic, organic, paper, glass, metal, hazardous)
 * @param {number|string} [input.weight] - Object weight
 * @param {"g"|"kg"} [input.unit="g"] - Weight unit
 * @param {"measured"|"user_entered"|"assumed_default"} [input.weightSource] - Origin of weight
 * @returns {Object} Comprehensive calculation result
 */
export function calculateCarbonFootprint(input = {}) {
  const {
    materialId,
    itemName,
    wasteType,
    weight,
    unit = "g",
    weightSource: providedWeightSource
  } = input;

  // 1. Resolve Material
  const material = resolveMaterial({ materialId, itemName, wasteType });

  if (!material) {
    return {
      success: false,
      error: "UNSUPPORTED_MATERIAL",
      message: "Emission factors are not available for this waste item or category.",
      explanation: "This object could not be mapped to a verified material in the lifecycle emission database. To prevent misleading estimates, no carbon figure was generated.",
      disclaimer: METHODOLOGY_INFO.disclaimer
    };
  }

  // 2. Resolve Weight
  let activeWeight = weight;
  let weightSource = providedWeightSource;

  if (activeWeight === undefined || activeWeight === null || activeWeight === "") {
    // Look up archetype default or material default
    const archetype = getArchetypeInfo(itemName);
    activeWeight = archetype ? archetype.defaultWeightG : material.defaultWeightG;
    weightSource = "assumed_default";
  } else if (!weightSource) {
    weightSource = "user_entered";
  }

  const weightValidation = parseAndValidateWeight(activeWeight, unit);
  if (!weightValidation.valid) {
    return {
      success: false,
      error: "INVALID_WEIGHT",
      message: weightValidation.error || "Invalid weight provided.",
      explanation: "Please enter a positive numeric weight value (e.g. 25g or 0.05kg).",
      material: {
        id: material.id,
        name: material.name,
        category: material.category
      }
    };
  }

  const weightKg = weightValidation.weightKg;
  const weightG = Number((weightKg * 1000).toFixed(1));

  // 3. Lifecycle Stage Calculations (Cradle-to-Gate + End-of-Life)
  // Production (Cradle-to-Gate):
  const productionEmissionsKg = Number((weightKg * material.cradleToGate).toFixed(4));

  // Landfill Disposal (Baseline End-of-Life):
  const landfillEmissionsKg = Number((weightKg * material.landfill).toFixed(4));

  // Total baseline footprint (Production + Landfill):
  const baselineTotalEmissionsKg = Number((productionEmissionsKg + landfillEmissionsKg).toFixed(4));

  // 4. Disposal Scenarios
  const scenarios = [];

  // Scenario A: Landfill
  scenarios.push({
    id: "landfill",
    label: "Landfill Disposal",
    icon: "🗑️",
    badge: "Baseline End-of-Life",
    status: "Highest Impact",
    isRecommended: false,
    endOfLifeEmissionsKg: landfillEmissionsKg,
    totalLifecycleEmissionsKg: baselineTotalEmissionsKg,
    netDifferenceVsLandfillKg: 0,
    impactDescription: material.category === "organic" || material.category === "paper"
      ? "Anaerobic decomposition in the landfill produces methane gas, a greenhouse gas 28× more potent than CO₂."
      : "Non-biodegradable material occupies landfill space and squanders the energy embodied in the virgin material.",
    methodologyNote: "Includes landfill equipment operations and methane generation where applicable (IPCC Tier 1/2)."
  });

  // Scenario B: Recycling (if supported)
  if (material.recycling && material.recycling.supported) {
    const recyclingProcessKg = Number((weightKg * material.recycling.processEmissions).toFixed(4));
    const recyclingCreditKg = Number((weightKg * material.recycling.avoidedCredit).toFixed(4));
    const recyclingNetEndOfLifeKg = Number((weightKg * material.recycling.netImpact).toFixed(4));
    const recyclingTotalLifecycleKg = Number((productionEmissionsKg + recyclingNetEndOfLifeKg).toFixed(4));
    const savingsVsLandfillKg = Number((landfillEmissionsKg - recyclingNetEndOfLifeKg).toFixed(4));

    scenarios.push({
      id: "recycling",
      label: "Recycling",
      icon: "♻️",
      badge: "Resource Recovery",
      status: savingsVsLandfillKg > 0 ? "Emissions Reduced" : "Process Emissions",
      isRecommended: true,
      endOfLifeEmissionsKg: recyclingNetEndOfLifeKg,
      totalLifecycleEmissionsKg: recyclingTotalLifecycleKg,
      netDifferenceVsLandfillKg: -1 * savingsVsLandfillKg, // negative means emissions prevented
      processEmissionsKg: recyclingProcessKg,
      avoidedVirginCreditKg: recyclingCreditKg,
      savingsVsLandfillKg,
      impactDescription: `Recycling reprocesses this material, displacing virgin production. Saves an estimated ${Math.abs(savingsVsLandfillKg).toFixed(3)} kg CO₂e compared to landfilling.`,
      methodologyNote: `${material.recycling.notes} Actual benefit varies with municipal sorting efficiency and contamination rates.`
    });
  }

  // Scenario C: Composting (if supported)
  if (material.composting && material.composting.supported) {
    const compostProcessKg = Number((weightKg * material.composting.processEmissions).toFixed(4));
    const compostCreditKg = Number((weightKg * material.composting.avoidedCredit).toFixed(4));
    const compostNetEndOfLifeKg = Number((weightKg * material.composting.netImpact).toFixed(4));
    const compostTotalLifecycleKg = Number((productionEmissionsKg + compostNetEndOfLifeKg).toFixed(4));
    const savingsVsLandfillKg = Number((landfillEmissionsKg - compostNetEndOfLifeKg).toFixed(4));

    scenarios.push({
      id: "composting",
      label: "Composting",
      icon: "🌱",
      badge: "Organic Circularity",
      status: "Recommended for Organics",
      isRecommended: true,
      endOfLifeEmissionsKg: compostNetEndOfLifeKg,
      totalLifecycleEmissionsKg: compostTotalLifecycleKg,
      netDifferenceVsLandfillKg: -1 * savingsVsLandfillKg,
      processEmissionsKg: compostProcessKg,
      avoidedCreditKg: compostCreditKg,
      savingsVsLandfillKg,
      impactDescription: `Aerobic composting prevents anaerobic methane emissions that occur when organic matter is buried in landfills. Offsets ~${Math.abs(savingsVsLandfillKg).toFixed(3)} kg CO₂e.`,
      methodologyNote: `${material.composting.notes} Generates nutrient-rich soil humus.`
    });
  }

  // Scenario D: Reuse / Avoided Production (if supported)
  if (material.reuse && material.reuse.supported) {
    const reuseRatio = material.reuse.avoidedRatio || 0.90;
    const avoidedProductionKg = Number((productionEmissionsKg * reuseRatio).toFixed(4));
    const reusedTotalPerCycleKg = Number((productionEmissionsKg * (1 - reuseRatio)).toFixed(4));

    scenarios.push({
      id: "reuse",
      label: "Reuse / Repurpose",
      icon: "🔄",
      badge: "Maximum Conservation",
      status: "Avoids New Production",
      isRecommended: true,
      endOfLifeEmissionsKg: 0,
      totalLifecycleEmissionsKg: reusedTotalPerCycleKg,
      netDifferenceVsLandfillKg: -1 * (avoidedProductionKg + landfillEmissionsKg),
      avoidedProductionCreditKg: -1 * avoidedProductionKg,
      savingsVsSingleUseKg: avoidedProductionKg,
      impactDescription: `Reusing or repurposing this item delays or eliminates the need to manufacture a replacement, avoiding up to ~${avoidedProductionKg.toFixed(3)} kg CO₂e of manufacturing emissions.`,
      methodologyNote: material.reuse.notes
    });
  }

  // 5. Gauge and Equivalencies
  const gauge = getEmissionGauge(productionEmissionsKg);
  const equivalencies = calculateEquivalencies(productionEmissionsKg);

  // 6. Confidence Assessment
  const isDirectMatch = Boolean(materialId || (itemName && getArchetypeInfo(itemName)));
  const confidence = assessEstimateConfidence({
    weightSource,
    isDirectMaterialMatch: isDirectMatch,
    materialUncertainty: material.uncertainty
  });

  return {
    success: true,
    objectName: itemName || material.shortName,
    material: {
      id: material.id,
      name: material.name,
      shortName: material.shortName,
      category: material.category,
      description: material.description
    },
    weight: {
      value: unit === "g" ? weightG : weightKg,
      unit,
      weightG,
      weightKg,
      source: weightSource, // "measured" | "user_entered" | "assumed_default"
      assumptionReason: weightSource === "assumed_default"
        ? (getArchetypeInfo(itemName)?.defaultWeightG ? `Documented archetype default for ${itemName}` : material.weightAssumptionReason)
        : null
    },
    footprint: {
      // Primary headline figure: Cradle-to-gate production impact
      productionEmissionsKg,
      landfillEmissionsKg,
      totalCradleToGraveKg: baselineTotalEmissionsKg,
      // Default recommended scenario savings:
      bestScenarioSavingsKg: scenarios.find(s => s.id === "recycling" || s.id === "composting")?.savingsVsLandfillKg || 0,
      emissionFactorKgCO2ePerKg: material.cradleToGate
    },
    lifecycle: {
      stage: "Cradle-to-Gate (Raw Material & Manufacturing) + End-of-Life Disposal",
      boundaries: METHODOLOGY_INFO.boundaries,
      scopeNotes: "Covers raw material extraction, refining, and factory fabrication. Retail distribution, customer use, and variable regional grid factors are excluded from this baseline."
    },
    gauge,
    equivalencies,
    confidence,
    scenarios,
    explanation: material.explanation,
    methodology: {
      sources: METHODOLOGY_INFO.sources,
      disclaimer: METHODOLOGY_INFO.disclaimer
    }
  };
}
