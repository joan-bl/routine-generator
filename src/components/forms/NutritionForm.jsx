import React from "react";
import { getUserProgress, saveUserProgress } from "../utils/personalization";

// Planes de nutrición personalizados
function NutritionForm({ onSubmit }) {
  const [preferences, setPreferences] = React.useState("");
  const [goal, setGoal] = React.useState("");
  const [allergies, setAllergies] = React.useState("");
  const [calories, setCalories] = React.useState(2000);
  const [feedback, setFeedback] = React.useState("");

  // Cargar progreso previo si existe
  React.useEffect(() => {
    const userData = getUserProgress();
    if (userData && userData.nutrition) {
      setPreferences(userData.nutrition.preferences || "");
      setGoal(userData.nutrition.goal || "");
      setAllergies(userData.nutrition.allergies || "");
      setCalories(userData.nutrition.calories || 2000);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Guardar progreso personalizado
    saveUserProgress({
      nutrition: { preferences, goal, allergies, calories },
    });
    setFeedback("¡Plan de nutrición guardado y personalizado!");
    if (onSubmit) onSubmit({ preferences, goal, allergies, calories });
  };

  return (
    <form className="nutrition-form" onSubmit={handleSubmit}>
      <h3>Plan de Nutrición</h3>
      <label>
        Preferencias alimenticias:
        <input
          type="text"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          placeholder="Vegetariano, vegano, sin gluten, etc."
        />
      </label>
      <label>
        Objetivo nutricional:
        <select value={goal} onChange={(e) => setGoal(e.target.value)}>
          <option value="">Selecciona...</option>
          <option value="lose_weight">Perder peso</option>
          <option value="gain_muscle">Ganar músculo</option>
          <option value="stay_fit">Mantenerse en forma</option>
        </select>
      </label>
      <label>
        Alergias o restricciones:
        <input
          type="text"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          placeholder="Frutos secos, lactosa, etc."
        />
      </label>
      <label>
        Calorías diarias objetivo:
        <input
          type="number"
          min="1000"
          max="5000"
          value={calories}
          onChange={(e) => setCalories(Number(e.target.value))}
        />
      </label>
      <button type="submit">Guardar plan</button>
      {feedback && <div className="feedback">{feedback}</div>}
    </form>
  );
}

export default NutritionForm;
