/**
 * EcoFreak AI - Carbon Footprint & Emission Factors Database
 * 
 * Sources:
 * 1. UK Department for Energy Security and Net Zero (DESNZ) / DEFRA
 *    "Government greenhouse gas conversion factors for company reporting" (2023/2024 update).
 * 2. United States Environmental Protection Agency (US EPA)
 *    "Waste Reduction Model (WARM) Version 16" (2023).
 * 3. Intergovernmental Panel on Climate Change (IPCC)
 *    "2019 Refinement to the 2006 IPCC Guidelines for National Greenhouse Gas Inventories".
 * 4. Inventory of Carbon & Energy (ICE v3.0), Circular Ecology / University of Bath.
 *
 * System Boundaries:
 * - Production (Cradle-to-Gate): Raw material extraction, refining, material synthesis,
 *   and manufacturing up to the factory gate. Excludes retail distribution and consumer use.
 * - Landfill (End-of-Life): Fugitive methane/CO₂ emissions from anaerobic decomposition
 *   (for degradable organics/paper) and landfill equipment operation.
 * - Recycling (Net End-of-Life): Energy consumed in collection, sorting, transport,
 *   and secondary reprocessing minus the credit for displaced virgin material manufacture.
 *   Note: Net values are negative when recycling prevents more emissions than it consumes.
 * - Composting: Aerobic decomposition emissions (biogenic CO₂ and trace N₂O) minus
 *   landfill methane avoidance and synthetic fertilizer offset credits.
 * - Reuse: Avoided virgin production emissions discounted by minor cleaning/handling energy.
 */

export const EMISSION_DATA_VERSION = "2024.1";

export const METHODOLOGY_INFO = {
  sources: [
    {
      name: "UK DESNZ / DEFRA GHG Conversion Factors",
      year: "2023/2024",
      url: "https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting",
      scope: "Material use (cradle-to-gate) and waste disposal (landfill, closed-loop recycling, composting)."
    },
    {
      name: "US EPA Waste Reduction Model (WARM v16)",
      year: "2023",
      url: "https://www.epa.gov/warm",
      scope: "Lifecycle greenhouse gas offsets, virgin material substitution, and avoided landfill emissions."
    },
    {
      name: "IPCC Guidelines for National GHG Inventories",
      year: "2019 Refinement",
      url: "https://www.ipcc-nggip.iges.or.jp/public/2019rf/",
      scope: "Global Warming Potential values (GWP100) and waste sector decomposition modeling."
    }
  ],
  boundaries: {
    production: "Cradle-to-gate (raw material extraction through factory manufacturing).",
    disposal: "End-of-life processing (landfill decomposition, recycling remelting, or composting).",
    netCredits: "Avoided-burden approach (credits for virgin materials or fossil fertilizers displaced)."
  },
  disclaimer: "All carbon footprint figures are educational estimates derived from industry-standard averages. Actual emissions vary based on local electricity grid mix, regional transport distances, municipal waste infrastructure, and specific manufacturing processes."
};

/**
 * Emission factors per kilogram of material (kg CO₂e / kg material)
 */
