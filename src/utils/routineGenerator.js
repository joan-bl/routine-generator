// Algoritmo simple para generar rutinas de ejercicio personalizadas
const EXERCISES = {
  beginner: {
    lose_weight: [
      "Caminata rápida 20 min",
      "Sentadillas 3x12",
      "Flexiones de rodillas 3x10",
      "Abdominales 3x15",
      "Estiramientos 10 min"
    ],
    gain_muscle: [
      "Sentadillas 4x10",
      "Flexiones 4x8",
      "Fondos en silla 3x10",
      "Plancha 3x20s",
      "Zancadas 3x10"
    ],
    stay_fit: [
      "Caminata ligera 15 min",
      "Jumping Jacks 3x15",
      "Plancha 3x15s",
      "Estiramientos 10 min"
    ]
  },
  intermediate: {
    lose_weight: [
      "Correr 25 min",
      "Burpees 3x12",
      "Mountain climbers 3x20",
      "Abdominales bicicleta 3x20",
      "Estiramientos 10 min"
    ],
    gain_muscle: [
      "Sentadillas con salto 4x12",
      "Flexiones 4x12",
      "Dominadas asistidas 3x8",
      "Plancha lateral 3x30s",
      "Zancadas 4x12"
    ],
    stay_fit: [
      "Trote suave 20 min",
      "Flexiones 3x12",
      "Plancha 3x30s",
      "Estiramientos 10 min"
    ]
  },
  advanced: {
    lose_weight: [
      "HIIT 30 min",
      "Burpees 4x15",
      "Sprints 6x30s",
      "Abdominales V 4x20",
      "Estiramientos 15 min"
    ],
    gain_muscle: [
      "Sentadillas con peso 5x8",
      "Flexiones declinadas 5x10",
      "Dominadas 4x10",
      "Plancha con peso 4x40s",
      "Zancadas con salto 4x12"
    ],
    stay_fit: [
      "Correr 30 min",
      "Flexiones 4x15",
      "Plancha 4x40s",
      "Estiramientos 15 min"
    ]
  }
};

function generateRoutine({ age, level, goal, days, feedback, nutrition }) {
  // Validación robusta de parámetros
  if (!level || !goal || !EXERCISES[level] || !EXERCISES[level][goal]) {
    throw new Error("Nivel u objetivo no válidos. Por favor, revisa tu selección.");
  }
  let base = EXERCISES[level][goal];

  // Personalización por feedback previo
  if (feedback && feedback.difficulty) {
    if (feedback.difficulty === 'fácil') {
      base = base.map(ex => ex.replace(/\d+x(\d+)/, (m, n) => `${Math.ceil(Number(n)*1.2)}` + m.slice(m.indexOf('x'))));
    } else if (feedback.difficulty === 'difícil') {
      base = base.map(ex => ex.replace(/\d+x(\d+)/, (m, n) => `${Math.max(1, Math.floor(Number(n)*0.8))}` + m.slice(m.indexOf('x'))));
    }
  }

  // Personalización por nutrición (ejemplo: si el objetivo es perder peso y calorías objetivo < 1800, reduce repeticiones)
  if (nutrition && nutrition.goal === 'lose_weight' && nutrition.calories < 1800) {
    base = base.map(ex => ex.replace(/\d+x(\d+)/, (m, n) => `${Math.max(1, Math.floor(Number(n)*0.85))}` + m.slice(m.indexOf('x'))));
  }

  // Distribuye los ejercicios entre los días
  const routine = [];
  for (let i = 0; i < days; i++) {
    const dayExercises = base.slice(i % base.length).concat(base.slice(0, i % base.length));
    routine.push(dayExercises);
  }
  return routine;
}

export default generateRoutine;