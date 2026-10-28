/**
 * EcoFreak AI - Hazard Assessment & Disposal Do's and Don'ts Database
 * 
 * Safety Guidelines and Handling Precautions derived from:
 * 1. US OSHA (Occupational Safety and Health Administration) Hazard Communication Standards (29 CFR 1910.1200)
 * 2. US Environmental Protection Agency (EPA) Household Hazardous Waste (HHW) Regulations (RCRA Subtitle C/D)
 * 3. World Health Organization (WHO) Safe Management of Wastes from Healthcare & Domestic Activities
 * 4. National Fire Protection Association (NFPA) 704 Standard System for Hazard Identification
 */

export const SAFETY_DISCLAIMER = 
  "SAFETY DISCLAIMER: Visual image classification cannot detect invisible chemical residues, internal electrical faults, pressurized gas, toxic vapours, bio-pathogens, or microscopic contaminants. Never assume an item is safe to handle based solely on a photograph. When handling unknown or broken materials, always wear appropriate PPE (cut-resistant gloves, eye protection) and avoid direct skin contact or inhalation.";

export const CONFIDENCE_THRESHOLDS = {
  HIGH: 85,      // Reliable classification
  MODERATE: 70,  // Acceptable, but should verify
  LOW: 70        // < 70%: Trigger explicit uncertainty warning banner
};

/**
 * Structured Hazard & Handling Profiles per Waste Category
 */