export const MATERIAL_FACTORS = {
  // ── PLASTICS ───────────────────────────────────────────────────────────────
  plastic_pet: {
    id: "plastic_pet",
    category: "plastic",
    name: "PET Plastic (Polyethylene Terephthalate)",
    shortName: "PET Plastic",
    description: "Clear beverage bottles, thermoformed food trays, and blister packs (#1 plastic).",
    cradleToGate: 2.80, // kg CO2e / kg (DEFRA 2023 / ecoinvent)
    landfill: 0.021,    // inert in landfill, equipment emissions only
    recycling: {
      supported: true,
      processEmissions: 1.15,
      avoidedCredit: -2.35,
      netImpact: -1.20, // Net benefit of ~1.20 kg CO2e avoided per kg recycled
      notes: "High demand for clean PET bottle-to-bottle flake recycling."
    },
    composting: { supported: false, netImpact: null, notes: "Non-biodegradable; do not compost." },
    reuse: {
      supported: true,
      avoidedRatio: 0.90,
      notes: "Refillable bottles displace repeated single-use bottle manufacturing."
    },
    defaultWeightG: 22,
    weightAssumptionReason: "Standard 500ml single-use water/soda bottle with cap.",
    uncertainty: "Medium (±15% depending on energy grid and bottle thickness)",
    explanation: "PET production requires petroleum extraction and high-temperature polymerization. Because plastic does not biodegrade in landfills, its primary footprint occurs during oil extraction and resin synthesis. High-rate mechanical recycling yields substantial emissions savings."
  },

  plastic_hdpe: {
    id: "plastic_hdpe",
    category: "plastic",
    name: "HDPE Plastic (High-Density Polyethylene)",
    shortName: "HDPE Plastic",
    description: "Milk jugs, shampoo/detergent bottles, bottle caps, plastic tubs (#2 plastic).",
    cradleToGate: 2.10,
    landfill: 0.021,
    recycling: {
      supported: true,
      processEmissions: 0.95,
      avoidedCredit: -1.85,
      netImpact: -0.90,
      notes: "Widely recycled into pipes, plastic lumber, and non-food containers."
    },
    composting: { supported: false, netImpact: null, notes: "Non-biodegradable." },
    reuse: {
      supported: true,
      avoidedRatio: 0.92,
      notes: "Heavy-duty HDPE containers can be reused dozens of times."
    },
    defaultWeightG: 45,
    weightAssumptionReason: "Typical 1-litre detergent or milk jug container.",
    uncertainty: "Medium (±15%)",
    explanation: "HDPE requires ethylene cracking from natural gas or petroleum. While lower in embodied carbon than PET, producing virgin HDPE still releases over 2 kg CO₂e per kg."
  },

  plastic_ldpe: {
    id: "plastic_ldpe",
    category: "plastic",
    name: "LDPE Plastic (Low-Density Polyethylene)",
    shortName: "LDPE Film & Bags",
    description: "Plastic grocery bags, bubble wrap, squeeze bottles, shrink film (#4 plastic).",
    cradleToGate: 2.45,
    landfill: 0.021,
    recycling: {
      supported: true,
      processEmissions: 1.20,
      avoidedCredit: -1.95,
      netImpact: -0.75,
      notes: "Film recycling requires specialized drop-off points; often tangles in standard MRF sorters."
    },
    composting: { supported: false, netImpact: null, notes: "Non-biodegradable." },
    reuse: {
      supported: true,
      avoidedRatio: 0.88,
      notes: "Reusing plastic bags multiple times significantly dilutes per-use footprint."
    },
    defaultWeightG: 8,
    weightAssumptionReason: "Average single-use plastic carrier or produce bag.",
    uncertainty: "Medium (±20% due to film thickness variations)",
    explanation: "Lightweight film requires significant energy to blow-mold. Reusing bags or switching to durable cloth bags quickly mitigates this recurring footprint."
  },

  plastic_pp: {
    id: "plastic_pp",
    category: "plastic",
    name: "PP Plastic (Polypropylene)",
    shortName: "PP Containers",
    description: "Yogurt pots, takeaway containers, straws, bottle caps, microwaveable containers (#5).",
    cradleToGate: 2.05,
    landfill: 0.021,
    recycling: {
      supported: true,
      processEmissions: 0.98,
      avoidedCredit: -1.78,
      netImpact: -0.80,
      notes: "Increasingly accepted in curb-side recycling programs."
    },
    composting: { supported: false, netImpact: null, notes: "Non-biodegradable." },
    reuse: {
      supported: true,
      avoidedRatio: 0.94,
      notes: "Durable PP food containers are suitable for long-term meal prep reuse."
    },
    defaultWeightG: 25,
    weightAssumptionReason: "Typical takeaway food tub or large yogurt container.",
    uncertainty: "Medium (±15%)",
    explanation: "PP is resistant to heat and chemicals, making it ideal for food packaging. Recycling PP saves around 0.8 kg CO₂e/kg compared to virgin polypropylene manufacture."
  },

  plastic_general: {
    id: "plastic_general",
    category: "plastic",
    name: "General / Mixed Plastic Packaging",
    shortName: "Mixed Plastic",
    description: "Assorted rigid and flexible plastic packaging without specific polymer mark.",
    cradleToGate: 2.53,
    landfill: 0.021,
    recycling: {
      supported: true,
      processEmissions: 1.10,
      avoidedCredit: -2.00,
      netImpact: -0.90,
      notes: "Depends on sorting efficiency and regional polymer separation technology."
    },
    composting: { supported: false, netImpact: null, notes: "Non-biodegradable." },
    reuse: {
      supported: true,
      avoidedRatio: 0.90,
      notes: "Reuse containers where safe and hygienic."
    },
    defaultWeightG: 20,
    weightAssumptionReason: "Average single-use plastic household item.",
    uncertainty: "High (±25% due to varying polymer blend and additives)",
    explanation: "Mixed plastics represent a composite benchmark across commercial packaging. Producing virgin plastic polymers emits 2.0–3.0 kg CO₂e per kg."
  },

  // ── PAPER & CARDBOARD ──────────────────────────────────────────────────────
  paper_cardboard: {
    id: "paper_cardboard",
    category: "paper",
    name: "Corrugated Cardboard",
    shortName: "Cardboard Box",
    description: "Shipping boxes, corrugated packaging, and heavy cardboard cartons.",
    cradleToGate: 1.10, // DEFRA 2023 / EPA WARM
    landfill: 1.05,    // Anaerobic methane emissions in landfill
    recycling: {
      supported: true,
      processEmissions: 0.40,
      avoidedCredit: -0.85,
      netImpact: -0.45,
      notes: "Cardboard fibers can be recycled 5 to 7 times."
    },
    composting: {
      supported: true,
      processEmissions: 0.08,
      avoidedCredit: -0.12,
      netImpact: -0.04,
      notes: "Shredded unprinted corrugated cardboard is excellent brown carbon matter for composting."
    },
    reuse: {
      supported: true,
      avoidedRatio: 0.92,
      notes: "Reusing shipping boxes for storage or shipping cuts production emissions completely."
    },
    defaultWeightG: 180,
    weightAssumptionReason: "Small-to-medium corrugated postal delivery box.",
    uncertainty: "Low (±10%)",
    explanation: "Cardboard has moderate manufacturing emissions, but when buried in an anaerobic landfill, moisture causes it to decay and generate methane (a potent greenhouse gas with 28× the warming impact of CO₂). Recycling or composting cardboard prevents this methane release."
  },

  paper_office: {
    id: "paper_office",
    category: "paper",
    name: "Office / Printing Paper",
    shortName: "Office Paper",
    description: "White copy paper, documents, stationery, notebook pages.",
    cradleToGate: 1.35,
    landfill: 1.15,
    recycling: {
      supported: true,
      processEmissions: 0.48,
      avoidedCredit: -1.05,
      netImpact: -0.57,
      notes: "Clean de-inked white paper provides high-grade recycled pulp."
    },
    composting: {
      supported: true,
      processEmissions: 0.10,
      avoidedCredit: -0.15,
      netImpact: -0.05,
      notes: "Can be composted if free from synthetic dyes and non-toxic inks."
    },
    reuse: {
      supported: true,
      avoidedRatio: 0.85,
      notes: "Using the blank back side for draft printing or scrap notes doubles paper utility."
    },
    defaultWeightG: 15,
    weightAssumptionReason: "Approximately 3 standard A4 80gsm sheets.",
    uncertainty: "Low (±10%)",
    explanation: "Wood pulping, chemical bleaching, and drying require substantial thermal energy and water. De-inking and recycling paper reduces energy consumption by 40% and saves timber ecosystems."
  },

  paper_newspaper: {
    id: "paper_newspaper",
    category: "paper",
    name: "Newspaper & Magazines",
    shortName: "Newspaper",
    description: "Daily newspapers, periodical magazines, printed flyers.",
    cradleToGate: 1.25,
    landfill: 1.00,
    recycling: {
      supported: true,
      processEmissions: 0.42,
      avoidedCredit: -0.92,
      netImpact: -0.50,
      notes: "Readily recycled into new newsprint or molded fiber packaging."
    },
    composting: {
      supported: true,
      processEmissions: 0.08,
      avoidedCredit: -0.10,
      netImpact: -0.02,
      notes: "Standard non-glossy newspaper is carbon-rich mulch for compost heaps."
    },
    reuse: {
      supported: true,
      avoidedRatio: 0.80,
      notes: "Used for cleaning glass, packing fragile goods, or garden weed barriers."
    },
    defaultWeightG: 110,
    weightAssumptionReason: "Typical weekday newspaper edition.",
    uncertainty: "Low (±10%)",
    explanation: "Mechanical wood pulping has lower chemical use than chemical pulp, but paper degrades rapidly in landfills producing landfill gas. Recycling recovers clean cellulose fibers."
  },

  paper_general: {
    id: "paper_general",
    category: "paper",
    name: "General Paper Packaging",
    shortName: "Paper Waste",
    description: "Mixed paper bags, paper wrapping, cereal cartons, paperboard.",
    cradleToGate: 1.20,
    landfill: 1.05,
    recycling: {
      supported: true,
      processEmissions: 0.45,
      avoidedCredit: -0.90,
      netImpact: -0.45,
      notes: "Widely accepted in standard paper recycling collection."
    },
    composting: {
      supported: true,
      processEmissions: 0.09,
      avoidedCredit: -0.11,
      netImpact: -0.02,
      notes: "Only compost if unlaminated without plastic film lining."
    },
    reuse: {
      supported: true,
      avoidedRatio: 0.90,
      notes: "Reusing paper bags for groceries or packaging avoids virgin bag production."
    },
    defaultWeightG: 40,
    weightAssumptionReason: "Average retail paper shopping bag or food carton.",
    uncertainty: "Medium (±15%)",
    explanation: "Paper production is energy and water intensive. Diverting paper away from landfills prevents anaerobic methane generation."
  },

  // ── GLASS ──────────────────────────────────────────────────────────────────
  glass_container: {
    id: "glass_container",
    category: "glass",
    name: "Container Glass (Bottles & Jars)",
    shortName: "Glass Bottle / Jar",
    description: "Clear, green, and amber glass bottles, condiment jars, and beverage glassware.",
    cradleToGate: 0.85, // DEFRA 2023 / British Glass
    landfill: 0.021,    // Inert material, no decomposition
    recycling: {
      supported: true,
      processEmissions: 0.53, // Crushing and remelting cullet in furnace
      avoidedCredit: -0.85,   // Offsets virgin soda ash, limestone, silica melting
      netImpact: -0.32,       // Net ~0.32 kg CO2e saved per kg recycled
      notes: "Glass is 100% endlessly recyclable without loss of quality, purity, or strength."
    },
    composting: { supported: false, netImpact: null, notes: "Non-biodegradable mineral material." },
    reuse: {
      supported: true,
      avoidedRatio: 0.95,
      notes: "Rinsing and refilling a glass bottle or jar saves nearly all of its embodied energy."
    },
    defaultWeightG: 230,
    weightAssumptionReason: "Standard 330ml-500ml empty glass bottle or medium sauce jar.",
    uncertainty: "Low (±10%)",
    explanation: "Glass is manufactured by heating silica sand, soda ash, and limestone to 1,500°C in natural-gas-fired furnaces. While heavy to transport, glass is chemically inert and infinitely recyclable. Using recycled cullet lowers furnace melting temperatures, cutting energy use and emissions."
  },

  // ── METALS ─────────────────────────────────────────────────────────────────
  metal_aluminum: {
    id: "metal_aluminum",
    category: "metal",
    name: "Aluminum (Cans & Foil)",
    shortName: "Aluminum Can",
    description: "Beverage cans, aluminum food tins, foil wraps, aerosol cans.",
    cradleToGate: 11.50, // High embodied energy: bauxite mining + Hall-Héroult electrolysis
    landfill: 0.021,     // Inert in landfill
    recycling: {
      supported: true,
      processEmissions: 0.65, // Remelting secondary ingot uses 95% less energy!
      avoidedCredit: -10.50,
      netImpact: -9.85,      // Huge emissions credit: ~9.85 kg CO2e saved per kg!
      notes: "Recycling aluminum uses 95% less energy than producing primary aluminum from bauxite ore."
    },
    composting: { supported: false, netImpact: null, notes: "Non-biodegradable metal." },
    reuse: {
      supported: true,
      avoidedRatio: 0.95,
      notes: "Reuse durable aluminum containers or clean foil where practical."
    },
    defaultWeightG: 14.5,
    weightAssumptionReason: "Standard empty 330ml aluminum beverage can.",
    uncertainty: "Medium (±15% depending on smelter hydroelectric vs coal power)",
    explanation: "Smelting virgin aluminum from bauxite ore is extremely electricity-intensive (~14 kWh/kg). Because remelting aluminum scrap requires only 5% of this energy, recycling an aluminum can saves massive amounts of greenhouse gases — one of the highest climate dividends in waste management."
  },

  metal_steel: {
    id: "metal_steel",
    category: "metal",
    name: "Steel / Tin Cans",
    shortName: "Steel Tin / Can",
    description: "Food tins, pet food cans, steel bottle crowns, aerosol cans.",
    cradleToGate: 2.40,
    landfill: 0.021,
    recycling: {
      supported: true,
      processEmissions: 0.70,
      avoidedCredit: -2.10,
      netImpact: -1.40,
      notes: "Easily separated with industrial electromagnets at sorting facilities."
    },
    composting: { supported: false, netImpact: null, notes: "Non-biodegradable metal." },
    reuse: {
      supported: true,
      avoidedRatio: 0.92,
      notes: "Tins can be washed and reused for desk organization or seedlings."
    },
    defaultWeightG: 50,
    weightAssumptionReason: "Typical empty 400g canned soup or baked beans tin.",
    uncertainty: "Low (±10%)",
    explanation: "Steel making in blast furnaces burns metallurgical coking coal. Recycled scrap steel in electric arc furnaces requires 60–75% less energy and significantly cuts direct CO₂ emissions."
  },

  // ── ORGANIC WASTE ──────────────────────────────────────────────────────────
  organic_food: {
    id: "organic_food",
    category: "organic",
    name: "Food Scraps & Kitchen Waste",
    shortName: "Food Scraps",
    description: "Fruit and vegetable peelings, uneaten cooked food, bread, coffee grounds, eggshells.",
    cradleToGate: 1.90, // Average embodied agricultural & supply chain carbon (IPCC / FAO)
    landfill: 0.65,    // Methane generation from anaerobic breakdown in landfills (DEFRA / EPA)
    recycling: {
      supported: true, // Anaerobic digestion (AD) / industrial biomethanation
      processEmissions: 0.06,
      avoidedCredit: -0.22, // Displaces fossil natural gas via biomethane
      netImpact: -0.16,
      notes: "Anaerobic digestion captures biogas for renewable electricity and produces organic digestate."
    },
    composting: {
      supported: true,
      processEmissions: 0.08, // Aerobic decomposition produces mainly biogenic CO2
      avoidedCredit: -0.18,  // Avoided landfill methane + displaced synthetic chemical fertilizer
      netImpact: -0.10,
      notes: "Home or municipal composting builds healthy soil humus and sequesters organic carbon."
    },
    reuse: {
      supported: false,
      avoidedRatio: null,
      notes: "Food waste itself cannot be directly reused; prioritize food waste prevention."
    },
    defaultWeightG: 120,
    weightAssumptionReason: "Typical meal food scrap portion (e.g. apple core, citrus peels, crusts).",
    uncertainty: "High (±30% depending on food type; animal products have much higher upstream emissions than produce)",
    explanation: "When food waste decomposes in an oxygen-deprived landfill, anaerobic bacteria generate methane ($CH_4$), a greenhouse gas 28 times more potent than carbon dioxide over a 100-year horizon. Composting or anaerobic digestion keeps decomposition aerobic or captures the biogas, dramatically lowering net emissions."
  },

  organic_yard: {
    id: "organic_yard",
    category: "organic",
    name: "Yard & Garden Trimmings",
    shortName: "Yard Waste",
    description: "Fallen leaves, grass clippings, small branches, weeds, plant cuttings.",
    cradleToGate: 0.30,
    landfill: 0.45,
    recycling: { supported: false, netImpact: null, notes: "Managed via composting or mulching." },
    composting: {
      supported: true,
      processEmissions: 0.05,
      avoidedCredit: -0.15,
      netImpact: -0.10,
      notes: "Provides vital carbon and structure for compost aerators."
    },
    reuse: {
      supported: true,
      avoidedRatio: 0.85,
      notes: "Use directly as ground mulch to retain soil moisture and prevent weed growth."
    },
    defaultWeightG: 250,
    weightAssumptionReason: "Average bundle of garden trimmings or pruning waste.",
    uncertainty: "Medium (±20%)",
    explanation: "Yard trimmings are biogenic and rich in carbon and nitrogen. Composting returns vital nutrients to topsoil and prevents methane generation in municipal landfills."
  },

  // ── ELECTRONICS & HAZARDOUS ────────────────────────────────────────────────
  electronic_device: {
    id: "electronic_device",
    category: "metal", // EcoFreak AI classifies e-waste under metal or hazardous
    name: "Small Consumer Electronics (E-Waste)",
    shortName: "E-Waste / Electronics",
    description: "Old smartphones, chargers, cables, circuit boards, portable electronics.",
    cradleToGate: 24.50, // Semiconductor fabrication, gold/copper/lithium mining (Ericsson / Apple LCA)
    landfill: 0.06,      // Plus critical toxic heavy metal leaching hazard
    recycling: {
      supported: true,
      processEmissions: 2.80,  // Dismantling, shredding, pyrometallurgy
      avoidedCredit: -14.20,  // Recovering gold, silver, palladium, copper avoids primary mining
      netImpact: -11.40,
      notes: "Recovering precious metals from e-waste emits a fraction of primary open-pit mining."
    },
    composting: { supported: false, netImpact: null, notes: "Non-biodegradable; contains toxic elements." },
    reuse: {
      supported: true,
      avoidedRatio: 0.92,
      notes: "Repairing, refurbishing, or donating working gadgets prevents manufacturing an entire new device."
    },
    defaultWeightG: 180,
    weightAssumptionReason: "Average smartphone or handheld electronic gadget.",
    uncertainty: "Medium (±20% depending on battery size and silicon content)",
    explanation: "Microchip fabrication requires ultra-pure chemicals, cleanrooms, and precious rare-earth minerals, giving electronics enormous embodied carbon per gram. Extending product lifespan and recycling through certified electronic recyclers prevents mining devastation."
  },

  hazardous_battery: {
    id: "hazardous_battery",
    category: "hazardous",
    name: "Household Batteries (Alkaline / Li-ion)",
    shortName: "Household Battery",
    description: "AA/AAA batteries, rechargeable lithium cells, button cell batteries.",
    cradleToGate: 12.00, // Mining lithium, cobalt, nickel, manganese, refining
    landfill: 0.15,      // Extreme fire risk and chemical toxicity
    recycling: {
      supported: true,
      processEmissions: 2.10,
      avoidedCredit: -5.80,
      netImpact: -3.70,
      notes: "Hydrometallurgical recycling recovers high-purity battery-grade cobalt and lithium."
    },
    composting: { supported: false, netImpact: null, notes: "Toxic hazardous material." },
    reuse: {
      supported: true,
      avoidedRatio: 0.95,
      notes: "Using rechargeable cells over single-use alkalines avoids hundreds of batteries."
    },
    defaultWeightG: 23,
    weightAssumptionReason: "Single standard AA alkaline battery.",
    uncertainty: "Medium (±20%)",
    explanation: "Batteries pack concentrated metals and corrosive electrolytes. Landfilling creates dangerous landfill fire hazards and groundwater poisoning. Certified battery recyclers safely extract manganese, steel, zinc, and lithium for reuse."
  },

  hazardous_chemical: {
    id: "hazardous_chemical",
    category: "hazardous",
    name: "Chemicals, Paint & Hazardous Cleaners",
    shortName: "Hazardous Chemicals",
    description: "Solvent paints, chemical cleaners, pesticides, motor oil, medical waste.",
    cradleToGate: 8.50,
    landfill: 0.80, // Environmental hazard; illegal to landfill untreated in most jurisdictions
    recycling: {
      supported: true,
      processEmissions: 1.80,
      avoidedCredit: -3.50,
      netImpact: -1.70,
      notes: "Hazardous waste facilities neutralize toxins and re-refine used motor oils."
    },
    composting: { supported: false, netImpact: null, notes: "Toxic; kills compost micro-organisms." },
    reuse: {
      supported: true,
      avoidedRatio: 0.85,
      notes: "Donate surplus paint and usable cleaners to community reuse projects."
    },
    defaultWeightG: 250,
    weightAssumptionReason: "Partially remaining household chemical or paint container.",
    uncertainty: "High (±35% depending on specific chemical compound)",
    explanation: "Petrochemical solvent synthesis emits significant carbon. Proper treatment at specialized facilities neutralizes environmental ecotoxicity."
  },

  // ── TEXTILES ───────────────────────────────────────────────────────────────
  textile_apparel: {
    id: "textile_apparel",
    category: "organic", // or dry recyclable
    name: "Textiles & Clothing (Cotton / Synthetic Blend)",
    shortName: "Clothing / Textile",
    description: "T-shirts, trousers, fabrics, towels, cotton and polyester garments.",
    cradleToGate: 14.50, // Agriculture/petrochemicals + spinning + weaving + dyeing (WRAP / Ellen MacArthur)
    landfill: 1.40,      // Landfill degradation of natural fibers and persistence of synthetics
    recycling: {
      supported: true,
      processEmissions: 1.80,
      avoidedCredit: -8.50,
      netImpact: -6.70,
      notes: "Mechanical fiber shredding and chemical polyester depolymerization."
    },
    composting: {
      supported: false,
      netImpact: null,
      notes: "Only 100% natural unbleached fibers are compostable; synthetic threads will persist."
    },
    reuse: {
      supported: true,
      avoidedRatio: 0.95,
      notes: "Thrifting, garment donation, or hand-me-downs prevents new fast-fashion manufacturing."
    },
    defaultWeightG: 190,
    weightAssumptionReason: "Average adult cotton/poly short-sleeve T-shirt.",
    uncertainty: "Medium (±20%)",
    explanation: "Textile manufacturing is one of the highest emitting consumer sectors due to agricultural irrigation, petroleum fiber synthesis, and chemical dyeing. Keeping garments in use through donation and repair offers the single greatest emission reduction."
  }
};

