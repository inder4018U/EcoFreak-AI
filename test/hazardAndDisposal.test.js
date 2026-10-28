import { describe, it, expect } from 'vitest';
import {
  getHazardAndDisposalGuidance,
  HAZARD_PROFILES,
  SAFETY_DISCLAIMER,
  CONFIDENCE_THRESHOLDS
} from '../src/data/hazardAndDisposalData.js';

describe('Hazard Assessment, Do’s & Don’ts, and Uncertainty Validation', () => {

  describe('1. Hazard Assessment across all supported categories', () => {
    it('rates hazardous category as Critical with fire and toxicity warnings', () => {
      const guidance = getHazardAndDisposalGuidance('hazardous');
      expect(guidance.hazardLevel).toBe('Critical');
      expect(guidance.hazardTags).toContain('Chemical Toxicity');
      expect(guidance.hazardTags).toContain('Fire Hazard');
      expect(guidance.precautions.length).toBeGreaterThanOrEqual(3);
    });

    it('rates glass and metal as Moderate hazards with laceration warnings', () => {
      const glass = getHazardAndDisposalGuidance('glass');
      expect(glass.hazardLevel).toBe('Moderate');
      expect(glass.hazardTags).toContain('Laceration & Puncture');

      const metal = getHazardAndDisposalGuidance('metal');
      expect(metal.hazardLevel).toBe('Moderate');
      expect(metal.hazardTags).toContain('Laceration Hazard');
    });

    it('rates paper, plastic, and organic as Low hazard with environmental warnings', () => {
      ['paper', 'plastic', 'organic'].forEach((cat) => {
        const guidance = getHazardAndDisposalGuidance(cat);
        expect(guidance.hazardLevel).toBe('Low');
        expect(guidance.precautions.length).toBeGreaterThan(0);
      });
    });

    it('enforces mandatory safety disclaimer stating items cannot be claimed safe by image alone', () => {
      const guidance = getHazardAndDisposalGuidance('plastic', 'Plastic Water Bottle');
      expect(guidance.safetyDisclaimer).toBe(SAFETY_DISCLAIMER);
      expect(guidance.safetyDisclaimer).toContain('Never assume an item is safe to handle based solely on a photograph');
      expect(guidance.safetyDisclaimer).toContain('Visual image classification cannot detect invisible chemical residues');
    });
  });

  describe('2. Specific Item Hazard Guidance (Batteries, E-Waste, Broken Glass, Chemicals)', () => {
    it('triggers battery thermal runaway warnings when battery is detected', () => {
      const battery = getHazardAndDisposalGuidance('hazardous', 'AA Battery');
      expect(battery.matchedSpecificGuidance).toBeDefined();
      expect(battery.matchedSpecificGuidance.title).toContain('Battery');
      expect(battery.matchedSpecificGuidance.risk).toContain('thermal runaway');
      expect(battery.matchedSpecificGuidance.precautions.some(p => p.includes('tape'))).toBe(true);
    });

    it('triggers e-waste heavy metal precautions for electronics and gadgets', () => {
      const ewaste = getHazardAndDisposalGuidance('metal', 'Old Smartphone');
      expect(ewaste.matchedSpecificGuidance).toBeDefined();
      expect(ewaste.matchedSpecificGuidance.title).toContain('E-Waste');
      expect(ewaste.matchedSpecificGuidance.risk).toContain('lead solder');
      expect(ewaste.matchedSpecificGuidance.precautions.some(p => p.includes('batteries'))).toBe(true);
    });

    it('triggers broken glass protocol when shards or broken glassware are identified', () => {
      const broken = getHazardAndDisposalGuidance('glass', 'Broken Glass Shard');
      expect(broken.matchedSpecificGuidance).toBeDefined();
      expect(broken.matchedSpecificGuidance.title).toContain('Broken Glass');
      expect(broken.matchedSpecificGuidance.warning).toContain('Never dispose of loose broken glass');
      expect(broken.matchedSpecificGuidance.precautions.some(p => p.includes('cardboard'))).toBe(true);
    });

    it('triggers chemical mixing warnings for solvents, paints, and cleaners', () => {
      const chem = getHazardAndDisposalGuidance('hazardous', 'Chemical Solvent Container');
      expect(chem.matchedSpecificGuidance).toBeDefined();
      expect(chem.matchedSpecificGuidance.title).toContain('Chemicals');
      expect(chem.matchedSpecificGuidance.warning).toContain('Mixing bleach and ammonia produces deadly chloramine gas');
    });
  });

  describe('3. Disposal Do’s and Don’ts', () => {
    it('provides clear Do’s and Don’ts for every supported category', () => {
      const categories = ['organic', 'plastic', 'glass', 'metal', 'paper', 'hazardous'];
      categories.forEach((cat) => {
        const guidance = getHazardAndDisposalGuidance(cat);
        expect(guidance.dos.length).toBeGreaterThanOrEqual(3);
        expect(guidance.donts.length).toBeGreaterThanOrEqual(3);
      });
    });

    it('includes specific plastic rules (e.g. do not burn, do not put soft film in gears)', () => {
      const plastic = getHazardAndDisposalGuidance('plastic');
      expect(plastic.donts.some(d => d.includes('burn'))).toBe(true);
      expect(plastic.dos.some(d => d.includes('rinse'))).toBe(true);
    });

    it('includes organic composting rules against meat/dairy in basic bins and plastic stickers', () => {
      const organic = getHazardAndDisposalGuidance('organic');
      expect(organic.donts.some(d => d.includes('plastic produce stickers'))).toBe(true);
      expect(organic.dos.some(d => d.includes('caddy'))).toBe(true);
    });
  });

  describe('4. Uncertainty and Confidence Thresholds', () => {
    it('defines clear confidence thresholds for reliable vs uncertain predictions', () => {
      expect(CONFIDENCE_THRESHOLDS.HIGH).toBe(85);
      expect(CONFIDENCE_THRESHOLDS.LOW).toBe(70);
    });

    it('falls back gracefully to hazardous safety standards when given an unrecognized category', () => {
      const unknown = getHazardAndDisposalGuidance('unidentified_mystery_substance');
      expect(unknown.category).toBe('hazardous');
      expect(unknown.hazardLevel).toBe('Critical');
      expect(unknown.precautions.length).toBeGreaterThan(0);
    });
  });
});
