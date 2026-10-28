/**
 * EcoFreak AI - Environmental Impact Simulation Data
 * 
 * Compares responsible circular pathways with improper linear pathways.
 * Sources:
 * - US EPA WARM v16 & Municipal Solid Waste Lifecycles
 * - Ellen MacArthur Foundation Circular Economy Framework
 * - IPCC Fifth/Sixth Assessment Reports (Waste & Biogenic Carbon)
 */

export const SIMULATION_DISCLAIMER = 
  "Educational simulation modeling typical lifecycle pathways based on EPA WARM and circular economy literature. Actual local outcomes vary based on regional recycling technology, sorting accuracy, and municipal facilities.";

export const SIMULATION_SCENARIOS = {
  plastic: {
    category: "plastic",
    title: "Plastic Lifecycle Simulation",
    responsible: {
      pathName: "Mechanical Recycling & Circular Loop",
      icon: "♻️",
      color: "emerald",
      badge: "Circular Economy",
      headline: "Resource Recaptured & Virgin Petroleum Avoided",
      steps: [
        {
          stage: "1. Collection & Sorting",
          icon: "🚛",
          duration: "Days 1–7",
          description: "Container is collected, optical sorters identify polymer code (e.g. PET/HDPE), and contaminants are washed off.",
          metric: "Optical purity: ~95%"
        },
        {
          stage: "2. Shredding & Flaking",
          icon: "⚙️",
          duration: "Days 8–14",
          description: "Clean plastic is shredded into micro-flakes, sanitized, and remelted into uniform food-grade or fiber pellets.",
          metric: "Uses 60–70% less energy than virgin synthesis"
        },
        {
          stage: "3. Circular Remanufacturing",
          icon: "🔄",
          duration: "Days 15–30",
          description: "Pellets are blow-molded into new bottles or spun into recycled polyester textiles, displacing crude oil extraction.",
          metric: "Saves ~1.2 to 1.5 kg CO₂e per kg of resin"
        }
      ],
      impactSummary: "Recycling recirculates polymer molecules back into productive utility. It saves petroleum feedstocks, slashes refining emissions, and stops plastic from escaping into rivers and oceans."
    },
    improper: {
      pathName: "Landfill Burial or Open Littering",
      icon: "🚯",
      color: "rose",
      badge: "Linear Waste Hazard",
      headline: "Persistent Pollution & Microplastic Fragmentation",
      steps: [
        {
          stage: "1. Waste Stream Loss",
          icon: "🗑️",
          duration: "Immediate",
          description: "Discarded into mixed refuse or littered in the environment, bypassing all recovery infrastructure.",
          metric: "100% embodied fossil energy lost"
        },
        {
          stage: "2. Environmental Fragmentation",
          icon: "🌊",
          duration: "Decades to Centuries",
          description: "Sunlight (UV photolysis) and mechanical weathering slowly shatter the plastic into microscopic particles (<5mm).",
          metric: "Forms persistent microplastics"
        },
        {
          stage: "3. Trophic Leaching",
          icon: "⚠️",
          duration: "Centuries",
          description: "Microplastics adsorb toxic polychlorinated compounds, contaminate waterways, and bioaccumulate across marine food webs.",
          metric: "Chemical persistence: 400+ years"
        }
      ],
      impactSummary: "Plastic never truly biodegrades in landfills or natural habitats. Instead, it fragments into ubiquitous microplastics that pollute aquatic ecosystems, harm wildlife, and squander finite fossil resources."
    }
  },

  organic: {
    category: "organic",
    title: "Organic Waste Decomposition Simulation",
    responsible: {
      pathName: "Aerobic Composting or Anaerobic Digestion",
      icon: "🌱",
      color: "emerald",
      badge: "Nutrient Recycling",
      headline: "Soil Enrichment & Landfill Methane Interception",
      steps: [
        {
          stage: "1. Oxygenated Composting",
          icon: "🍂",
          duration: "Weeks 1–4",
          description: "Organic matter is blended with carbon-rich brown mulch. Aerobic bacteria break down complex sugars in the presence of oxygen.",
          metric: "Internal heat reaches 55–65°C (kills weed seeds)"
        },
        {
          stage: "2. Humus Maturation",
          icon: "🪱",
          duration: "Weeks 5–12",
          description: "Fungi and earthworms finish converting matter into dark, stable humus rich in nitrogen, phosphorus, and potassium.",
          metric: "Zero fugitive methane produced"
        },
        {
          stage: "3. Soil Regeneration",
          icon: "🌾",
          duration: "Month 3 onward",
          description: "Finished compost is worked into farm topsoil, sequestering organic carbon, retaining water, and displacing synthetic chemical fertilizers.",
          metric: "Boosts soil moisture capacity by up to 20%"
        }
      ],
      impactSummary: "Aerobic composting preserves the natural biogenic carbon cycle. It produces nutrient-dense soil amendments while actively preventing potent methane gas emissions."
    },
    improper: {
      pathName: "Anaerobic Landfill Putrefaction",
      icon: "☣️",
      color: "rose",
      badge: "Methane Generation",
      headline: "Deep Underground Anaerobic Decay",
      steps: [
        {
          stage: "1. Oxygen Starvation",
          icon: "🧱",
          duration: "Day 1–30",
          description: "Food scraps are compacted beneath tons of municipal trash. Oxygen is quickly depleted by surface microbes.",
          metric: "Strict anaerobic conditions established"
        },
        {
          stage: "2. Methanogenic Breakdown",
          icon: "🔥",
          duration: "Months to Decades",
          description: "Anaerobic methanogen bacteria decompose the organic mass, venting methane (CH₄) gas directly into the atmosphere.",
          metric: "Methane is 28× more potent than CO₂ (GWP100)"
        },
        {
          stage: "3. Toxic Leachate Plume",
          icon: "💧",
          duration: "Ongoing",
          description: "Moisture percolates through the decomposing food, dissolving heavy metals from surrounding garbage into hazardous leachate.",
          metric: "Requires multi-decade leachate pumping"
        }
      ],
      impactSummary: "Buried without oxygen, benign kitchen scraps turn into severe atmospheric polluters, producing fugitive methane that drives near-term climate acceleration."
    }
  },

  metal: {
    category: "metal",
    title: "Metal & Electronics Simulation",
    responsible: {
      pathName: "Closed-Loop Secondary Smelting",
      icon: "⚙️",
      color: "emerald",
      badge: "95% Energy Avoidance",
      headline: "Infinite Remelting Without Quality Loss",
      steps: [
        {
          stage: "1. Electromagnetic Separation",
          icon: "🧲",
          duration: "Days 1–3",
          description: "Eddy-current separators effortlessly launch aluminum cans off sorting belts, while electromagnets capture steel tins.",
          metric: "Sorting efficiency >98%"
        },
        {
          stage: "2. Low-Energy Melting",
          icon: "🔥",
          duration: "Day 4–10",
          description: "Secondary scrap is melted in reverberatory furnaces at 660°C, bypassing the grueling 1,500°C electrolytic bauxite extraction.",
          metric: "Consumes 95% less electricity than virgin bauxite"
        },
        {
          stage: "3. New Ingot Rolling",
          icon: "🥫",
          duration: "Day 11–60",
          description: "Molten aluminum is rolled into sheets and back on supermarket shelves as brand-new cans in as little as 60 days.",
          metric: "Saves ~9 to 10 kg CO₂e per kg aluminum"
        }
      ],
      impactSummary: "Recycling metal represents one of the highest climate dividends on Earth. Secondary aluminum avoids open-pit bauxite strip mining, red-mud toxic runoff, and enormous coal-fired smelter power."
    },
    improper: {
      pathName: "Landfill Entombment & Toxic Leaching",
      icon: "🗑️",
      color: "rose",
      badge: "Resource Squandering",
      headline: "Finite Minerals Buried Forever",
      steps: [
        {
          stage: "1. Waste Entombment",
          icon: "⚰️",
          duration: "Immediate",
          description: "High-value metals and electronics are buried in landfill cells alongside wet garbage.",
          metric: "100% of embodied mineral value wasted"
        },
        {
          stage: "2. Heavy Metal Corrosion",
          icon: "🧪",
          duration: "1–50 Years",
          description: "Corrosive organic acids eat through circuit boards and casings, liberating lead solder, cadmium, and mercury into surrounding soil.",
          metric: "Corrosive chemical leaching"
        },
        {
          stage: "3. Forced Virgin Mining",
          icon: "⛏️",
          duration: "Continuous",
          description: "Because scrap wasn't recovered, mining companies must clear rainforests and excavate hundreds of tons of ore to replace it.",
          metric: "1 ton of e-waste has more gold than 17 tons of ore"
        }
      ],
      impactSummary: "Burying metal forces the global economy to dig new open-pit mines. In the case of electronics, it creates long-term toxic hazards from leached lead and mercury."
    }
  },

  glass: {
    category: "glass",
    title: "Glass Lifecycle Simulation",
    responsible: {
      pathName: "Endless Cullet Remelting",
      icon: "🔵",
      color: "emerald",
      badge: "100% Circular",
      headline: "Lower Furnace Temperatures & Zero Quality Loss",
      steps: [
        {
          stage: "1. Color Sorting & Crushing",
          icon: "🔬",
          duration: "Days 1–5",
          description: "Bottles are laser-sorted by color (flint/green/amber) and crushed into clean 'cullet' shards.",
          metric: "100% recyclable with zero degradation"
        },
        {
          stage: "2. Low-Energy Cullet Furnace",
          icon: "🔥",
          duration: "Days 6–10",
          description: "Cullet melts at significantly lower temperatures than raw silica sand and soda ash, saving furnace gas.",
          metric: "Every 10% cullet cuts energy by 3%"
        },
        {
          stage: "3. Endless Re-blowing",
          icon: "🍾",
          duration: "Days 11–30",
          description: "Molten glass is molded into sterile, food-safe bottles, ready to repeat the cycle indefinitely.",
          metric: "Zero toxic chemical off-gassing"
        }
      ],
      impactSummary: "Glass can be remelted millions of times without losing clarity or strength. Using recycled cullet saves natural silica sand dunes and lowers furnace greenhouse gas emissions."
    },
    improper: {
      pathName: "Landfill Entombment",
      icon: "🏺",
      color: "rose",
      badge: "Indestructible Refuse",
      headline: "1 Million Years of Inert Inaction",
      steps: [
        {
          stage: "1. Landfill Compaction",
          icon: "🚜",
          duration: "Immediate",
          description: "Heavy bulldozers crush bottles beneath garbage, posing puncture hazards to vehicle tires and sanitation workers.",
          metric: "Severe handling hazard"
        },
        {
          stage: "2. Permanent Inert Burial",
          icon: "⏳",
          duration: "1,000,000+ Years",
          description: "Glass does not rot, rust, or burn. It remains completely unchanged in landfill strata indefinitely.",
          metric: "Estimated decomposition: >1,000,000 years"
        },
        {
          stage: "3. Virgin Sand Dune Depletion",
          icon: "🏖️",
          duration: "Continuous",
          description: "New bottles require quarrying fresh silica sand and limestone, depleting riverbeds and fragile coastlines.",
          metric: "Requires 1,500°C fossil gas furnace smelting"
        }
      ],
      impactSummary: "While glass is non-toxic in landfills, discarding it squanders its infinite recyclability, driving unnecessary high-temperature silica mining."
    }
  },

  paper: {
    category: "paper",
    title: "Paper & Cardboard Lifecycle Simulation",
    responsible: {
      pathName: "Repulping & Forest Protection",
      icon: "📄",
      color: "emerald",
      badge: "5–7 Recycles",
      headline: "Cellulose Recovery & Water Conservation",
      steps: [
        {
          stage: "1. Hydropulper Slurry",
          icon: "🌀",
          duration: "Days 1–3",
          description: "Baled paper is soaked in warm water and agitated to separate individual cellulose wood fibers.",
          metric: "Recovers clean cellulose pulp"
        },
        {
          stage: "2. Screening & De-Inking",
          icon: "🧼",
          duration: "Days 4–7",
          description: "Air bubbles float printing inks to the surface while fine mesh screens remove tape and staples.",
          metric: "Saves 7,000 gallons of water per ton of pulp"
        },
        {
          stage: "3. Pressing New Paperboard",
          icon: "📦",
          duration: "Days 8–20",
          description: "Fibers are laid onto drying screens, rolling out new corrugated cardboard and newsprint.",
          metric: "Each ton saves 17 mature timber trees"
        }
      ],
      impactSummary: "Recycling paper reuses timber fibers up to 7 times. It cuts industrial water consumption by 60%, slashes pulping chemicals, and leaves carbon-capturing forests standing."
    },
    improper: {
      pathName: "Landfill Methane Venting",
      icon: "💨",
      color: "rose",
      badge: "Anaerobic Decay",
      headline: "Cellulose Decomposition Under Pressure",
      steps: [
        {
          stage: "1. Moisture Saturation",
          icon: "🌧️",
          duration: "Weeks 1–4",
          description: "Paper is compressed and soaked by moisture inside dark landfill cells.",
          metric: "Structural collapse under pressure"
        },
        {
          stage: "2. Anaerobic Fermentation",
          icon: "☣️",
          duration: "Months to Years",
          description: "Lacking airflow, cellulose ferments anaerobically, venting methane (CH₄) and carbon dioxide.",
          metric: "1 kg cardboard produces ~1 kg CO₂e in landfill"
        },
        {
          stage: "3. Timber Deforestation",
          icon: "🪓",
          duration: "Continuous",
          description: "Packaging manufacturers must log more virgin timber to satisfy shipping box demands.",
          metric: "Depletes global forest carbon sinks"
        }
      ],
      impactSummary: "Paper buried in landfills is a major contributor to municipal methane emissions. Recovering paper keeps cellulose circulating and protects standing timber."
    }
  },

  hazardous: {
    category: "hazardous",
    title: "Hazardous Waste Neutralization Simulation",
    responsible: {
      pathName: "Certified Neutralization & Thermal Treatment",
      icon: "🛡️",
      color: "emerald",
      badge: "Total Detoxification",
      headline: "Controlled High-Temp Destruction & Hydrometallurgy",
      steps: [
        {
          stage: "1. Chemistry Characterization",
          icon: "🔬",
          duration: "Days 1–5",
          description: "Specialists test chemical compatibility, neutralising acids with bases and sorting lithium/mercury cells.",
          metric: "100% prevention of reactive mixing"
        },
        {
          stage: "2. Thermal Oxidation / Hydrometallurgy",
          icon: "⚡",
          duration: "Days 6–15",
          description: "Specialized rotary kilns (>1,100°C) incinerate organics into harmless inert ash with wet scrubbers catching acid gases.",
          metric: "99.99% destruction and removal efficiency"
        },
        {
          stage: "3. Critical Mineral Extraction",
          icon: "🔋",
          duration: "Days 16–30",
          description: "Hydrometallurgical acid leaching extracts battery-grade lithium, cobalt, and nickel for domestic battery manufacturing.",
          metric: "Recovers >95% of active battery cathode metals"
        }
      ],
      impactSummary: "Certified hazardous waste processing dismantles dangerous chemical bonds under strict scrubbers, isolating toxic elements and recovering rare battery minerals safely."
    },
    improper: {
      pathName: "Landfill Fire & Groundwater Poisoning",
      icon: "☠️",
      color: "rose",
      badge: "Catastrophic Hazard",
      headline: "Thermal Runaway & Uncontrolled Leaching",
      steps: [
        {
          stage: "1. Truck / Compactor Puncture",
          icon: "💥",
          duration: "Hours 1–24",
          description: "Compactor blades pierce lithium batteries or solvent cans, sparking intense landfill and collection truck fires.",
          metric: "Major cause of waste facility fires"
        },
        {
          stage: "2. Aquifer Penetration",
          icon: "🚰",
          duration: "Months to Decades",
          description: "Corrosive chemicals erode landfill liner membranes, allowing heavy metals and solvents to seep into drinking groundwater.",
          metric: "Groundwater contamination"
        },
        {
          stage: "3. Ecotoxic Bioaccumulation",
          icon: "💀",
          duration: "Decades",
          description: "Pesticides and heavy metals enter irrigation canals and accumulate in crops, livestock, and local populations.",
          metric: "Permanent ecotoxicity"
        }
      ],
      impactSummary: "Throwing hazardous items into general trash is the primary cause of waste facility fires and irreversible groundwater contamination. Specialized handling is indispensable."
    }
  }
};

/**
 * Returns simulation model for given category with fallback
 * @param {string} category
 * @returns {Object} Simulation scenario
 */
export function getSimulationData(category) {
  const clean = (category || "").toLowerCase().trim();
  return SIMULATION_SCENARIOS[clean] || SIMULATION_SCENARIOS.plastic;
}