/**
 * Mapping dictionary from common detected item names or keywords to material IDs
 */
export const ITEM_NAME_MAPPINGS = [
  // Plastics
  { keywords: ["pet bottle", "water bottle", "soda bottle", "beverage bottle", "coke bottle"], materialId: "plastic_pet", defaultWeightG: 22 },
  { keywords: ["milk jug", "shampoo", "detergent", "laundry bottle", "lotion"], materialId: "plastic_hdpe", defaultWeightG: 50 },
  { keywords: ["plastic bag", "grocery bag", "carrier bag", "polythene", "bubble wrap", "film"], materialId: "plastic_ldpe", defaultWeightG: 8 },
  { keywords: ["yogurt", "tupperware", "takeaway container", "food container", "straw", "bottle cap"], materialId: "plastic_pp", defaultWeightG: 25 },
  { keywords: ["plastic", "cup", "wrapper", "packaging"], materialId: "plastic_general", defaultWeightG: 20 },

  // Metals
  { keywords: ["aluminium can", "aluminum can", "soda can", "beer can", "coke can", "tin foil", "aluminum foil"], materialId: "metal_aluminum", defaultWeightG: 14.5 },
  { keywords: ["tin can", "food can", "soup tin", "steel can", "canned food"], materialId: "metal_steel", defaultWeightG: 50 },
  { keywords: ["wire", "appliance", "metal"], materialId: "metal_steel", defaultWeightG: 60 },

  // Glass
  { keywords: ["glass bottle", "beer bottle", "wine bottle", "glass jar", "jam jar", "mason jar", "glass"], materialId: "glass_container", defaultWeightG: 230 },

  // Paper & Cardboard
  { keywords: ["cardboard box", "shipping box", "amazon box", "carton box", "cardboard"], materialId: "paper_cardboard", defaultWeightG: 160 },
  { keywords: ["newspaper", "magazine", "periodical", "gazette"], materialId: "paper_newspaper", defaultWeightG: 110 },
  { keywords: ["office paper", "printer paper", "document", "sheet", "a4", "notebook"], materialId: "paper_office", defaultWeightG: 15 },
  { keywords: ["paper cup", "coffee cup", "paper bag", "napkin", "tissue", "paper"], materialId: "paper_general", defaultWeightG: 25 },

  // Organics
  { keywords: ["banana peel", "fruit peel", "apple core", "orange peel", "food scrap", "leftover", "vegetable", "bread", "coffee ground"], materialId: "organic_food", defaultWeightG: 120 },
  { keywords: ["leaf", "grass", "branch", "flower", "yard waste", "garden", "plant"], materialId: "organic_yard", defaultWeightG: 200 },
  { keywords: ["organic", "food", "compost"], materialId: "organic_food", defaultWeightG: 120 },

  // Electronics & Hazardous
  { keywords: ["phone", "smartphone", "laptop", "tablet", "charger", "cable", "circuit", "remote", "electronic"], materialId: "electronic_device", defaultWeightG: 180 },
  { keywords: ["battery", "batteries", "aa battery", "aaa battery", "cell"], materialId: "hazardous_battery", defaultWeightG: 23 },
  { keywords: ["paint", "chemical", "solvent", "spray can", "pesticide", "hazardous", "medicine"], materialId: "hazardous_chemical", defaultWeightG: 250 },

  // Textiles
  { keywords: ["shirt", "t-shirt", "clothes", "clothing", "fabric", "textile", "jeans", "towel", "cloth"], materialId: "textile_apparel", defaultWeightG: 190 },
];

/**
 * Fallback mapping by high-level wasteType category when item name is unrecognized
 */
export const CATEGORY_DEFAULT_MATERIALS = {
  plastic: "plastic_general",
  paper: "paper_general",
  glass: "glass_container",
  metal: "metal_aluminum",
  organic: "organic_food",
  hazardous: "hazardous_chemical"
};

/**
 * Educational equivalencies conversion factors
 * Based on US EPA Greenhouse Gas Equivalencies Calculator (2024 update)
 */
export const EQUIVALENCIES = {
  // 1 kg CO2e equates to:
  smartphonesChargedPerKg: 120, // ~0.0083 kg CO2e per full smartphone battery cycle
  kmDrivenPerKg: 4.1,          // ~0.244 kg CO2e / km for average gasoline passenger vehicle
  ledBulbHoursPerKg: 220,      // ~0.0045 kg CO2e per hour of 10W LED on typical regional grid
  treeAbsorptionDaysPerKg: 17  // Mature tree absorbs ~21.8 kg CO2/year (~0.059 kg/day)
};
