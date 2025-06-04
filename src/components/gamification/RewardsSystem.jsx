import React from "react";

// Sistema de recompensas y logros
function RewardsSystem({ points, achievements }) {
  return (
    <div className="rewards-system">
      <h3>Recompensas y Logros</h3>
      <div>Puntos: <strong>{points}</strong></div>
      <ul>
        {achievements.map((ach, idx) => (
          <li key={idx}>{ach}</li>
        ))}
      </ul>
    </div>
  );
}

export default RewardsSystem;
