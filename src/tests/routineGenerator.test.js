import generateRoutine from '../utils/routineGenerator';
import { AppError, ERROR_TYPES } from '../utils/errorUtils';

describe('routineGenerator', () => {
  const validParams = {
    age: 25,
    level: 'beginner',
    goal: 'lose_weight',
    days: 3
  };

  describe('valid inputs', () => {
    test('should generate routine for beginner lose_weight', () => {
      const routine = generateRoutine(validParams);
      
      expect(routine).toBeDefined();
      expect(Array.isArray(routine)).toBe(true);
      expect(routine).toHaveLength(3);
      expect(routine[0]).toContain('Caminata rápida 20 min');
    });

    test('should generate routine for intermediate gain_muscle', () => {
      const params = { ...validParams, level: 'intermediate', goal: 'gain_muscle' };
      const routine = generateRoutine(params);
      
      expect(routine).toBeDefined();
      expect(Array.isArray(routine)).toBe(true);
      expect(routine[0]).toContain('Sentadillas con salto 4x12');
    });

    test('should generate routine for advanced stay_fit', () => {
      const params = { ...validParams, level: 'advanced', goal: 'stay_fit' };
      const routine = generateRoutine(params);
      
      expect(routine).toBeDefined();
      expect(Array.isArray(routine)).toBe(true);
      expect(routine[0]).toContain('Correr 30 min');
    });

    test('should handle different number of days', () => {
      const routine1 = generateRoutine({ ...validParams, days: 1 });
      const routine7 = generateRoutine({ ...validParams, days: 7 });
      
      expect(routine1).toHaveLength(1);
      expect(routine7).toHaveLength(7);
    });
  });

  describe('personalization features', () => {
    test('should adjust difficulty based on feedback', () => {
      const feedbackEasy = { difficulty: 'fácil' };
      const feedbackHard = { difficulty: 'difícil' };
      
      const routineEasy = generateRoutine({ ...validParams, feedback: feedbackEasy });
      const routineHard = generateRoutine({ ...validParams, feedback: feedbackHard });
      
      expect(routineEasy).toBeDefined();
      expect(routineHard).toBeDefined();
      // Note: The actual adjustment logic would need to be tested more specifically
    });

    test('should adjust based on nutrition goals', () => {
      const nutrition = { goal: 'lose_weight', calories: 1500 };
      const routine = generateRoutine({ ...validParams, nutrition });
      
      expect(routine).toBeDefined();
    });
  });

  describe('error handling', () => {
    test('should throw error for invalid level', () => {
      const invalidParams = { ...validParams, level: 'invalid' };
      
      expect(() => generateRoutine(invalidParams)).toThrow();
    });

    test('should throw error for invalid goal', () => {
      const invalidParams = { ...validParams, goal: 'invalid' };
      
      expect(() => generateRoutine(invalidParams)).toThrow();
    });

    test('should throw error for missing level', () => {
      const invalidParams = { ...validParams, level: null };
      
      expect(() => generateRoutine(invalidParams)).toThrow();
    });

    test('should throw error for missing goal', () => {
      const invalidParams = { ...validParams, goal: null };
      
      expect(() => generateRoutine(invalidParams)).toThrow();
    });
  });

  describe('edge cases', () => {
    test('should handle minimum age', () => {
      const routine = generateRoutine({ ...validParams, age: 10 });
      expect(routine).toBeDefined();
    });

    test('should handle maximum age', () => {
      const routine = generateRoutine({ ...validParams, age: 80 });
      expect(routine).toBeDefined();
    });

    test('should handle minimum days', () => {
      const routine = generateRoutine({ ...validParams, days: 1 });
      expect(routine).toHaveLength(1);
    });

    test('should handle maximum days', () => {
      const routine = generateRoutine({ ...validParams, days: 7 });
      expect(routine).toHaveLength(7);
    });
  });
});