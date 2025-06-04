import React, { useState } from "react";

function RoutineResult({ routine }) {
  const [showCamera, setShowCamera] = useState(false);

  // Demo: structure for movement recognition (no real AI)
  const handleOpenCamera = () => {
    setShowCamera(true);
  };
  const handleCloseCamera = () => {
    setShowCamera(false);
  };

  return (
    <div className="routine-result">
      <h2>Your Personalized Routine</h2>
      <ul>
        {routine.map((day, idx) => (
          <li key={idx}>
            <strong>Day {idx + 1}:</strong>
            <ul>
              {day.map((exercise, i) => (
                <li key={i}>{exercise}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <button className="camera-btn" onClick={handleOpenCamera}>
        Count repetitions (demo)
      </button>
      {showCamera && (
        <div className="camera-modal">
          <div className="camera-header">
            <span>Movement recognition (demo)</span>
            <button onClick={handleCloseCamera}>&times;</button>
          </div>
          <div className="camera-feed">
            {/* Here you would integrate the camera and real AI (MediaPipe/TensorFlow.js) */}
            <p>
              The camera would activate here to count reps and correct posture
              (visual demo).
            </p>
            <video
              autoPlay
              playsInline
              width="320"
              height="240"
              style={{
                background: "#eee",
                borderRadius: "8px",
              }}
            ></video>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoutineResult;
