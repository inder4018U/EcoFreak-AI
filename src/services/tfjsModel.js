import * as tmImage from '@teachablemachine/image';

export const CLASS_TO_CATEGORY_MAP = {
  "Plastic": { category: "plastic", name: "Plastic Item", icon: "🧴" },
  "Plastic bags": { category: "plastic", name: "Plastic Bag / Film", icon: "🛍️" },
  "Paper": { category: "paper", name: "Paper Material", icon: "📄" },
  "Cardboard": { category: "paper", name: "Cardboard Packaging", icon: "📦" },
  "Food Waste": { category: "organic", name: "Food / Kitchen Scrap", icon: "🍎" },
  "Leaf": { category: "organic", name: "Leaves / Yard Trimmings", icon: "🍂" },
  "Wood Waste": { category: "organic", name: "Wood Waste / Timber", icon: "🪵" },
  "Metal": { category: "metal", name: "Metal Scrap / Can", icon: "🥫" },
  "PCB": { category: "metal", name: "Circuit Board (E-Waste)", icon: "🔌" },
  "Mobile": { category: "metal", name: "Mobile Device (E-Waste)", icon: "📱" },
  "Keyboard": { category: "metal", name: "Keyboard (E-Waste)", icon: "⌨️" },
  "Mouse": { category: "metal", name: "Computer Mouse (E-Waste)", icon: "🖱️" },
  "TV": { category: "metal", name: "Television / Monitor (E-Waste)", icon: "🖥️" },
  "Glasses": { category: "glass", name: "Glassware / Lenses", icon: "👓" },
  "Battery": { category: "hazardous", name: "Battery Cell", icon: "🔋" },
  "Shoes": { category: "plastic", name: "Footwear / Mixed Material", icon: "👟" },
  "Clothes": { category: "paper", name: "Textile / Fabric", icon: "👕" },
  "Leather": { category: "plastic", name: "Leather Product", icon: "👞" },
  "Trash": { category: "hazardous", name: "General Mixed Trash", icon: "🗑️" }
};

export function mapLabelToCategory(label) {
  if (!label) return { category: "hazardous", name: "Unclassified Item", icon: "❓" };
  const match = CLASS_TO_CATEGORY_MAP[label];
  if (match) return match;

  const lower = label.toLowerCase();
  if (lower.includes('plastic') || lower.includes('bag') || lower.includes('bottle')) return { category: 'plastic', name: label, icon: '🧴' };
  if (lower.includes('paper') || lower.includes('cardboard') || lower.includes('box')) return { category: 'paper', name: label, icon: '📄' };
  if (lower.includes('organic') || lower.includes('food') || lower.includes('leaf') || lower.includes('wood') || lower.includes('fruit')) return { category: 'organic', name: label, icon: '🍎' };
  if (lower.includes('glass') || lower.includes('jar')) return { category: 'glass', name: label, icon: '👓' };
  if (lower.includes('metal') || lower.includes('can') || lower.includes('e-waste') || lower.includes('phone') || lower.includes('pcb')) return { category: 'metal', name: label, icon: '🥫' };
  return { category: 'hazardous', name: label, icon: '⚠️' };
}

let cachedModel = null;
let modelLoadingPromise = null;

export async function loadClassifierModel(modelBaseUrl = '/model/') {
  if (cachedModel) return cachedModel;
  if (modelLoadingPromise) return modelLoadingPromise;

  modelLoadingPromise = (async () => {
    try {
      const cleanBase = modelBaseUrl.endsWith('/') ? modelBaseUrl : `${modelBaseUrl}/`;
      const modelURL = `${cleanBase}model.json`;
      const metadataURL = `${cleanBase}metadata.json`;

      console.info(`[EcoFreak AI] Loading Teachable Machine model from ${cleanBase}...`);
      const model = await tmImage.load(modelURL, metadataURL);
      cachedModel = model;
      console.info(`[EcoFreak AI] Model loaded successfully (${model.getTotalClasses()} classes)`);
      return model;
    } catch (err) {
      console.error('[EcoFreak AI] Failed to load Teachable Machine model:', err);
      cachedModel = null;
      throw new Error(`Failed to load on-device vision model: ${err.message || 'Network error'}`);
    } finally {
      modelLoadingPromise = null;
    }
  })();

  return modelLoadingPromise;
}

export function isModelLoaded() {
  return cachedModel !== null;
}

export async function predictWaste(inputElement, modelBaseUrl = '/model/') {
  const model = cachedModel || (await loadClassifierModel(modelBaseUrl));

  if (!inputElement) {
    throw new Error('No input element provided for prediction');
  }

  const rawPredictions = await model.predict(inputElement);

  // Sort descending by probability
  const sorted = [...rawPredictions].sort((a, b) => b.probability - a.probability);
  const top = sorted[0] || { className: 'Unknown', probability: 0 };
  const mapped = mapLabelToCategory(top.className);

  return {
    success: true,
    label: top.className,
    confidence: Math.round(top.probability * 100),
    rawProbability: top.probability,
    category: mapped.category,
    categoryName: mapped.name,
    categoryIcon: mapped.icon,
    topPredictions: sorted.slice(0, 3).map(p => ({
      className: p.className,
      probability: p.probability,
      percentage: Math.round(p.probability * 100)
    })),
    allPredictions: sorted
  };
}