export const HAZARD_PROFILES = {
  hazardous: {
    category: "hazardous",
    label: "Hazardous Waste",
    hazardLevel: "Critical",
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/40",
    hazardTags: ["Chemical Toxicity", "Fire Hazard", "Corrosive", "Toxic Vapours", "Environmental Contamination"],
    summary: "Contains toxic, corrosive, ignitable, or reactive substances. Direct contact can cause severe chemical burns, respiratory irritation, or trigger explosive reactions.",
    specificItemGuidance: {
      battery: {
        title: "Battery & Lithium-Ion Safety",
        risk: "Severe thermal runaway fire hazard and caustic chemical leakage.",
        warning: "Lithium-ion batteries can spontaneously ignite if punctured, crushed, or short-circuited. Alkaline batteries can leak potassium hydroxide (caustic electrolyte).",
        precautions: [
          "Tape both terminal ends with non-conductive electrical tape or place each battery in an individual plastic bag.",
          "Never throw batteries in standard household trash or regular single-stream recycling bins (common cause of collection truck fires).",
          "Store swollen, damaged, or leaking batteries outside in a metal container lined with sand or cat litter."
        ]
      },
      chemical: {
        title: "Chemicals, Solvents & Pesticides",
        risk: "Inhalation toxicity, groundwater contamination, chemical burns.",
        warning: "Never mix leftover chemicals. Mixing bleach and ammonia produces deadly chloramine gas.",
        precautions: [
          "Keep substances in their original labeled containers whenever possible.",
          "Wear protective nitrile/neoprene gloves and work only in well-ventilated areas.",
          "Never pour down domestic sinks, toilets, or street storm drains."
        ]
      },
      medical: {
        title: "Medical & Sharps Waste",
        risk: "Bloodborne pathogens and accidental needle-stick injuries.",
        warning: "Needles and lancets must never be placed loose in trash bags.",
        precautions: [
          "Place all sharps immediately in an FDA-cleared sharps container or heavy-duty puncture-resistant plastic bottle with a screw top.",
          "Label container clearly: 'BIOHAZARD - DO NOT RECYCLE'."
        ]
      }
    },
    precautions: [
      "Wear chemical-resistant gloves, long sleeves, and eye protection when handling.",
      "Never mix unknown chemicals, solvents, or liquids together.",
      "Keep tightly sealed and away from direct sunlight, sparks, flames, and children.",
      "Transport in the trunk of your vehicle in an upright, spill-proof container to a certified municipal Household Hazardous Waste (HHW) drop-off facility."
    ],
    dos: [
      "Keep in original container with manufacturer warning labels intact.",
      "Tape battery terminals with electrical tape before taking to collection points.",
      "Store leaking containers inside a larger, chemical-resistant secondary tub.",
      "Check with your municipal authority for dedicated hazardous collection drop-off days."
    ],
    donts: [
      "DO NOT pour down drains, toilets, sinks, or storm sewers.",
      "DO NOT discard in household garbage or curbside recycling bins.",
      "DO NOT burn or incinerate hazardous waste or empty chemical containers.",
      "DO NOT reuse empty chemical or solvent jugs for food, water, or animal feed."
    ],
    regulatorySource: "US EPA RCRA Hazardous Waste Regulations (40 CFR Parts 260–279) & OSHA 1910.1200"
  },

  metal: {
    category: "metal",
    label: "Metal & Electronic Waste",
    hazardLevel: "Moderate",
    badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    hazardTags: ["Laceration Hazard", "Heavy Metals", "Electrical Shock", "Sharp Edges"],
    summary: "Opened tin cans and scrap metals present sharp, jagged laceration risks. Discarded electronics contain hazardous heavy metals (lead, mercury, cadmium) and internal batteries.",
    specificItemGuidance: {
      ewaste: {
        title: "E-Waste & Circuit Board Handling",
        risk: "Contains lead solder, mercury backlights, and embedded rechargeable batteries.",
        warning: "Do not dismantle CRTs or smash circuit boards, which aerosolizes toxic metal dust.",
        precautions: [
          "Keep electronic devices intact; do not crush or incinerate.",
          "Remove any detachable batteries before recycling the chassis.",
          "Drop off at certified e-stewards or municipal electronic collection depots."
        ]
      },
      cans: {
        title: "Cans & Sharp Metal Containers",
        risk: "Deep lacerations and infection from jagged lid edges.",
        warning: "Food tin lids can slice fingers easily during sorting.",
        precautions: [
          "Push cut lids into the can body or flatten the rim carefully.",
          "Rinse out food residue to prevent pathogen and bacteria growth."
        ]
      }
    },
    precautions: [
      "Handle opened tins by the smooth sides; never insert fingers inside.",
      "Wear puncture-resistant work gloves when moving scrap metal or tangled wires.",
      "Check discarded electronics for swollen batteries before storage.",
      "Keep e-waste dry to avoid chemical leaching from circuit boards."
    ],
    dos: [
      "Rinse food cans cleanly before placing in the recycling bin.",
      "Push detached tin can lids inside the can body to prevent lacerations for waste collectors.",
      "Wipe personal data off smartphones, hard drives, and tablets before recycling.",
      "Separate aluminum beverage cans from heavier iron/steel scrap where required."
    ],
    donts: [
      "DO NOT throw electronics or power tools into general curbside trash.",
      "DO NOT crush or attempt to pry open sealed electronic batteries.",
      "DO NOT recycle pressurized aerosol cans unless they are completely empty.",
      "DO NOT leave metal scrap exposed to rain where it can rust and leach into soil."
    ],
    regulatorySource: "Basel Convention on the Control of Transboundary Movements of Hazardous Wastes & OSHA 1910.132"
  },

  glass: {
    category: "glass",
    label: "Glass Waste",
    hazardLevel: "Moderate",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    hazardTags: ["Laceration & Puncture", "Eye Injury", "Bio-hazard from Broken Shards"],
    summary: "Glass retains razor-sharp edges when broken or chipped, posing serious puncture and laceration dangers to handlers, sorting facility staff, and sanitation workers.",
    specificItemGuidance: {
      brokenGlass: {
        title: "Broken Glass Protocol",
        risk: "Deep puncture wounds and severing of skin/tendons.",
        warning: "Never dispose of loose broken glass in a regular thin plastic trash bag.",
        precautions: [
          "Wrap broken shards in multiple layers of heavy newspaper, cardboard, or place inside an empty puncture-proof container (e.g. rigid carton or plastic tub).",
          "Clearly label the exterior: 'DANGER: BROKEN GLASS'.",
          "Never use bare hands to pick up shards; use a brush, dustpan, or damp paper towel for micro-splinters."
        ]
      },
      nonRecyclableGlass: {
        title: "Non-Container Glass (Pyrex, Mirrors, Window Panes)",
        risk: "Different melting temperatures ruin recycling furnaces.",
        warning: "Cookware (Pyrex), light bulbs, ceramics, and mirror glass have different chemical formulations and cannot be melted with standard container glass.",
        precautions: [
          "Wrap securely and place in general refuse, not in container glass recycling banks."
        ]
      }
    },
    precautions: [
      "Always inspect bottles and jars for hairline cracks or chipped rims before handling.",
      "Never compress or stomp down trash bags containing glass.",
      "Wear leather or Kevlar-reinforced gloves when clearing broken glassware.",
      "Keep glass containers separate by color (flint/clear, green, amber/brown) if your city requires it."
    ],
    dos: [
      "Rinse glass containers with water to remove food residues.",
      "Remove metal or plastic screw caps and corks (recycle caps separately with metals/plastics).",
      "Safely wrap any broken glassware in sturdy cardboard before disposal.",
      "Place glass gently into bins to avoid shattering."
    ],
    donts: [
      "DO NOT toss loose broken glass directly into curbside recycling carts.",
      "DO NOT mix ceramics, porcelain, drinking glasses, Pyrex, or window glass into bottle recycling.",
      "DO NOT break glass deliberately to save bin space (shards ruin sorting machines).",
      "DO NOT leave broken glass on sidewalks or parks where pets or pedestrians can step on it."
    ],
    regulatorySource: "Health and Safety Executive (HSE) Waste Management & Recycling Guidance (UK) / OSHA 1910.138"
  },

  plastic: {
    category: "plastic",
    label: "Plastic Waste",
    hazardLevel: "Low",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    hazardTags: ["Microplastic Pollution", "Chemical Leaching", "Toxics from Burning"],
    summary: "Standard consumer plastics present minimal acute physical hazard, but improper handling (such as open-air burning) releases highly toxic dioxins and furans. Chemical bottles may retain hazardous residues.",
    specificItemGuidance: {
      chemicalContainers: {
        title: "Plastic Chemical & Motor Oil Containers",
        risk: "Hydrocarbon residue absorption in porous plastic.",
        warning: "Motor oil bottles and pesticide containers cannot be recycled with normal beverage bottles, even if marked with a #2 resin code.",
        precautions: [
          "Treat motor oil and pesticide jugs as hazardous waste.",
          "Do not rinse motor oil down household sinks."
        ]
      }
    },
    precautions: [
      "Check the resin identification code (triangle #1 to #7) on the base.",
      "Ensure containers with cleaning fluids are completely emptied and triple-rinsed.",
      "Never burn plastics in open campfires, fireplaces, or backyard barrels."
    ],
    dos: [
      "Empty liquids and give a quick rinse to prevent mold and foul odors.",
      "Replace plastic caps tightly onto empty bottles (many modern facilities capture caps with the bottle).",
      "Squash or flatten plastic bottles to maximize collection truck space.",
      "Take clean plastic grocery bags to specialized in-store grocery drop-off bins."
    ],
    donts: [
      "DO NOT burn plastics — releases carcinogenic dioxins, furans, and black carbon.",
      "DO NOT put soft film, bubble wrap, or plastic bags in standard curbside single-stream bins (they jam sorting gears).",
      "DO NOT recycle plastics contaminated with motor oil, paint, or toxic pesticides in blue bins.",
      "DO NOT place unwashed takeaway food containers into recycling with rotting leftovers."
    ],
    regulatorySource: "Association of Plastic Recyclers (APR) Design Guide & US EPA Plastics Waste Guidelines"
  },

  paper: {
    category: "paper",
    label: "Paper & Cardboard",
    hazardLevel: "Low",
    badgeColor: "bg-lime-500/20 text-lime-300 border-lime-500/40",
    hazardTags: ["Combustible Material", "Mold & Fungal Spores", "Grease Contamination"],
    summary: "Paper and dry cardboard are generally safe to handle but are readily combustible. Damp or decomposing paper can harbour mold and fungal spores, causing allergic respiratory reactions.",
    specificItemGuidance: {
      greasyPaper: {
        title: "Food-Soiled Paper & Pizza Boxes",
        risk: "Oil saturates cellulose fibers, preventing paper re-pulping.",
        warning: "Grease cannot be separated from paper during the water-based recycling process, ruining entire batches of recycled pulp.",
        precautions: [
          "Tear off clean cardboard box lids for paper recycling.",
          "Toss greasy bottom sections into organic compost or general waste."
        ]
      },
      shreddedPaper: {
        title: "Shredded Paper Handling",
        risk: "Small cut fibers blow away and jam sorting machinery.",
        warning: "Loose shreds blow away in sorting facilities.",
        precautions: [
          "Place shredded paper inside a paper bag or compost bin, or check local municipal rules."
        ]
      }
    },
    precautions: [
      "Keep paper dry; wet paper fibers degrade rapidly and are rejected by recycling mills.",
      "Wear a dust mask when handling large volumes of old, musty, or moldy paper archives.",
      "Remove heavy plastic packing tape, styrofoam inserts, and bubble wrap before recycling boxes."
    ],
    dos: [
      "Flatten and break down corrugated cardboard boxes to conserve bin volume.",
      "Remove plastic sleeves, excessive adhesive tape, and bubble packaging.",
      "Keep paper dry and free from food grease, coffee stains, and sauce spills.",
      "Compost shredded non-glossy unbleached paper alongside kitchen scraps."
    ],
    donts: [
      "DO NOT recycle greasy pizza boxes, wax-coated paper cups, or fast-food wrappers with paper.",
      "DO NOT put thermal cash register receipts in recycling (many contain BPA / BPS chemicals).",
      "DO NOT include laminated paper, metallic gift wrapping, or glitter cards in paper bins.",
      "DO NOT tie paper bundles with nylon or plastic twine (use cotton string or paper bags)."
    ],
    regulatorySource: "American Forest & Paper Association (AF&PA) Recycling Guidelines & EPA Waste Reduction Model"
  },

  organic: {
    category: "organic",
    label: "Organic & Kitchen Waste",
    hazardLevel: "Low",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    hazardTags: ["Biological Decomposition", "Bacterial & Fungal Pathogens", "Odor & Pest Vector"],
    summary: "Decaying food and organic waste support rapid bacterial growth (Salmonella, E. coli) and mold spores. Unmanaged wet waste attracts disease vectors (flies, rodents, cockroaches).",
    specificItemGuidance: {
      animalProducts: {
        title: "Meat, Dairy & Cooked Oils",
        risk: "Pathogen breeding ground, maggots, and rodent attraction.",
        warning: "Meat, bones, and dairy do not break down cleanly in small backyard compost bins and generate noxious putrefaction odors.",
        precautions: [
          "Only compost meat and dairy in municipal green bins equipped with high-heat commercial composting or anaerobic digestion.",
          "For home composting, stick to fruit, vegetable peelings, coffee grounds, and yard trimmings."
        ]
      }
    },
    precautions: [
      "Wash hands thoroughly after handling decaying organic waste.",
      "Keep compost bins covered with secure lids to deter vermin and insects.",
      "Avoid inhaling mold dust from rotten bread or decaying fruit.",
      "Empty indoor kitchen scrap caddies every 1–2 days to prevent fruit flies."
    ],
    dos: [
      "Separate food scraps from packaging before placing in the green bin.",
      "Use certified biodegradable/compostable caddy liners (or unprinted paper bags).",
      "Balance 'green' nitrogen waste (food scraps) with 'brown' carbon matter (dry leaves, shredded cardboard).",
      "Rinse reusable compost caddies regularly with water and vinegar."
    ],
    donts: [
      "DO NOT toss plastic produce stickers, twist ties, or rubber bands into compost bins.",
      "DO NOT put animal feces or pet litter into vegetable garden compost (parasite risk).",
      "DO NOT dump cooking grease, lard, or frying oil into domestic drains.",
      "DO NOT wrap organic waste in conventional non-biodegradable plastic bags."
    ],
    regulatorySource: "Food and Agriculture Organization (FAO) Food Waste Reduction & US EPA Composting at Home Standards"
  }
};

