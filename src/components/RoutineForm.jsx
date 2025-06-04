import React, { useState } from "react";
import { getUserProgress, saveUserProgress } from "../utils/personalization";
import generateRoutine from "../utils/routineGenerator";

function RoutineForm({ onGenerate }) {
  const [age, setAge] = useState(25);
  const [level, setLevel] = useState("beginner");
  const [goal, setGoal] = useState("lose_weight");
  const [days, setDays] = useState(3);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!level || !goal) {
      alert("Please select a level and a goal.");
      return;
    }
    // Defensive: only pass non-null feedback/nutrition
    const validLevels = ["beginner", "intermediate", "advanced"];
    const validGoals = ["lose_weight", "gain_muscle", "stay_fit"];
    if (!validLevels.includes(level) || !validGoals.includes(goal)) {
      alert("Invalid level or goal selection. Please choose a valid option.");
      return;
    }
    const userData = getUserProgress();
    const params = { age, level, goal, days };
    const feedback = userData.feedback ? userData.feedback[0] : null;
    const nutrition = userData.nutrition || null;
    if (feedback) params.feedback = feedback;
    if (nutrition) params.nutrition = nutrition;
    try {
      const routine = generateRoutine(params);
      onGenerate(routine);
    } catch (err) {
      alert(err.message);
      console.error('Error generating routine:', err, params);
    }
  };

  return (
    <form className="routine-form" onSubmit={handleSubmit}>
      <div>
        <label>Age:
          <input type="number" min="10" max="80" value={age} onChange={e => setAge(Number(e.target.value))} required />
        </label>
      </div>
      <div>
        <label>Level:
          <select value={level} onChange={e => setLevel(e.target.value)}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
      </div>
      <div>
        <label>Goal:
          <select value={goal} onChange={e => setGoal(e.target.value)}>
            <option value="lose_weight">Lose weight</option>
            <option value="gain_muscle">Gain muscle</option>
            <option value="stay_fit">Stay fit</option>
          </select>
        </label>
      </div>
      <div>
        <label>Days per week:
          <input type="number" min="1" max="7" value={days} onChange={e => setDays(Number(e.target.value))} required />
        </label>
      </div>
      <button type="submit">Generate routine</button>
    </form>
  );
}

export default RoutineForm;
