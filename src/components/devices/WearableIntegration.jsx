import React from "react";

// Integración con dispositivos wearables
function WearableIntegration({ onSync }) {
  return (
    <div className="wearable-integration">
      <h3>Integración con Wearables</h3>
      <p>Sincroniza tus métricas de salud y ejercicio.</p>
      <button onClick={onSync}>Sincronizar</button>
    </div>
  );
}

export default WearableIntegration;
