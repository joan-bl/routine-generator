import React from "react";

// Desafíos semanales para gamificación
function WeeklyChallenges({ challenges, onComplete }) {
  return (
    <div className="weekly-challenges">
      <h3>Desafíos Semanales</h3>
      <ul>
        {challenges.map((ch, idx) => (
          <li key={idx}>
            {ch.text}
            {!ch.completed && <button onClick={() => onComplete(idx)}>Completar</button>}
            {ch.completed && <span>✔️</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WeeklyChallenges;
