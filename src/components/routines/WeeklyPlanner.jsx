import React from "react";

// Planificación semanal automatizada
function WeeklyPlanner({ weekPlan, onEdit }) {
  return (
    <div className="weekly-planner">
      <h3>Planificación Semanal</h3>
      <ul>
        {weekPlan.map((day, idx) => (
          <li key={idx}>
            <strong>{day.day}:</strong> {day.activities.join(", ")}
            <button onClick={() => onEdit(idx)}>Editar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WeeklyPlanner;
