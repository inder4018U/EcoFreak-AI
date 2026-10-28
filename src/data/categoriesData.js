export const CATEGORIES_DATA = {
  organic: {
    id: "organic",
    name: "Organic",
    label: "Organic Waste",
    emoji: "🍌",
    color: "#2F4F35",
    accentBg: "bg-[#EAF3EB]",
    stampClass: "stamp-green",
    subtitle: "Food waste, garden waste, yard clippings",
    actionTip: "Compost or municipal green bin collection",
    disposalSteps: [
      "Separate food scraps from packaging, plastic wraps, and produce stickers.",
      "Collect in a breathable kitchen caddy or line with certified compostable paper liner.",
      "Transfer to your home composting bin or municipal organic collection bin.",
      "Never place plastics, treated timber, dog/cat waste, or glass into organic bins."
    ],
    carbonContext: "Composting organic waste intercepts methane (CH₄) generation in landfills, lowering emissions by up to 50% while enriching agricultural soil.",
    acceptedItems: ["Fruit and vegetable peels", "Coffee grounds and paper filters", "Eggshells and nutshells", "Garden leaves and grass trimmings", "Cooked and raw food leftovers"],
    prohibitedItems: ["Plastic produce bags and stickers", "Glossy or wax-coated cartons", "Pet feces or kitty litter", "Treated building timber"],
    mapsQuery: "organic compost facility near me"
  },
  plastic: {
    id: "plastic",
    name: "Plastic",
    label: "Plastic Waste",
    emoji: "🧴",
    color: "#4A7C75",
    accentBg: "bg-[#EFF6F5]",
    stampClass: "stamp-olive",
    subtitle: "Bottles, containers, rigid packaging",
    actionTip: "Rinse clean, flatten, and place in dry recyclables",
    disposalSteps: [
      "Empty any remaining liquids or food residues thoroughly.",
      "Rinse lightly — clean containers prevent foul odors and facility contamination.",
      "Crush or flatten bottles to save volume in curbside collection trucks.",
      "Check resin identification code (PET #1, HDPE #2, PP #5 are widely accepted)."
    ],
    carbonContext: "Recycling plastic saves 70% of virgin oil refining energy and prevents long-lasting microplastic fragmentation in marine ecosystems.",
    acceptedItems: ["PET beverage bottles and jars", "Milk jugs and shampoo bottles (HDPE)", "Yogurt tubs and food containers (PP)", "Clean rigid clamshell packaging"],
    prohibitedItems: ["Thin single-use carrier films (unless drop-off store)", "Styrofoam / Expanded polystyrene", "Heavily soiled takeaway containers", "Flexible multi-layer chip bags"],
    mapsQuery: "plastic recycling drop off near me"
  },
  paper: {
    id: "paper",
    name: "Paper",
    label: "Paper & Cardboard",
    emoji: "📦",
    color: "#6D7F4F",
    accentBg: "bg-[#F3F6EC]",
    stampClass: "stamp-olive",
    subtitle: "Cardboard, shipping boxes, newspapers, paper",
    actionTip: "Flatten boxes, keep dry, bundle for collection",
    disposalSteps: [
      "Keep all paper materials completely dry — wet cellulose cannot be recycled.",
      "Break down and flatten cardboard boxes to maximize bin capacity.",
      "Remove plastic packaging inserts, excessive shipping tape, and bubble wrap.",
      "Separate contaminated sections (e.g. greasy pizza box lids can be recycled, greasy bottoms composted)."
    ],
    carbonContext: "Recycling 1 ton of corrugated cardboard saves 17 mature trees, 7,000 gallons of industrial fresh water, and 4,000 kWh of electricity.",
    acceptedItems: ["Corrugated cardboard boxes", "Newspapers, magazines, and office paper", "Paperback books and catalogs", "Clean cereal boxes and paper cartons"],
    prohibitedItems: ["Wax-coated paper cups and frozen food trays", "Greasy pizza box bases with cheese", "Thermal cash register receipts", "Used tissues and paper napkins"],
    mapsQuery: "paper cardboard recycling near me"
  },
  glass: {
    id: "glass",
    name: "Glass",
    label: "Glass Containers",
    emoji: "🍾",
    color: "#2F5D62",
    accentBg: "bg-[#EEF5F6]",
    stampClass: "stamp-green",
    subtitle: "Bottles, food jars, beverage containers",
    actionTip: "Empty and drop at glass recycling banks",
    disposalSteps: [
      "Empty all contents and give a quick rinse.",
      "Remove metal caps and corks (metal caps can be recycled separately).",
      "Do not break containers intentionally — whole bottles are easier for optical MRF sorters.",
      "Sort by color (clear/flint, green, amber/brown) if your local drop-off bank requires it."
    ],
    carbonContext: "Glass is 100% infinitely recyclable without downcycling or degradation; remelting cullet uses 30% less energy than raw silica sand melting.",
    acceptedItems: ["Clear and colored beverage bottles", "Glass food jars and condiment bottles", "Cosmetic glass containers", "Medicine bottles (rinsed)"],
    prohibitedItems: ["Drinking glasses and crystal glassware", "Window panes and architectural glass", "Mirrors and ceramic plates / porcelain", "Pyrex and heat-resistant cookware"],
    mapsQuery: "glass recycling bank near me"
  },
  metal: {
    id: "metal",
    name: "Metal",
    label: "Metal & E-Waste",
    emoji: "🥫",
    color: "#B85C38",
    accentBg: "bg-[#FDF3EE]",
    stampClass: "stamp-rust",
    subtitle: "Aluminium cans, tins, circuit boards, appliances",
    actionTip: "Recycle cans curbside; e-waste to certified drop-off",
    disposalSteps: [
      "Rinse aluminum and tin cans clean to deter pests.",
      "Push can lids inside or leave attached so they don't injure sanitation workers.",
      "Do NOT put electronics or cables into household curbside bins.",
      "Take electronics, printed circuit boards, and appliances to certified e-waste recovery centers."
    ],
    carbonContext: "Recycling aluminum requires 95% less energy than smelting virgin bauxite ore, preventing 9 tons of CO₂ emissions for every ton recycled.",
    acceptedItems: ["Aluminum beverage cans", "Tin-plated steel food cans", "Clean aluminum foil and baking trays", "Circuit boards, cables, and small electronics (at e-waste depot)"],
    prohibitedItems: ["Pressurized gas cylinders / propane tanks", "Automobile lead-acid batteries in trash", "Paint cans with wet liquid paint", "Barbed wire and scrap metal cables in curbside bins"],
    mapsQuery: "scrap metal and e-waste recycling near me"
  },
  hazardous: {
    id: "hazardous",
    name: "Hazardous",
    label: "Hazardous Material",
    emoji: "🔋",
    color: "#9C3D28",
    accentBg: "bg-[#FBECE8]",
    stampClass: "stamp-rust",
    subtitle: "Batteries, toxic chemicals, paint, medicine",
    actionTip: "Take to designated hazardous waste facility only",
    disposalSteps: [
      "NEVER throw batteries, chemicals, or flammables into household curbside trash.",
      "Tape battery terminals (especially lithium-ion) with non-conductive clear tape to prevent friction fires.",
      "Keep chemicals in their original labeled containers with tight lids.",
      "Drop off at municipal household hazardous waste (HHW) collection depots or pharmacy take-back bins."
    ],
    carbonContext: "Specialized hazardous recovery stops heavy metals (lead, cadmium, mercury) from contaminating municipal aquifers and causing facility truck fires.",
    acceptedItems: ["Rechargeable and alkaline batteries", "Paint, solvents, and wood stains", "Pesticides, weed killers, and fertilizers", "Fluorescent tubes and mercury bulbs", "Unused prescription medications"],
    prohibitedItems: ["Explosives or ammunition", "Radioactive medical isotopes", "Unidentified leaking chemical drums"],
    mapsQuery: "hazardous waste collection center near me"
  }
};

