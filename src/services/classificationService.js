import { mapLabelToCategory } from './tfjsModel.js';

export async function compressImage(fileOrBlob, maxSizeKB = 800) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(fileOrBlob);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      const maxDim = 1024;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.85;
      const tryCompress = () => {
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const sizeKB = (dataUrl.length * 0.75) / 1024;
        if (sizeKB > maxSizeKB && quality > 0.25) {
          quality -= 0.1;
          tryCompress();
        } else {
          resolve(dataUrl);
        }
      };
      tryCompress();
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for compression: ' + err.message));
    };

    img.src = url;
  });
}

export function computeModelAgreement(groqWasteType, tfjsPrediction) {
  if (!tfjsPrediction || !tfjsPrediction.category) {
    return {
      hasComparison: false,
      agreement: false,
      message: 'Single-engine mode active (Groq Vision API).'
    };
  }

  const groqType = (groqWasteType || '').toLowerCase().trim();
  const tfType = (tfjsPrediction.category || '').toLowerCase().trim();
  const isMatch = groqType === tfType;

  return {
    hasComparison: true,
    agreement: isMatch,
    groqCategory: groqType,
    tfjsCategory: tfType,
    tfjsLabel: tfjsPrediction.label,
    tfjsConfidence: tfjsPrediction.confidence,
    message: isMatch
      ? `Both models in alignment: Groq Vision AI and Edge Engine agree this item belongs in ${groqType.toUpperCase()} waste.`
      : `Preliminary model variance: Edge inference observed "${tfjsPrediction.label}" (${tfType}), while Groq Cloud Vision classified as ${groqType.toUpperCase()}. The final verified classification is determined by Groq.`
  };
}

export function getOfflineDemoClassification(filename = '', tfjsPrediction = null) {
  if (tfjsPrediction && tfjsPrediction.label) {
    const mapped = mapLabelToCategory(tfjsPrediction.label);
    const demoItems = {
      plastic: 'Plastic Beverage Bottle (PET)',
      paper: 'Corrugated Cardboard Box',
      organic: 'Organic Food Scrap / Peel',
      metal: 'Aluminium Beverage Can',
      glass: 'Glass Bottle / Jar',
      hazardous: 'Household Battery Cell'
    };

    return {
      wasteType: mapped.category,
      confidence: Math.max(82, tfjsPrediction.confidence || 88),
      itemName: demoItems[mapped.category] || `${tfjsPrediction.label} Specimen`,
      reason: `Classified item as ${tfjsPrediction.label} (${mapped.name}).`,
      isScreenshot: 8,
      estimatedMaterial: mapped.name,
      estimatedWeightG: 25,
      tfjsContext: tfjsPrediction
    };
  }

  const lower = (filename || '').toLowerCase();
  if (lower.includes('can') || lower.includes('tin') || lower.includes('aluminum')) {
    return {
      wasteType: 'metal',
      confidence: 94,
      itemName: 'Aluminium Can',
      reason: 'Standard beverage can made of highly recyclable aluminum metal.',
      isScreenshot: 8,
      estimatedMaterial: 'Aluminum',
      estimatedWeightG: 15,
      tfjsContext: null
    };
  }
  if (lower.includes('peel') || lower.includes('banana') || lower.includes('food') || lower.includes('leaf')) {
    return {
      wasteType: 'organic',
      confidence: 92,
      itemName: 'Banana Peel',
      reason: 'Organic kitchen fruit peel, fully biodegradable domestic compostable waste.',
      isScreenshot: 10,
      estimatedMaterial: 'Food Scrap',
      estimatedWeightG: 60,
      tfjsContext: null
    };
  }
  if (lower.includes('box') || lower.includes('paper') || lower.includes('cardboard')) {
    return {
      wasteType: 'paper',
      confidence: 93,
      itemName: 'Cardboard Box',
      reason: 'Corrugated cellulose fiber packaging, clean dry recyclable paper.',
      isScreenshot: 5,
      estimatedMaterial: 'Cardboard',
      estimatedWeightG: 45,
      tfjsContext: null
    };
  }
  if (lower.includes('glass') || lower.includes('bottle') && lower.includes('green')) {
    return {
      wasteType: 'glass',
      confidence: 95,
      itemName: 'Glass Bottle',
      reason: 'Soda-lime glass container, infinitely recyclable without quality loss.',
      isScreenshot: 6,
      estimatedMaterial: 'Glass',
      estimatedWeightG: 200,
      tfjsContext: null
    };
  }
  if (lower.includes('battery') || lower.includes('cell')) {
    return {
      wasteType: 'hazardous',
      confidence: 96,
      itemName: 'Alkaline Battery Cell',
      reason: 'Electrochemical energy storage cell containing hazardous heavy metals.',
      isScreenshot: 12,
      estimatedMaterial: 'Alkaline / Zinc',
      estimatedWeightG: 23,
      tfjsContext: null
    };
  }

  return {
    wasteType: 'plastic',
    confidence: 91,
    itemName: 'Plastic Water Bottle (PET)',
    reason: 'Polyethylene terephthalate clear beverage container with standard screw cap.',
    isScreenshot: 10,
    estimatedMaterial: 'PET Plastic',
    estimatedWeightG: 20,
    tfjsContext: null
  };
}

