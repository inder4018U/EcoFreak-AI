export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured in environment variables.' });
  }

  try {
    const { imageBase64, mimeType, tfjsPrediction } = req.body || {};
    if (!imageBase64) return res.status(400).json({ error: 'imageBase64 required' });

    const dataUrl = `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`;

    let tfjsContextPrompt = '';
    if (tfjsPrediction && tfjsPrediction.label) {
      const tfConfidence = typeof tfjsPrediction.confidence === 'number'
        ? tfjsPrediction.confidence
        : (tfjsPrediction.rawProbability ? Math.round(tfjsPrediction.rawProbability * 100) : null);

      tfjsContextPrompt = `\n\n[Preliminary On-Device Vision Context]:
A client-side TensorFlow.js model (trained on waste categories) conducted initial edge inference on this frame and observed:
- Preliminary label: "${tfjsPrediction.label}"
${tfConfidence !== null ? `- Preliminary confidence: ${tfConfidence}%` : ''}
${tfjsPrediction.category ? `- Suggested category: "${tfjsPrediction.category}"` : ''}
${Array.isArray(tfjsPrediction.topPredictions) ? `- Top candidate labels: ${tfjsPrediction.topPredictions.map(p => `${p.className} (${p.percentage || Math.round((p.probability || 0) * 100)}%)`).join(', ')}` : ''}

Note: The on-device model provides a preliminary real-time hypothesis. You MUST independently inspect the image carefully. If the preliminary prediction is incorrect or generic, provide the accurate true classification and item name based on your visual examination.`;
    }

    const promptText = `Analyze this waste/recycling image and reply ONLY with a valid JSON object:
{
  "itemName": "exact name of the object you see, e.g. 'Plastic Water Bottle (PET)', 'Banana Peel', 'Aluminium Soda Can', 'Cardboard Packaging', 'Glass Jar', 'AA Battery'",
  "wasteType": "one of: organic, plastic, paper, glass, metal, hazardous",
  "confidence": number between 70 and 99 representing your model confidence,
  "reason": "one concise sentence explaining why you classified it this way and how it should be handled",
  "isScreenshot": number between 0 and 100 representing % likelihood this image is a screenshot, digital graphic or render rather than a physical camera photo,
  "estimatedMaterial": "likely specific material, e.g. 'PET Plastic', 'Aluminum', 'Corrugated Cardboard', 'Soda-lime Glass', 'Food Scrap', 'Alkaline Battery'",
  "estimatedWeightG": typical estimated weight in grams as a number, e.g. 24
}

Waste type rules:
- organic = food scraps, fruit peels, vegetable waste, leaves, natural wood, yard waste
- plastic = bottles, film, bags, synthetic packaging, plastic containers
- paper = cardboard, newsprint, office paper, magazines, paper cartons
- glass = bottles, jars, glass containers, broken glassware
- metal = aluminum cans, tin food cans, electronic circuit boards, cables, phones, metal scrap
- hazardous = batteries, motor oil, toxic chemicals, paint, fluorescent bulbs, medical sharps

For isScreenshot:
- 75-95 if it contains UI elements, web screenshots, diagrams, text screenshots, or digital illustrations.
- 5-25 if it is an actual physical photograph of real physical objects taken with a camera.${tfjsContextPrompt}`;

    const modelsToTry = [
      process.env.GROQ_VISION_MODEL || 'qwen/qwen3.8-27b',
      'qwen/qwen3.8-27b',
      'meta-llama/llama-4-scout-17b-16e-instruct'
    ];
    // Remove duplicates
    const uniqueModels = [...new Set(modelsToTry)];

    let lastError = null;
    let data = null;

    for (const modelName of uniqueModels) {
      try {
        const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: modelName,
            max_tokens: 350,
            temperature: 0.1,
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'image_url', image_url: { url: dataUrl } },
                  { type: 'text', text: promptText }
                ]
              }
            ]
          })
        });

        if (resp.ok) {
          data = await resp.json();
          break;
        }

        const errText = await resp.text();
        lastError = `Groq Vision error with ${modelName} (${resp.status}): ${errText}`;
        console.warn(lastError);
      } catch (reqErr) {
        lastError = reqErr.message;
      }
    }

    if (!data) {
      return res.status(502).json({ error: lastError || 'Groq Vision classification failed across candidate models.' });
    }

    let text = data.choices?.[0]?.message?.content || '';
    text = text.replace(/```json|```/g, '').trim();
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) {
      throw new Error('Groq Vision model returned an invalid non-JSON response');
    }

    const result = JSON.parse(text.substring(start, end + 1));

    const validTypes = ['organic', 'plastic', 'paper', 'glass', 'metal', 'hazardous'];
    let finalType = (result.wasteType || '').toLowerCase().trim();
    if (!validTypes.includes(finalType)) {
      finalType = 'hazardous';
    }

    return res.status(200).json({
      wasteType: finalType,
      confidence: typeof result.confidence === 'number' ? result.confidence : 88,
      itemName: result.itemName || 'Identified Waste Item',
      reason: result.reason || 'Identified using Groq Vision AI analysis.',
      isScreenshot: typeof result.isScreenshot === 'number' ? result.isScreenshot : 10,
      estimatedMaterial: result.estimatedMaterial || null,
      estimatedWeightG: typeof result.estimatedWeightG === 'number' ? result.estimatedWeightG : null,
      tfjsContext: tfjsPrediction || null
    });

  } catch (err) {
    console.error('Classification error:', err);
    return res.status(500).json({ error: err.message || 'Classification failed' });
  }
}