export const FIELD_FACILITIES = [
  {
    id: "fac-1",
    name: "Green Earth Resource Recovery Center",
    type: "Full-Service Recycling & Transfer Depot",
    distance: "1.2 km away",
    address: "42 Eco Industrial Boulevard, Sector 4",
    hours: "Open · Closes 5:00 PM",
    materials: ["Plastics", "Paper & Cardboard", "Glass", "Metal Scrap", "Electronics"],
    rating: "4.8 ★",
    phone: "(555) 234-8901",
    notes: "Curbside sorting and bulk drop-off accepted. Free mulch collection."
  },
  {
    id: "fac-2",
    name: "City Organic Compost & Yard Facility",
    type: "Municipal Composting & Soil Regeneration",
    distance: "2.8 km away",
    address: "108 Greenway Path, Riverside Park",
    hours: "Open · Closes 6:00 PM",
    materials: ["Food Scraps", "Yard Trimmings", "Clean Untreated Timber", "Leaves"],
    rating: "4.9 ★",
    phone: "(555) 345-6789",
    notes: "Accepts brown yard debris and food scraps. Free finished compost for residents."
  },
  {
    id: "fac-3",
    name: "EcoDrop Electronics & Battery Hub",
    type: "Certified E-Waste & Precious Metal Recovery",
    distance: "3.5 km away",
    address: "75 Tech Foundry Lane, Silicon District",
    hours: "Open · Closes 4:30 PM",
    materials: ["Batteries (Lithium/Alkaline)", "Mobile Phones", "Computers & TVs", "Circuit Boards"],
    rating: "4.7 ★",
    phone: "(555) 456-7890",
    notes: "R2-certified data destruction and toxic heavy metal recovery station."
  },
  {
    id: "fac-4",
    name: "Metropolitan Hazardous Waste Depot",
    type: "Specialized Household Hazardous Waste (HHW)",
    distance: "4.9 km away",
    address: "215 Safety Perimeter Road, Gate 3",
    hours: "Open Wed–Sun · 9:00 AM – 4:00 PM",
    materials: ["Chemicals & Solvents", "Motor Oil", "Paint & Varnish", "Mercury Bulbs", "Batteries"],
    rating: "4.6 ★",
    phone: "(555) 567-8901",
    notes: "Mandatory municipal facility for dangerous liquids, aerosols, and toxic chemicals."
  }
];
