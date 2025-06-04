import React from "react";

// Rutinas sin equipamiento
function EquipmentFreeRoutine({ routine }) {
  return (
    <div className="equipment-free-routine">
      <h3>Rutina sin Equipamiento</h3>
      <ul>
        {routine.map((exercise, idx) => (
          <li key={idx}>{exercise}</li>
        ))}
      </ul>
    </div>
  );
}

export default EquipmentFreeRoutine;
