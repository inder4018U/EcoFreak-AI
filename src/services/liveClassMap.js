/**
 * EcoFreak AI - Live Class Mapping for Teachable Machine
 * 
 * Maps the 19 Teachable Machine predicted labels to display titles,
 * waste categories, disposal instructions, bin color, and carbon context.
 */

import { mapLabelToCategory } from "./tfjsModel.js";
import { CATEGORIES_DATA } from "../data/categoriesData.js";

export const LIVE_CLASS_CONFIG = {
  "Plastic": { displayName: "Plastic Bottle / Container", category: "plastic", binColor: "Blue", tip: "Rinse clean, flatten, and place in dry recyclables bin.", co2SavedKg: 0.40 },
  "Glasses": { displayName: "Glassware / Eyeglasses", category: "glass", binColor: "Teal", tip: "Place undamaged glass in bottle banks or donate intact glasses.", co2SavedKg: 0.30 },
  "Trash": { displayName: "General Non-Recyclable Waste", category: "hazardous", binColor: "Black", tip: "Dispose in general landfill waste bin responsibly.", co2SavedKg: 0.05 },
  "Shoes": { displayName: "Footwear / Shoes", category: "plastic", binColor: "Brown / Drop-off", tip: "Donate wearable shoes or deposit at specialized textile drop-offs.", co2SavedKg: 0.50 },
  "Paper": { displayName: "Paper / Newspaper", category: "paper", binColor: "Yellow / Blue", tip: "Keep clean and dry; place in dedicated paper recycling bin.", co2SavedKg: 0.35 },
  "Metal": { displayName: "Metal Can / Tin", category: "metal", binColor: "Grey", tip: "Rinse food residue; aluminum and steel are infinitely recyclable.", co2SavedKg: 0.95 },
  "Clothes": { displayName: "Clothing / Fabric", category: "paper", binColor: "Textile Bin", tip: "Donate if wearable or drop at municipal textile recovery boxes.", co2SavedKg: 0.60 },
  "Cardboard": { displayName: "Cardboard Box / Packaging", category: "paper", binColor: "Yellow / Blue", tip: "Flatten boxes; remove plastic packing tape and polystyrene.", co2SavedKg: 0.45 },
  "Food Waste": { displayName: "Organic Kitchen Food Scrap", category: "organic", binColor: "Green", tip: "Compost at home or use municipal green organic caddy.", co2SavedKg: 0.25 },
  "Battery": { displayName: "Battery Cell (Hazardous)", category: "hazardous", binColor: "Red / Battery Box", tip: "Never place in household trash. Drop off at certified battery retailer.", co2SavedKg: 0.20 },
  "Mobile": { displayName: "Mobile Phone (E-Waste)", category: "metal", binColor: "E-Waste Depot", tip: "Wipe personal data; drop off at certified e-waste recycler.", co2SavedKg: 1.20 },
  "Keyboard": { displayName: "Computer Keyboard (E-Waste)", category: "metal", binColor: "E-Waste Depot", tip: "Take to municipal electronics collection depot.", co2SavedKg: 0.80 },
  "Mouse": { displayName: "Computer Mouse (E-Waste)", category: "metal", binColor: "E-Waste Depot", tip: "Take to municipal electronics collection depot.", co2SavedKg: 0.40 },
  "TV": { displayName: "Television / Monitor (E-Waste)", category: "metal", binColor: "E-Waste Depot", tip: "Heavy electronic device: take to municipal e-waste recycling depot.", co2SavedKg: 2.50 },
  "PCB": { displayName: "Circuit Board (E-Waste)", category: "metal", binColor: "E-Waste Depot", tip: "Contains valuable metals and toxic solder; deliver to e-waste depot.", co2SavedKg: 1.10 },
  "Leaf": { displayName: "Fallen Leaves / Yard Trimmings", category: "organic", binColor: "Green", tip: "Compost or bag in municipal yard waste collection.", co2SavedKg: 0.20 },
  "Wood Waste": { displayName: "Natural Wood Waste / Timber", category: "organic", binColor: "Green / Timber Yard", tip: "Untreated wood is compostable; treated timber requires civic depot.", co2SavedKg: 0.35 },
  "Plastic bags": { displayName: "Plastic Bag / Packaging Film", category: "plastic", binColor: "Store Drop-off", tip: "Do not put in curbside bins (jams machinery). Return to grocery drop-off.", co2SavedKg: 0.15 },
  "Leather": { displayName: "Leather Goods / Material", category: "plastic", binColor: "Brown / Special", tip: "Repurpose or place in non-recyclable residual waste.", co2SavedKg: 0.30 }
};

/**
 * Resolves complete domain, category, and display info for a model label.
 * 
 * @param {string} tmClass 
 * @returns {object}
 */
export function getLiveItemInfo(tmClass) {
  const config = LIVE_CLASS_CONFIG[tmClass] || {
    displayName: tmClass || "Waste Item",
    category: mapLabelToCategory(tmClass).category,
    binColor: "Blue",
    tip: "Inspect item and refer to local municipal sorting rules.",
    co2SavedKg: 0.30
  };

  const categoryId = config.category || mapLabelToCategory(tmClass).category;
  const categoryData = CATEGORIES_DATA[categoryId] || CATEGORIES_DATA.hazardous;

  return {
    rawClass: tmClass,
    displayName: config.displayName,
    categoryId,
    categoryData,
    binColor: config.binColor,
    tip: config.tip,
    carbonText: `~${config.co2SavedKg.toFixed(2)} kg CO₂`,
    co2SavedKg: config.co2SavedKg
  };
}
