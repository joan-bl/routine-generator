// Algorithmic routine generator for personalized workout routines
const EXERCISES = {
  beginner: {
    lose_weight: [
      "Brisk walk 20 min",
      "Squats 3x12",
      "Knee push-ups 3x10",
      "Crunches 3x15",
      "Stretching 10 min"
    ],
    gain_muscle: [
      "Squats 4x10",
      "Push-ups 4x8",
      "Chair dips 3x10",
      "Plank 3x20s",
      "Lunges 3x10"
    ],
    stay_fit: [
      "Light walk 15 min",
      "Jumping jacks 3x15",
      "Plank 3x15s",
      "Stretching 10 min"
    ]
  },
  intermediate: {
    lose_weight: [
      "Running 25 min",
      "Burpees 3x12",
      "Mountain climbers 3x20",
      "Bicycle crunches 3x20",
      "Stretching 10 min"
    ],
    gain_muscle: [
      "Jump squats 4x12",
      "Push-ups 4x12",
      "Assisted pull-ups 3x8",
      "Side plank 3x30s",
      "Lunges 4x12"
    ],
    stay_fit: [
      "Light jog 20 min",
      "Push-ups 3x12",
      "Plank 3x30s",
      "Stretching 10 min"
    ]
  },
  advanced: {
    lose_weight: [
      "HIIT workout 30 min",
      "Burpees 4x15",
      "Sprint intervals 6x30s",
      "V-ups 4x20",
      "Stretching 15 min"
    ],
    gain_muscle: [
      "Weighted squats 5x8",
      "Decline push-ups 5x10",
      "Pull-ups 4x10",
      "Weighted plank 4x40s",
      "Jump lunges 4x12"
    ],
    stay_fit: [
      "Running 30 min",
      "Push-ups 4x15",
      "Plank 4x40s",
      "Stretching 15 min"
    ]
  }
};

function generateRoutine({ age, level, goal, days, feedback, nutrition }) {
  // Robust parameter validation
  if (!level || !goal || !EXERCISES[level] || !EXERCISES[level][goal]) {
    throw new Error("Invalid level or goal. Please check your selection.");
  }
  let base = EXERCISES[level][goal];

  // Personalization based on previous feedback
  if (feedback && feedback.difficulty) {
    if (feedback.difficulty === 'easy') {
      // Increase intensity if previous workout was too easy
      base = base.map(exercise => 
        exercise.replace(/(\d+)x(\d+)/g, (match, sets, reps) => 
          `${sets}x${Math.ceil(Number(reps) * 1.2)}`
        ).replace(/(\d+)\s*min/g, (match, time) => 
          `${Math.ceil(Number(time) * 1.1)} min`
        ).replace(/(\d+)x(\d+)s/g, (match, sets, seconds) => 
          `${sets}x${Math.ceil(Number(seconds) * 1.2)}s`
        )
      );
    } else if (feedback.difficulty === 'hard') {
      // Decrease intensity if previous workout was too hard
      base = base.map(exercise => 
        exercise.replace(/(\d+)x(\d+)/g, (match, sets, reps) => 
          `${sets}x${Math.max(1, Math.floor(Number(reps) * 0.8))}`
        ).replace(/(\d+)\s*min/g, (match, time) => 
          `${Math.max(5, Math.floor(Number(time) * 0.9))} min`
        ).replace(/(\d+)x(\d+)s/g, (match, sets, seconds) => 
          `${sets}x${Math.max(10, Math.floor(Number(seconds) * 0.8))}s`
        )
      );
    }
  }

  // Personalization based on nutrition goals
  if (nutrition && nutrition.goal === 'lose_weight' && nutrition.calories < 1800) {
    // Slightly reduce intensity for low-calorie diets to prevent overexertion
    base = base.map(exercise => 
      exercise.replace(/(\d+)x(\d+)/g, (match, sets, reps) => 
        `${sets}x${Math.max(1, Math.floor(Number(reps) * 0.85))}`
      )
    );
  } else if (nutrition && nutrition.goal === 'gain_muscle' && nutrition.calories > 2500) {
    // Increase intensity for high-calorie muscle-building diets
    base = base.map(exercise => 
      exercise.replace(/(\d+)x(\d+)/g, (match, sets, reps) => 
        `${sets}x${Math.ceil(Number(reps) * 1.1)}`
      )
    );
  }

  // Age-based adjustments
  if (age > 50) {
    // Add more stretching and reduce high-impact exercises for older users
    base = base.map(exercise => {
      if (exercise.includes('Burpees') || exercise.includes('Jump')) {
        return exercise.replace(/(\d+)x(\d+)/g, (match, sets, reps) => 
          `${sets}x${Math.max(1, Math.floor(Number(reps) * 0.7))}`
        );
      }
      if (exercise.includes('Stretching')) {
        return exercise.replace(/(\d+)\s*min/g, (match, time) => 
          `${Math.ceil(Number(time) * 1.3)} min`
        );
      }
      return exercise;
    });
  } else if (age < 25) {
    // Increase intensity for younger users
    base = base.map(exercise => {
      if (!exercise.includes('Stretching')) {
        return exercise.replace(/(\d+)x(\d+)/g, (match, sets, reps) => 
          `${sets}x${Math.ceil(Number(reps) * 1.05)}`
        );
      }
      return exercise;
    });
  }

  // Distribute exercises across the days
  const routine = [];
  for (let i = 0; i < days; i++) {
    // Rotate exercises to provide variety across days
    const dayExercises = base.slice((i * 2) % base.length)
      .concat(base.slice(0, (i * 2) % base.length));
    routine.push(dayExercises);
  }
  
  return routine;
}

export default generateRoutine;