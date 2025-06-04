import React from "react";

// Ejercicios de mindfulness (meditación y respiración)
function MindfulnessForm({ onSubmit }) {
  return (
    <form className="mindfulness-form">
      <h3>Mindfulness</h3>
      {/* TODO: Campos para elegir tipo de ejercicio, duración, etc. */}
      <button type="submit">Iniciar sesión</button>
    </form>
  );
}

export default MindfulnessForm;
