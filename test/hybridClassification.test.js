import { describe, it, expect } from 'vitest';
import { computeModelAgreement, getOfflineDemoClassification } from '../src/services/classificationService.js';
import { mapLabelToCategory, CLASS_TO_CATEGORY_MAP } from '../src/services/tfjsModel.js';

describe('Hybrid AI Classifier & Model Agreement', () => {
  it('correctly maps all 19 Teachable Machine model labels to waste categories', () => {
    const expectedLabels = [
      "Plastic", "Glasses", "Trash", "Shoes", "Paper", "Metal", "Clothes",
      "Cardboard", "Food Waste", "Battery", "Mobile", "Keyboard", "Mouse",
      "TV", "PCB", "Leaf", "Wood Waste", "Plastic bags", "Leather"
    ];

    expectedLabels.forEach((label) => {
      const mapped = mapLabelToCategory(label);
      expect(mapped).toBeDefined();
      expect(mapped.category).toBeDefined();
      expect(['organic', 'plastic', 'paper', 'glass', 'metal', 'hazardous']).toContain(mapped.category);
    });
  });

  it('detects model agreement when Groq and TF.js predict matching categories', () => {
    const tfjsPred = {
      label: 'Plastic',
      category: 'plastic',
      confidence: 94
    };

    const agreement = computeModelAgreement('plastic', tfjsPred);
    expect(agreement.hasComparison).toBe(true);
    expect(agreement.agreement).toBe(true);
    expect(agreement.message).toContain('Both models in alignment');
  });

  it('detects and handles model variance transparently without throwing or modifying confidence', () => {
    const tfjsPred = {
      label: 'Cardboard',
      category: 'paper',
      confidence: 88
    };

    const variance = computeModelAgreement('plastic', tfjsPred);
    expect(variance.hasComparison).toBe(true);
    expect(variance.agreement).toBe(false);
    expect(variance.groqCategory).toBe('plastic');
    expect(variance.tfjsCategory).toBe('paper');
    expect(variance.message).toContain('Preliminary model variance');
  });

  it('handles missing on-device prediction gracefully', () => {
    const result = computeModelAgreement('plastic', null);
    expect(result.hasComparison).toBe(false);
    expect(result.agreement).toBe(false);
  });

  it('produces valid fallback classification when in demo mode', () => {
    const tfjsPred = {
      label: 'Aluminium Can',
      confidence: 90
    };
    const demo = getOfflineDemoClassification('sample.jpg', tfjsPred);
    expect(demo.wasteType).toBeDefined();
    expect(demo.confidence).toBeGreaterThanOrEqual(70);
    expect(demo.itemName).toBeDefined();
  });
});
