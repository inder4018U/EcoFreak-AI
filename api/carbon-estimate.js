import { calculateCarbonFootprint } from '../src/services/carbonEngine.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { materialId, itemName, wasteType, weight, unit = 'g', weightSource } = req.body || {};

    if (!materialId && !itemName && !wasteType) {
      return res.status(400).json({
        error: 'INVALID_REQUEST',
        message: 'At least one of materialId, itemName, or wasteType must be provided.'
      });
    }

    const result = calculateCarbonFootprint({
      materialId,
      itemName,
      wasteType,
      weight,
      unit,
      weightSource
    });

    if (!result.success) {
      const statusCode = result.error === 'INVALID_WEIGHT' ? 400 : 422;
      return res.status(statusCode).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error('Carbon estimate error:', err);
    return res.status(500).json({
      error: 'SERVER_ERROR',
      message: err.message || 'Failed to calculate carbon footprint.'
    });
  }
}
