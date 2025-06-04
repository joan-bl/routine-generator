import React from "react";

// Soporte para poblaciones especiales
function SpecialPopulations({ populationType, onSelect }) {
  return (
    <div className="special-populations">
      <h3>Programas Especiales</h3>
      <p>Selecciona tu grupo para rutinas adaptadas:</p>
      <select onChange={e => onSelect(e.target.value)} value={populationType}>
        <option value="">Selecciona...</option>
        <option value="elderly">Personas mayores</option>
        <option value="beginners">Principiantes</option>
        <option value="medical">Condiciones médicas</option>
      </select>
    </div>
  );
}

export default SpecialPopulations;
