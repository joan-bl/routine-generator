import React from "react";

// Recordatorios de descanso activo
function ActiveBreaksReminder({ onRemind }) {
  return (
    <div className="active-breaks-reminder">
      <h3>¡Hora de moverse!</h3>
      <p>Recuerda hacer una pausa activa para mejorar tu salud.</p>
      <button onClick={onRemind}>Hecho</button>
    </div>
  );
}

export default ActiveBreaksReminder;
