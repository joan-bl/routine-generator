// utils/errorUtils.js
export const ERROR_TYPES = {
  VALIDATION: 'VALIDATION_ERROR',
  STORAGE: 'STORAGE_ERROR',
  GENERATION: 'GENERATION_ERROR',
  NETWORK: 'NETWORK_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

export const ERROR_MESSAGES = {
  [ERROR_TYPES.VALIDATION]: 'Please verify that all fields are correctly filled out.',
  [ERROR_TYPES.STORAGE]: 'Error saving or loading data. Please check that local storage is enabled.',
  [ERROR_TYPES.GENERATION]: 'Error generating routine. Please try with different parameters.',
  [ERROR_TYPES.NETWORK]: 'Connection error. Please check your internet connection.',
  [ERROR_TYPES.UNKNOWN]: 'An unexpected error occurred. Please try again.'
};

export class AppError extends Error {
  constructor(type, message, originalError = null) {
    super(message || ERROR_MESSAGES[type] || ERROR_MESSAGES[ERROR_TYPES.UNKNOWN]);
    this.name = 'AppError';
    this.type = type;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

export const handleError = (error, context = '') => {
  console.error(`Error in ${context}:`, error);
  
  // Determine error type
  let errorType = ERROR_TYPES.UNKNOWN;
  let userMessage = ERROR_MESSAGES[ERROR_TYPES.UNKNOWN];

  if (error instanceof AppError) {
    errorType = error.type;
    userMessage = error.message;
  } else if (error.name === 'QuotaExceededError') {
    errorType = ERROR_TYPES.STORAGE;
    userMessage = ERROR_MESSAGES[ERROR_TYPES.STORAGE];
  } else if (error.message?.includes('fetch') || error.message?.includes('network')) {
    errorType = ERROR_TYPES.NETWORK;
    userMessage = ERROR_MESSAGES[ERROR_TYPES.NETWORK];
  }

  return {
    type: errorType,
    message: userMessage,
    originalError: error,
    context,
    timestamp: new Date().toISOString()
  };
};

export const validateFormData = (data, requiredFields) => {
  const errors = [];
  
  requiredFields.forEach(field => {
    if (!data[field] || data[field] === '') {
      errors.push(`El campo ${field} es requerido`);
    }
  });

  if (data.age && (data.age < 10 || data.age > 80)) {
    errors.push('La edad debe estar entre 10 y 80 años');
  }

  if (data.days && (data.days < 1 || data.days > 7)) {
    errors.push('Los días por semana deben estar entre 1 y 7');
  }

  if (errors.length > 0) {
    throw new AppError(ERROR_TYPES.VALIDATION, errors.join('. '));
  }
};

export const safeExecute = async (fn, context = '') => {
  try {
    return await fn();
  } catch (error) {
    const handledError = handleError(error, context);
    throw new AppError(handledError.type, handledError.message, error);
  }
};