import { describe, it, expect } from 'vitest';
import {
  calculateCarbonFootprint,
  parseAndValidateWeight,
  resolveMaterial,
  getEmissionGauge,
  calculateEquivalencies
} from '../src/services/carbonEngine.js';
import { MATERIAL_FACTORS, ITEM_NAME_MAPPINGS } from '../src/data/emissionFactors.js';
import carbonApiHandler from '../api/carbon-estimate.js';

describe('Carbon Footprint Engine', () => {

  describe('1. Mass-to-emissions calculations', () => {
    it('calculates production emissions correctly for PET plastic (2.80 kg CO2e / kg)', () => {
      // 500g = 0.5 kg -> 0.5 * 2.80 = 1.40 kg CO2e
      const result = calculateCarbonFootprint({
        materialId: 'plastic_pet',
        weight: 500,
        unit: 'g'
      });
      expect(result.success).toBe(true);
      expect(result.footprint.productionEmissionsKg).toBe(1.4);
      expect(result.footprint.emissionFactorKgCO2ePerKg).toBe(2.80);
      expect(result.footprint.landfillEmissionsKg).toBeCloseTo(0.5 * 0.021, 4);
    });

    it('calculates emissions accurately for an aluminum can (14.5g, factor 11.50 kg CO2e/kg)', () => {
      // 14.5g = 0.0145 kg -> 0.0145 * 11.50 = 0.16675 -> 0.1668 kg CO2e
      const result = calculateCarbonFootprint({
        itemName: 'Aluminium Can',
        weight: 14.5,
        unit: 'g'
      });
      expect(result.success).toBe(true);
      expect(result.material.id).toBe('metal_aluminum');
      expect(result.footprint.productionEmissionsKg).toBeCloseTo(0.1668, 3);
    });

    it('resolves materials directly and via keywords', () => {
      const mat = resolveMaterial({ materialId: 'plastic_pet' });
      expect(mat.id).toBe('plastic_pet');
      expect(MATERIAL_FACTORS.plastic_pet).toBeDefined();
      expect(ITEM_NAME_MAPPINGS.length).toBeGreaterThan(5);

      const resolved = resolveMaterial({ itemName: 'Glass Bottle', wasteType: 'glass' });
      expect(resolved.id).toBe('glass_container');
    });

    it('calculates equivalencies correctly for non-positive or positive values', () => {
      const zeroEq = calculateEquivalencies(0);
      expect(zeroEq.smartphones).toBe(0);

      const validEq = calculateEquivalencies(1.0);
      expect(validEq.smartphones).toBeGreaterThan(100);
      expect(validEq.kmDriven).toBeGreaterThan(3);
    });

    it('uses documented archetype defaults when weight is omitted', () => {
      const result = calculateCarbonFootprint({
        itemName: 'Plastic Water Bottle'
      });
      expect(result.success).toBe(true);
      expect(result.weight.source).toBe('assumed_default');
      expect(result.weight.weightG).toBe(22);
      expect(result.footprint.productionEmissionsKg).toBeCloseTo((22 / 1000) * 2.80, 4);
    });
  });

  describe('2. Unit conversions (grams vs kilograms)', () => {
    it('produces identical emissions whether entered in grams or kilograms', () => {
      const resGrams = calculateCarbonFootprint({
        materialId: 'glass_container',
        weight: 250,
        unit: 'g'
      });

      const resKg = calculateCarbonFootprint({
        materialId: 'glass_container',
        weight: 0.25,
        unit: 'kg'
      });

      expect(resGrams.success).toBe(true);
      expect(resKg.success).toBe(true);
      expect(resGrams.footprint.productionEmissionsKg).toBe(resKg.footprint.productionEmissionsKg);
      expect(resGrams.weight.weightKg).toBe(0.25);
      expect(resKg.weight.weightG).toBe(250);
    });

    it('handles string input numbers cleanly', () => {
      const result = parseAndValidateWeight('150.5', 'g');
      expect(result.valid).toBe(true);
      expect(result.weightKg).toBeCloseTo(0.1505, 5);
    });
  });

  describe('3. Missing, invalid, zero, and negative weight inputs', () => {
    it('rejects zero weight with a clear error', () => {
      const result = calculateCarbonFootprint({
        materialId: 'paper_cardboard',
        weight: 0,
        unit: 'g'
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_WEIGHT');
      expect(result.message).toContain('greater than zero');
    });

    it('rejects negative weight values', () => {
      const result = calculateCarbonFootprint({
        materialId: 'paper_cardboard',
        weight: -25,
        unit: 'g'
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_WEIGHT');
      expect(result.message).toContain('greater than zero');
    });

    it('rejects non-numeric string values', () => {
      const result = calculateCarbonFootprint({
        materialId: 'paper_cardboard',
        weight: 'abc',
        unit: 'g'
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_WEIGHT');
      expect(result.message).toContain('valid number');
    });

    it('rejects unfeasibly high weights (>1,000 kg for a household item)', () => {
      const result = calculateCarbonFootprint({
        materialId: 'plastic_pet',
        weight: 2000,
        unit: 'kg'
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_WEIGHT');
      expect(result.message).toContain('threshold');
    });
  });

  describe('4. Unknown materials and fallback behavior', () => {
    it('returns a polite failure with disclaimer for completely unknown materials', () => {
      const result = calculateCarbonFootprint({
        itemName: 'alien asteroid chunk',
        wasteType: 'extraterrestrial'
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('UNSUPPORTED_MATERIAL');
      expect(result.message).toContain('not available');
      expect(result.disclaimer).toBeDefined();
    });

    it('falls back to category default if item name is ambiguous', () => {
      const result = calculateCarbonFootprint({
        itemName: 'some random synthetic object',
        wasteType: 'plastic'
      });
      expect(result.success).toBe(true);
      expect(result.material.id).toBe('plastic_general');
      expect(result.confidence.rating).toBe('Low/Range');
    });
  });

  describe('5. Disposal scenario comparisons', () => {
    it('includes Landfill and Recycling for recyclable plastics', () => {
      const result = calculateCarbonFootprint({
        materialId: 'plastic_pet',
        weight: 100,
        unit: 'g'
      });
      expect(result.success).toBe(true);
      const scenarioIds = result.scenarios.map(s => s.id);
      expect(scenarioIds).toContain('landfill');
      expect(scenarioIds).toContain('recycling');
      expect(scenarioIds).not.toContain('composting'); // Plastics cannot be composted

      const recyclingScenario = result.scenarios.find(s => s.id === 'recycling');
      expect(recyclingScenario.savingsVsLandfillKg).toBeGreaterThan(0);
      expect(recyclingScenario.methodologyNote).toBeDefined();
    });

    it('includes Composting and Landfill for organic food waste', () => {
      const result = calculateCarbonFootprint({
        materialId: 'organic_food',
        weight: 200,
        unit: 'g'
      });
      expect(result.success).toBe(true);
      const scenarioIds = result.scenarios.map(s => s.id);
      expect(scenarioIds).toContain('composting');
      expect(scenarioIds).toContain('landfill');

      const compostScenario = result.scenarios.find(s => s.id === 'composting');
      expect(compostScenario.savingsVsLandfillKg).toBeGreaterThan(0);
      expect(compostScenario.impactDescription).toContain('methane');
    });

    it('supports Reuse for reusable materials (e.g. glass containers, cardboard)', () => {
      const result = calculateCarbonFootprint({
        materialId: 'glass_container',
        weight: 300,
        unit: 'g'
      });
      expect(result.success).toBe(true);
      const reuseScenario = result.scenarios.find(s => s.id === 'reuse');
      expect(reuseScenario).toBeDefined();
      expect(reuseScenario.savingsVsSingleUseKg).toBeGreaterThan(0);
    });
  });

  describe('6. Consistent units and lifecycle boundaries', () => {
    it('specifies lifecycle boundaries without misleading partial claims', () => {
      const result = calculateCarbonFootprint({
        materialId: 'paper_cardboard',
        weight: 150,
        unit: 'g'
      });
      expect(result.lifecycle.stage).toContain('Cradle-to-Gate');
      expect(result.lifecycle.boundaries).toHaveProperty('production');
      expect(result.lifecycle.boundaries).toHaveProperty('disposal');
      expect(result.lifecycle.scopeNotes).toContain('Retail distribution, customer use');
    });

    it('provides educational equivalencies in documented units', () => {
      const result = calculateCarbonFootprint({
        materialId: 'electronic_device',
        weight: 200,
        unit: 'g'
      });
      // 0.2kg * 24.50 = 4.9 kg CO2e
      expect(result.footprint.productionEmissionsKg).toBeCloseTo(4.9, 1);
      expect(result.equivalencies.smartphones).toBeGreaterThan(500);
      expect(result.equivalencies.kmDriven).toBeGreaterThan(15);
      expect(result.equivalencies.disclaimer).toBeDefined();
    });

    it('returns an honest qualitative visual gauge with clearly explained scale', () => {
      const lowGauge = getEmissionGauge(0.02);
      expect(lowGauge.tier).toBe('very_low');

      const medGauge = getEmissionGauge(0.35);
      expect(medGauge.tier).toBe('moderate');

      const highGauge = getEmissionGauge(3.5);
      expect(highGauge.tier).toBe('very_high');
    });
  });

  describe('7. API endpoint error handling and responses', () => {
    // Helper to mock Express/Vercel res object
    function createMockRes() {
      const res = {
        statusCode: 200,
        headers: {},
        data: null,
        setHeader(k, v) { this.headers[k] = v; return this; },
        status(code) { this.statusCode = code; return this; },
        json(payload) { this.data = payload; return this; },
        end() { return this; }
      };
      return res;
    }

    it('returns 405 for non-POST HTTP methods', async () => {
      const req = { method: 'GET' };
      const res = createMockRes();
      await carbonApiHandler(req, res);
      expect(res.statusCode).toBe(405);
      expect(res.data.error).toBe('Method not allowed');
    });

    it('handles OPTIONS pre-flight with 200', async () => {
      const req = { method: 'OPTIONS' };
      const res = createMockRes();
      await carbonApiHandler(req, res);
      expect(res.statusCode).toBe(200);
    });

    it('returns 400 when request body lacks material identifier, item name, and waste type', async () => {
      const req = { method: 'POST', body: {} };
      const res = createMockRes();
      await carbonApiHandler(req, res);
      expect(res.statusCode).toBe(400);
      expect(res.data.error).toBe('INVALID_REQUEST');
    });

    it('returns 400 when weight is invalid', async () => {
      const req = {
        method: 'POST',
        body: {
          materialId: 'plastic_pet',
          weight: -50,
          unit: 'g'
        }
      };
      const res = createMockRes();
      await carbonApiHandler(req, res);
      expect(res.statusCode).toBe(400);
      expect(res.data.error).toBe('INVALID_WEIGHT');
    });

    it('returns 422 when material is unrecognized', async () => {
      const req = {
        method: 'POST',
        body: {
          itemName: 'unknown alien rock',
          wasteType: 'cosmic'
        }
      };
      const res = createMockRes();
      await carbonApiHandler(req, res);
      expect(res.statusCode).toBe(422);
      expect(res.data.error).toBe('UNSUPPORTED_MATERIAL');
    });

    it('returns 200 with complete estimation for valid request', async () => {
      const req = {
        method: 'POST',
        body: {
          itemName: 'Plastic Water Bottle',
          wasteType: 'plastic',
          weight: 22,
          unit: 'g'
        }
      };
      const res = createMockRes();
      await carbonApiHandler(req, res);
      expect(res.statusCode).toBe(200);
      expect(res.data.success).toBe(true);
      expect(res.data.footprint.productionEmissionsKg).toBeGreaterThan(0);
      expect(res.data.scenarios.length).toBeGreaterThan(1);
    });
  });
});