/**
 * Resolves hazard details from waste category and item name
 * 
 * @param {string} category - wasteType: organic, plastic, glass, metal, hazardous, paper
 * @param {string} [itemName] - detected name of the object
 * @returns {Object} Hazard guidance and Do's & Don'ts
 */
export function getHazardAndDisposalGuidance(category, itemName = "") {
  const cleanCat = (category || "").toLowerCase().trim();
  const cleanName = (itemName || "").toLowerCase().trim();

  // Pick primary category profile or fallback to hazardous for safety
  const profile = HAZARD_PROFILES[cleanCat] || HAZARD_PROFILES.hazardous;

  // Determine specific item sub-guidance if keywords match
  let matchedSpecificGuidance = null;

  if (cleanName.includes("battery") || cleanName.includes("cell")) {
    matchedSpecificGuidance = HAZARD_PROFILES.hazardous.specificItemGuidance.battery;
  } else if (cleanName.includes("chemical") || cleanName.includes("paint") || cleanName.includes("solvent") || cleanName.includes("cleaner") || cleanName.includes("spray")) {
    matchedSpecificGuidance = HAZARD_PROFILES.hazardous.specificItemGuidance.chemical;
  } else if (cleanName.includes("needle") || cleanName.includes("syringe") || cleanName.includes("medical") || cleanName.includes("sharps")) {
    matchedSpecificGuidance = HAZARD_PROFILES.hazardous.specificItemGuidance.medical;
  } else if (cleanName.includes("phone") || cleanName.includes("circuit") || cleanName.includes("electronic") || cleanName.includes("laptop") || cleanName.includes("gadget")) {
    matchedSpecificGuidance = HAZARD_PROFILES.metal.specificItemGuidance.ewaste;
  } else if (cleanName.includes("can") || cleanName.includes("tin")) {
    matchedSpecificGuidance = HAZARD_PROFILES.metal.specificItemGuidance.cans;
  } else if (cleanName.includes("broken") || cleanName.includes("shard")) {
    matchedSpecificGuidance = HAZARD_PROFILES.glass.specificItemGuidance.brokenGlass;
  } else if (cleanName.includes("pizza") || cleanName.includes("grease") || cleanName.includes("sauce")) {
    matchedSpecificGuidance = HAZARD_PROFILES.paper.specificItemGuidance.greasyPaper;
  } else if (cleanName.includes("meat") || cleanName.includes("bone") || cleanName.includes("dairy")) {
    matchedSpecificGuidance = HAZARD_PROFILES.organic.specificItemGuidance.animalProducts;
  }

  return {
    category: profile.category,
    label: profile.label,
    hazardLevel: profile.hazardLevel,
    badgeColor: profile.badgeColor,
    hazardTags: profile.hazardTags,
    summary: profile.summary,
    precautions: profile.precautions,
    dos: profile.dos,
    donts: profile.donts,
    matchedSpecificGuidance,
    regulatorySource: profile.regulatorySource,
    safetyDisclaimer: SAFETY_DISCLAIMER
  };
}