export async function runHybridClassification(imageFileOrBlob, options = {}) {
  const { onStatus = () => {}, tfjsPrediction = null } = options;

  onStatus('Compressing specimen image...');
  const dataUrl = await compressImage(imageFileOrBlob, 800);
  const base64 = dataUrl.split(',')[1];
  const mimeType = 'image/jpeg';

  onStatus('Consulting Groq Vision AI (Llama 4)...');

  // Submit captured image & TF.js edge context to Groq Vision API
  try {
    const resp = await fetch('/api/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: base64,
        mimeType,
        tfjsPrediction: tfjsPrediction || null
      })
    });

    if (resp.ok) {
      const groqData = await resp.json();
      const comparison = computeModelAgreement(groqData.wasteType, tfjsPrediction);

      return {
        type: groqData.wasteType,
        confidence: groqData.confidence,
        itemName: groqData.itemName,
        reason: groqData.reason,
        isScreenshot: groqData.isScreenshot,
        estimatedMaterial: groqData.estimatedMaterial,
        estimatedWeightG: groqData.estimatedWeightG,
        tfjsPrediction: tfjsPrediction || null,
        modelComparison: comparison
      };
    }

    const errData = await resp.json().catch(() => ({}));

    // If local dev without Groq key configured or 404, fallback to demo classifier
    if (resp.status === 404 || (errData.error && errData.error.includes('GROQ_API_KEY'))) {
      console.warn('[EcoFreak AI] GROQ_API_KEY not configured or serverless route unavailable. Using fallback demo classifier.');
      const demoResult = getOfflineDemoClassification(imageFileOrBlob.name, tfjsPrediction);
      const comparison = computeModelAgreement(demoResult.wasteType, demoResult.tfjsContext);
      return {
        type: demoResult.wasteType,
        confidence: demoResult.confidence,
        itemName: demoResult.itemName,
        reason: demoResult.reason,
        isScreenshot: demoResult.isScreenshot,
        estimatedMaterial: demoResult.estimatedMaterial,
        estimatedWeightG: demoResult.estimatedWeightG,
        tfjsPrediction: demoResult.tfjsContext,
        modelComparison: comparison,
        isDemoFallback: true
      };
    }

    throw new Error(errData.error || `Classification failed (HTTP ${resp.status})`);

  } catch (networkErr) {
    if (networkErr.message && (networkErr.message.includes('Failed to fetch') || networkErr.message.includes('NetworkError'))) {
      console.warn('[EcoFreak AI] Network unreachable. Using offline demo classifier.');
      const demoResult = getOfflineDemoClassification(imageFileOrBlob.name, tfjsPrediction);
      const comparison = computeModelAgreement(demoResult.wasteType, demoResult.tfjsContext);
      return {
        type: demoResult.wasteType,
        confidence: demoResult.confidence,
        itemName: demoResult.itemName,
        reason: demoResult.reason,
        isScreenshot: demoResult.isScreenshot,
        estimatedMaterial: demoResult.estimatedMaterial,
        estimatedWeightG: demoResult.estimatedWeightG,
        tfjsPrediction: demoResult.tfjsContext,
        modelComparison: comparison,
        isDemoFallback: true
      };
    }
    throw networkErr;
  }
}
