import React from "react";

// Modal para reconocimiento de movimiento (estructura para IA futura)
function CameraModal({ onClose }) {
  return (
    <div className="camera-modal">
      <div className="camera-header">
        <span>Reconocimiento de movimiento (demo)</span>
        <button onClick={onClose}>&times;</button>
      </div>
      <div className="camera-feed">
        {/* Aquí se integraría la cámara y la IA real (MediaPipe/TensorFlow.js) */}
        <p>La cámara se activaría aquí para contar repeticiones y corregir postura (demo visual).</p>
        <video autoPlay playsInline width="320" height="240" style={{background:'#eee',borderRadius:'8px'}}></video>
      </div>
    </div>
  );
}

export default CameraModal;
