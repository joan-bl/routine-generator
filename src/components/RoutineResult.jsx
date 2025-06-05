import React, { useState, useEffect } from "react";
import CameraExerciseTracker from "./CameraExerciseTracker";
import { useApp } from "../context/AppContext";

function RoutineResult({ routine, onComplete, showCamera, onToggleCamera }) {
  const { actions } = useApp();
  const [completedExercises, setCompletedExercises] = useState(new Set());
  const [currentExercise, setCurrentExercise] = useState(null);
  const [feedback, setFeedback] = useState({
    difficulty: 'normal',
    enjoyment: 5,
    notes: '',
    completedExercises: []
  });
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [exerciseTimer, setExerciseTimer] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Timer functionality
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Auto-save progress
  useEffect(() => {
    if (completedExercises.size > 0) {
      const completedList = Array.from(completedExercises);
      setFeedback(prev => ({
        ...prev,
        completedExercises: completedList
      }));
    }
  }, [completedExercises]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    actions.addNotification({
      type: 'info',
      message: 'Workout timer started!',
      duration: 2000
    });
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    actions.addNotification({
      type: 'success',
      message: `Workout completed in ${formatTime(timeElapsed)}!`,
      duration: 3000
    });
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeElapsed(0);
  };

  const handleExerciseComplete = (dayIndex, exerciseIndex, exerciseName) => {
    const exerciseId = `${dayIndex}-${exerciseIndex}`;
    const newCompleted = new Set(completedExercises);
    
    if (newCompleted.has(exerciseId)) {
      newCompleted.delete(exerciseId);
      actions.addNotification({
        type: 'info',
        message: `${exerciseName} marked as incomplete`,
        duration: 2000
      });
    } else {
      newCompleted.add(exerciseId);
      actions.addNotification({
        type: 'success',
        message: `${exerciseName} completed! 🎉`,
        duration: 2000
      });
    }
    
    setCompletedExercises(newCompleted);
  };

  const openCameraForExercise = (exerciseName) => {
    setCurrentExercise(exerciseName);
    onToggleCamera();
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    
    const finalFeedback = {
      ...feedback,
      completionRate: (completedExercises.size / getTotalExercises()) * 100,
      duration: timeElapsed,
      timestamp: new Date().toISOString()
    };
    
    onComplete(finalFeedback);
    setShowFeedbackForm(false);
    
    actions.addNotification({
      type: 'success',
      message: 'Feedback submitted! Great job! 💪',
      duration: 3000
    });
  };

  const getTotalExercises = () => {
    return routine.reduce((total, day) => total + day.length, 0);
  };

  const getCompletionPercentage = () => {
    const total = getTotalExercises();
    return total > 0 ? Math.round((completedExercises.size / total) * 100) : 0;
  };

  const handleFeedbackChange = (field, value) => {
    setFeedback(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="routine-result">
      {/* Header with progress */}
      <div className="routine-header">
        <h2>Your Personalized Routine</h2>
        <div className="routine-stats">
          <div className="stat">
            <span className="stat-value">{completedExercises.size}</span>
            <span className="stat-label">/{getTotalExercises()} Exercises</span>
          </div>
          <div className="stat">
            <span className="stat-value">{getCompletionPercentage()}%</span>
            <span className="stat-label">Complete</span>
          </div>
          <div className="stat">
            <span className="stat-value">{formatTime(timeElapsed)}</span>
            <span className="stat-label">Time</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${getCompletionPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Timer controls */}
      <div className="timer-controls">
        <button
          onClick={isTimerRunning ? stopTimer : startTimer}
          className={`timer-button ${isTimerRunning ? 'stop' : 'start'}`}
        >
          {isTimerRunning ? '⏸️ Pause' : '▶️ Start'} Workout
        </button>
        <button onClick={resetTimer} className="timer-reset">
          🔄 Reset Timer
        </button>
      </div>

      {/* Routine content */}
      <div className="routine-content">
        {routine.map((day, dayIndex) => (
          <div key={dayIndex} className="day-section">
            <h3 className="day-title">Day {dayIndex + 1}</h3>
            <ul className="exercise-list">
              {day.map((exercise, exerciseIndex) => {
                const exerciseId = `${dayIndex}-${exerciseIndex}`;
                const isCompleted = completedExercises.has(exerciseId);
                
                return (
                  <li 
                    key={exerciseIndex} 
                    className={`exercise-item ${isCompleted ? 'completed' : ''}`}
                  >
                    <div className="exercise-content">
                      <span className="exercise-name">{exercise}</span>
                      
                      <div className="exercise-actions">
                        {/* Complete checkbox */}
                        <button
                          onClick={() => handleExerciseComplete(dayIndex, exerciseIndex, exercise)}
                          className={`complete-button ${isCompleted ? 'completed' : ''}`}
                          title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                          {isCompleted ? '✅' : '⭕'}
                        </button>
                        
                        {/* Camera button */}
                        <button
                          onClick={() => openCameraForExercise(exercise)}
                          className="camera-button"
                          title="Use AI to track this exercise"
                        >
                          📹 Track
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="routine-actions-main">
        <button
          onClick={() => setShowFeedbackForm(true)}
          className="feedback-button"
          disabled={completedExercises.size === 0}
        >
          📝 Complete Workout
        </button>
        
        <button
          onClick={() => openCameraForExercise('General Workout')}
          className="camera-main-button"
        >
          📹 AI Exercise Tracker
        </button>
      </div>

      {/* Feedback Form Modal */}
      {showFeedbackForm && (
        <div className="modal-overlay" onClick={() => setShowFeedbackForm(false)}>
          <div className="feedback-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Workout Feedback</h3>
              <button 
                onClick={() => setShowFeedbackForm(false)} 
                className="modal-close"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleFeedbackSubmit} className="feedback-form">
              <div className="form-group">
                <label>How difficult was this workout?</label>
                <select
                  value={feedback.difficulty}
                  onChange={(e) => handleFeedbackChange('difficulty', e.target.value)}
                  required
                >
                  <option value="easy">Too Easy</option>
                  <option value="normal">Just Right</option>
                  <option value="hard">Too Difficult</option>
                </select>
              </div>

              <div className="form-group">
                <label>How much did you enjoy it? ({feedback.enjoyment}/10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={feedback.enjoyment}
                  onChange={(e) => handleFeedbackChange('enjoyment', parseInt(e.target.value))}
                  className="enjoyment-slider"
                />
                <div className="slider-labels">
                  <span>Not at all</span>
                  <span>Loved it!</span>
                </div>
              </div>

              <div className="form-group">
                <label>Additional notes (optional):</label>
                <textarea
                  value={feedback.notes}
                  onChange={(e) => handleFeedbackChange('notes', e.target.value)}
                  placeholder="Any thoughts about the workout, exercises you'd like to see more of, etc."
                  rows="3"
                />
              </div>

              <div className="workout-summary">
                <h4>Workout Summary</h4>
                <p>Exercises completed: {completedExercises.size}/{getTotalExercises()}</p>
                <p>Time spent: {formatTime(timeElapsed)}</p>
                <p>Completion rate: {getCompletionPercentage()}%</p>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-feedback">
                  Submit Feedback
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowFeedbackForm(false)}
                  className="cancel-feedback"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      <CameraExerciseTracker
        isOpen={showCamera}
        onClose={onToggleCamera}
        exercise={currentExercise}
      />

      {/* Motivational messages based on progress */}
      {getCompletionPercentage() === 100 && (
        <div className="completion-celebration">
          🎉 Amazing! You've completed your entire workout! 🎉
        </div>
      )}
      
      {getCompletionPercentage() >= 50 && getCompletionPercentage() < 100 && (
        <div className="progress-encouragement">
          💪 Great progress! You're more than halfway there!
        </div>
      )}
    </div>
  );
}

export default RoutineResult;