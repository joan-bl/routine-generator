import React from "react";

// Gráfico de progreso del usuario (estructura base)
function ProgressChart({ data }) {
  // Aquí podrías integrar una librería como Chart.js o Recharts
  return (
    <div className="progress-chart">
      <h3>Progreso</h3>
      <p>Gráficos y estadísticas de tu evolución aparecerán aquí.</p>
      {/* TODO: Mostrar gráfico real con los datos */}
    </div>
  );
}

export default ProgressChart;
