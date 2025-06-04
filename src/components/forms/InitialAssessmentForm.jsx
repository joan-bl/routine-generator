import React from "react";

// Formulario de evaluación inicial detallada
// Recopila objetivos, limitaciones físicas, disponibilidad y preferencias
function InitialAssessmentForm({ onSubmit }) {
  // Aquí iría el estado y lógica del formulario
  return (
    <form className="assessment-form">
      {/* TODO: Campos para objetivos, limitaciones, disponibilidad, preferencias */}
      <h2>Evaluación Inicial</h2>
      <p>Formulario para recopilar información detallada del usuario.</p>
      <button type="submit">Guardar evaluación</button>
    </form>
  );
}

export default InitialAssessmentForm;
