import React, { useState } from "react";
import RoutineForm from "./components/RoutineForm";
import RoutineResult from "./components/RoutineResult";
import { getUserProgress, saveUserProgress } from "./utils/personalization";
import generateRoutine from "./utils/routineGenerator";
import "./App.css";

const MOTIVATIONAL_QUOTES = [
  "Today is a great day to improve yourself!",
  "Every workout brings you closer to your best version.",
  "Consistency is the key to success.",
  "Don't give up, your effort is worth it!",
  "Pain is temporary, pride is forever.",
  "Let's go, you can do it!"
];

function App() {
  const [routine, setRoutine] = useState(null);
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [userState, setUserState] = useState(() => getUserProgress());

  // Guardar progreso y feedback tras cada rutina
  const handleRoutineComplete = (feedback) => {
    const updated = {
      ...userState,
      feedback: [feedback, ...(userState.feedback || [])],
      lastRoutine: routine,
      lastCompleted: new Date().toISOString(),
    };
    setUserState(updated);
    saveUserProgress(updated);
  };

  // Generar rutina personalizada según progreso, ánimo y energía
  const handleGenerate = (formData) => {
    const { age, level, goal, days } = formData;
    const params = { age, level, goal, days };
    const feedback = (userState.feedback && userState.feedback[0]) || null;
    const nutrition = userState.nutrition || null;
    if (feedback) params.feedback = feedback;
    if (nutrition) params.nutrition = nutrition;
    const newRoutine = generateRoutine(params);
    setRoutine(newRoutine);
    setHistory(prev => [{ date: new Date(), routine: newRoutine }, ...prev]);
    // Guardar rutina generada
    saveUserProgress({ ...userState, lastRoutine: newRoutine });
  };

  const handleRestart = () => {
    setRoutine(null);
    setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
  };

  // Compartir rutina (copiar al portapapeles)
  const handleShare = () => {
    if (!routine) return;
    const text = routine.map((day, idx) => `Day ${idx + 1}:\n- ${day.join("\n- ")}`).join("\n\n");
    navigator.clipboard.writeText(`My personalized routine:\n\n${text}`);
    alert("Routine copied to clipboard!");
  };

  // Descargar rutina como archivo de texto
  const handleDownload = () => {
    if (!routine) return;
    const text = routine.map((day, idx) => `Day ${idx + 1}:\n- ${day.join("\n- ")}`).join("\n\n");
    const blob = new Blob([`My personalized routine:\n\n${text}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my_routine.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
      <h1>Workout Routine Generator</h1>
      {!routine && <RoutineForm onGenerate={handleGenerate} />}
      {routine && (
        <>
          <RoutineResult routine={routine} onComplete={handleRoutineComplete} />
          <div className="routine-actions">
            <button onClick={handleShare} title="Share routine">Share</button>
            <button onClick={handleDownload} title="Download routine">Download</button>
            <button onClick={() => setShowHistory(h => !h)} title="View history">
              {showHistory ? "Hide history" : "View history"}
            </button>
          </div>
        </>
      )}
      <div className="motivational">{quote}</div>
      {routine && (
        <button className="fab-restart" title="Restart" onClick={handleRestart}>
          &#8634;
        </button>
      )}
      {showHistory && history.length > 0 && (
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
        </div>
      )}
    </div>
  );
}

export default App;