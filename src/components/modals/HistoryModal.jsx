import React from "react";

// Modal to show routine history
function HistoryModal({ history, onClose }) {
  return (
    <div className="history-modal">
      <h3>Routine History</h3>
      <ul>
        {history.map((item, idx) => (
          <li key={idx}>
            <div className="history-date">{item.date.toLocaleString()}</div>
            <ul>
              {item.routine.map((day, i) => (
                <li key={i}><strong>Day {i + 1}:</strong> {day.join(", ")}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default HistoryModal;
