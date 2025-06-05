import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { validateFormData, AppError, ERROR_TYPES } from "../utils/errorUtils";

function RoutineForm({ onGenerate, isGenerating, disabled }) {
  const { state } = useApp();
  const [formData, setFormData] = useState({
    age: 25,
    level: "beginner",
    goal: "lose_weight",
    days: 3
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Load previous form data if available
  useEffect(() => {
    const { progress } = state.user;
    if (progress.lastFormData) {
      setFormData(progress.lastFormData);
    }
  }, [state.user.progress]);

  // Real-time validation
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'age':
        if (!value || value < 10 || value > 80) {
          newErrors.age = 'Age must be between 10 and 80';
        } else {
          delete newErrors.age;
        }
        break;
      case 'level':
        if (!value) {
          newErrors.level = 'Please select a fitness level';
        } else {
          delete newErrors.level;
        }
        break;
      case 'goal':
        if (!value) {
          newErrors.goal = 'Please select a fitness goal';
        } else {
          delete newErrors.goal;
        }
        break;
      case 'days':
        if (!value || value < 1 || value > 7) {
          newErrors.days = 'Days per week must be between 1 and 7';
        } else {
          delete newErrors.days;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === 'age' || name === 'days' ? 
      parseInt(value) || '' : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Validate field if it has been touched
    if (touched[name]) {
      validateField(name, processedValue);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      age: true,
      level: true,
      goal: true,
      days: true
    });

    try {
      // Validate all fields
      validateFormData(formData, ['age', 'level', 'goal', 'days']);
      
      // Additional custom validation
      const validLevels = ["beginner", "intermediate", "advanced"];
      const validGoals = ["lose_weight", "gain_muscle", "stay_fit"];
      
      if (!validLevels.includes(formData.level)) {
        throw new AppError(ERROR_TYPES.VALIDATION, 'Please select a valid fitness level');
      }
      
      if (!validGoals.includes(formData.goal)) {
        throw new AppError(ERROR_TYPES.VALIDATION, 'Please select a valid fitness goal');
      }

      // Clear any previous errors
      setErrors({});
      
      // Save form data for next time
      // This would be handled by the parent component
      
      // Submit form
      await onGenerate(formData);
      
    } catch (error) {
      if (error.type === ERROR_TYPES.VALIDATION) {
        // Handle validation errors
        console.error('Validation error:', error.message);
      } else {
        // Re-throw other errors to be handled by parent
        throw error;
      }
    }
  };

  const isFormValid = Object.keys(errors).length === 0 && 
    formData.age && formData.level && formData.goal && formData.days;

  return (
    <form className="routine-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="age">
          Age:
          <input
            id="age"
            name="age"
            type="number"
            min="10"
            max="80"
            value={formData.age}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled || isGenerating}
            className={errors.age && touched.age ? 'error' : ''}
            required
            aria-describedby={errors.age ? 'age-error' : undefined}
          />
          {errors.age && touched.age && (
            <span id="age-error" className="error-message" role="alert">
              {errors.age}
            </span>
          )}
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="level">
          Fitness Level:
          <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled || isGenerating}
            className={errors.level && touched.level ? 'error' : ''}
            required
            aria-describedby={errors.level ? 'level-error' : undefined}
          >
            <option value="">Select level...</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          {errors.level && touched.level && (
            <span id="level-error" className="error-message" role="alert">
              {errors.level}
            </span>
          )}
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="goal">
          Fitness Goal:
          <select
            id="goal"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled || isGenerating}
            className={errors.goal && touched.goal ? 'error' : ''}
            required
            aria-describedby={errors.goal ? 'goal-error' : undefined}
          >
            <option value="">Select goal...</option>
            <option value="lose_weight">Lose Weight</option>
            <option value="gain_muscle">Gain Muscle</option>
            <option value="stay_fit">Stay Fit</option>
          </select>
          {errors.goal && touched.goal && (
            <span id="goal-error" className="error-message" role="alert">
              {errors.goal}
            </span>
          )}
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="days">
          Days per week:
          <input
            id="days"
            name="days"
            type="number"
            min="1"
            max="7"
            value={formData.days}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled || isGenerating}
            className={errors.days && touched.days ? 'error' : ''}
            required
            aria-describedby={errors.days ? 'days-error' : undefined}
          />
          {errors.days && touched.days && (
            <span id="days-error" className="error-message" role="alert">
              {errors.days}
            </span>
          )}
        </label>
      </div>

      {/* Form Summary for Screen Readers */}
      <div className="sr-only" aria-live="polite">
        {Object.keys(errors).length > 0 && 
          `Form has ${Object.keys(errors).length} error(s). Please review and correct.`
        }
      </div>

      <button
        type="submit"
        disabled={disabled || isGenerating || !isFormValid}
        className={`submit-button ${isGenerating ? 'generating' : ''}`}
        aria-describedby="submit-help"
      >
        {isGenerating ? (
          <>
            <span className="spinner-small"></span>
            Generating...
          </>
        ) : (
          'Generate Routine'
        )}
      </button>
      
      <div id="submit-help" className="help-text">
        {isGenerating 
          ? 'Please wait while we create your personalized routine...'
          : 'Click to generate a workout routine based on your preferences'
        }
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="keyboard-shortcuts">
        <small>
          💡 Tip: Use Tab to navigate, Enter to submit, Escape to clear errors
        </small>
      </div>
    </form>
  );
}

export default RoutineForm;