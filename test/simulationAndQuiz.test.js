import { describe, it, expect } from 'vitest';
import { getSimulationData, SIMULATION_SCENARIOS, SIMULATION_DISCLAIMER } from '../src/data/simulationData.js';
import { getQuizForCategory, QUIZ_QUESTIONS } from '../src/data/quizData.js';

describe('Environmental Impact Simulation & Mini Quiz Verification', () => {

  describe('1. Environmental Impact Simulation Scenarios', () => {
    const categories = ['plastic', 'organic', 'glass', 'metal', 'paper', 'hazardous'];

    it('provides structured simulation models for all primary waste categories', () => {
      categories.forEach((cat) => {
        const scenario = getSimulationData(cat);
        expect(scenario).toBeDefined();
        expect(scenario.responsible).toBeDefined();
        expect(scenario.improper).toBeDefined();
        expect(scenario.responsible.steps.length).toBe(3);
        expect(scenario.improper.steps.length).toBe(3);
      });
    });

    it('includes realistic stages, durations, metrics, and summaries for plastic', () => {
      const plastic = getSimulationData('plastic');
      expect(plastic.responsible.pathName).toContain('Recycling');
      expect(plastic.improper.pathName).toContain('Landfill');
      expect(plastic.improper.impactSummary).toContain('microplastics');

      plastic.responsible.steps.forEach((step) => {
        expect(step.stage).toBeDefined();
        expect(step.duration).toBeDefined();
        expect(step.metric).toBeDefined();
      });
    });

    it('accurately models organic composting vs anaerobic methane', () => {
      const organic = getSimulationData('organic');
      expect(organic.responsible.headline).toContain('Methane Interception');
      expect(organic.improper.headline).toContain('Anaerobic');
      expect(organic.improper.steps[1].description).toContain('methane');
    });

    it('falls back gracefully to plastic simulation for unrecognized category', () => {
      const fallback = getSimulationData('unknown_matter');
      expect(fallback.category).toBe('plastic');
    });

    it('supplies educational disclaimer distinguishing simulation from exact predictions', () => {
      expect(SIMULATION_DISCLAIMER).toContain('Educational simulation');
      expect(SIMULATION_DISCLAIMER).toContain('Actual local outcomes vary');
    });
  });

  describe('2. Science Day Mini Quiz Questions & Data Integrity', () => {
    const categories = ['plastic', 'organic', 'glass', 'metal', 'paper', 'hazardous'];

    it('provides at least 3 multiple-choice questions for each category', () => {
      categories.forEach((cat) => {
        const quiz = getQuizForCategory(cat);
        expect(quiz.length).toBeGreaterThanOrEqual(3);
      });
    });

    it('ensures every question has exactly 4 options, a valid correct index, and an explanation', () => {
      Object.values(QUIZ_QUESTIONS).forEach((questions) => {
        questions.forEach((q) => {
          expect(q.id).toBeDefined();
          expect(typeof q.question).toBe('string');
          expect(q.question.length).toBeGreaterThan(10);
          expect(q.options.length).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThan(4);
          expect(typeof q.explanation).toBe('string');
          expect(q.explanation.length).toBeGreaterThan(15);
        });
      });
    });

    it('validates factual accuracy for critical hazardous and metal questions', () => {
      const hazardousQuiz = getQuizForCategory('hazardous');
      // Question on taping battery terminals
      const batteryQ = hazardousQuiz.find(q => q.id === 'hazardous_q1');
      expect(batteryQ.options[batteryQ.correctIndex]).toContain('Tape both terminal ends');

      // Question on bleach + ammonia
      const chemQ = hazardousQuiz.find(q => q.id === 'hazardous_q2');
      expect(chemQ.options[chemQ.correctIndex]).toContain('chloramine gas');

      // Metal question on 95% energy saved for aluminum
      const metalQuiz = getQuizForCategory('metal');
      const aluQ = metalQuiz.find(q => q.id === 'metal_q1');
      expect(aluQ.options[aluQ.correctIndex]).toContain('95%');
    });

    it('falls back gracefully to plastic quiz for unknown categories', () => {
      const fallbackQuiz = getQuizForCategory('unidentified_item');
      expect(fallbackQuiz.length).toBe(3);
      expect(fallbackQuiz[0].id).toContain('plastic');
    });
  });
});
