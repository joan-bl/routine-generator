import React, { useState, useEffect } from "react";
import RoutineForm from "./components/RoutineForm";
import RoutineResult from "./components/RoutineResult";
import NotificationSystem from "./components/NotificationSystem";
import LoadingSpinner from "./components/LoadingSpinner";
import { useApp } from "./context/AppContext";
import { AppError, ERROR_TYPES, validateFormData, safeExecute } from "./utils/errorUtils";
import generateRoutine from "./utils/routineGenerator";
import "./App.css";

const MOTIVATIONAL_QUOTES = [
  "Today is a great day to improve yourself!",
  "Every workout brings you closer to your best version.",
  "Consistency is the key to success.",
  "Don't give up, your effort is worth it!",
  "Pain is temporary, pride is forever.",
  "Let's go, you can do it!",
  "Your only competition is who you were yesterday.",
  "Success starts with self-discipline.",
  "Make today count!",
  "Progress, not perfection."
];

function App() {
  const { state, actions } = useApp();
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  // Extract state for easier access
  const {
    routine: { current: routine, history, isGenerating },
    ui: { currentView, showHistory, showCamera, notifications },
    user: { progress: userState, stats },
    error,
    loading
  } = state;

  // Initialize random quote on mount
  useEffect(() => {
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setQuote(randomQuote);
  }, []);

  // Auto-generate weekly challenges
  useEffect(() => {
    const generateWeeklyChallenges = () => {
      const challenges = [
        { text: "Complete 5 workouts this week", completed: false, points: 50 },
        { text: "Try a new exercise", completed: false, points: 25 },
        { text: "Workout for 3 consecutive days", completed: false, points: 40 },
        { text: "Share your progress", completed: false, points: 20 }
      ];
      actions.setChallenges(challenges);
    };

    generateWeeklyChallenges();
  }, [actions]);

  // Handle routine completion and feedback
  const handleRoutineComplete = async (feedback) => {
    try {
      await safeExecute(async () => {
        // Calculate points based on feedback
        const points = feedback.difficulty === 'fácil' ? 15 : 
                     feedback.difficulty === 'normal' ? 10 : 5;

        // Update user stats
        actions.completeWorkout({ 
          points,
          maintainedStreak: true // This could be more sophisticated
        });

        // Update user progress with feedback
        const updatedProgress = {
          ...userState,
          feedback: [feedback, ...(userState.feedback || [])].slice(0, 10), // Keep last 10
          lastRoutine: routine,
          lastCompleted: new Date().toISOString(),
        };
        
        actions.setUserProgress(updatedProgress);

        // Show success notification
        actions.addNotification({
          type: 'success',
          message: `Workout completed! +${points} points`,
          duration: 3000
        });

        // Auto-remove notification
        setTimeout(() => {
          actions.removeNotification(Date.now());
        }, 3000);

      }, 'handleRoutineComplete');
    } catch (error) {
      actions.setError(error);
    }
  };

  // Generate personalized routine with enhanced error handling
  const handleGenerate = async (formData) => {
    try {
      // Validate form data
      validateFormData(formData, ['age', 'level', 'goal', 'days']);

      actions.setGenerating(true);
      actions.clearError();

      await safeExecute(async () => {
        const { age, level, goal, days } = formData;
        const params = { age, level, goal, days };
        
        // Add personalization data if available
        const feedback = (userState.feedback && userState.feedback[0]) || null;
        const nutrition = userState.nutrition || null;
        
        if (feedback) params.feedback = feedback;
        if (nutrition) params.nutrition = nutrition;

        // Generate routine with a small delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 500));
        const newRoutine = generateRoutine(params);
        
        // Set routine and add to history
        actions.setRoutine(newRoutine);

        // Show success notification
        actions.addNotification({
          type: 'success',
          message: 'Routine generated successfully!',
          duration: 2000
        });

        // Change motivational quote
        const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
        setQuote(randomQuote);

      }, 'generateRoutine');

    } catch (error) {
      actions.setError(error);
      actions.addNotification({
        type: 'error',
        message: error.message || 'Error al generar la rutina',
        duration: 5000
      });
    } finally {
      actions.setGenerating(false);
    }
  };

  // Handle restart with confirmation for unsaved progress
  const handleRestart = () => {
    if (routine && !userState.lastCompleted) {
      const confirmed = window.confirm('Are you sure you want to restart? You will lose current progress.');
      if (!confirmed) return;
    }

    actions.clearRoutine();
    actions.clearError();
    
    // Generate new motivational quote
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setQuote(randomQuote);
  };

  // Enhanced share functionality with error handling
  const handleShare = async () => {
    if (!routine) return;

    try {
      await safeExecute(async () => {
        const text = routine.map((day, idx) => 
          `Day ${idx + 1}:\n- ${day.join("\n- ")}`
        ).join("\n\n");
        
        const shareText = `My personalized routine:\n\n${text}\n\nGenerated with Workout Routine Generator 💪`;
        
        if (navigator.share) {
          // Use native share if available
          await navigator.share({
            title: 'My Workout Routine',
            text: shareText,
          });
        } else {
          // Fallback to clipboard
          await navigator.clipboard.writeText(shareText);
          actions.addNotification({
            type: 'success',
            message: 'Routine copied to clipboard!',
            duration: 2000
          });
        }
      }, 'shareRoutine');
    } catch (error) {
      actions.addNotification({
        type: 'error',
        message: 'Error al compartir la rutina',
        duration: 3000
      });
    }
  };

  // Enhanced download with more formats
  const handleDownload = async () => {
    if (!routine) return;

    try {
      await safeExecute(async () => {
        const text = routine.map((day, idx) => 
          `Day ${idx + 1}:\n- ${day.join("\n- ")}`
        ).join("\n\n");
        
        const content = `My Personalized Workout Routine\n${'='.repeat(35)}\n\n${text}\n\nGenerated on: ${new Date().toLocaleDateString()}\nTotal Days: ${routine.length}\n\nWorkout Routine Generator`;
        
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `workout-routine-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        actions.addNotification({
          type: 'success',
          message: 'Routine downloaded successfully!',
          duration: 2000
        });
      }, 'downloadRoutine');
    } catch (error) {
      actions.addNotification({
        type: 'error',
        message: 'Error al descargar la rutina',
        duration: 3000
      });
    }
  };

  // Handle challenge completion
  const handleCompleteChallenge = (challengeIndex) => {
    actions.completeChallenge(challengeIndex);
    actions.updateUserStats({ points: stats.points + 25 });
    actions.addNotification({
      type: 'success',
      message: 'Challenge completed! +25 points',
      duration: 2000
    });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'r':
            e.preventDefault();
            handleRestart();
            break;
          case 's':
            e.preventDefault();
            if (routine) handleShare();
            break;
          case 'd':
            e.preventDefault();
            if (routine) handleDownload();
            break;
          case 'h':
            e.preventDefault();
            actions.toggleHistory();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [routine, actions]);

  // Auto-save progress every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (userState && Object.keys(userState).length > 0) {
        // Auto-save logic is handled in context
        console.log('Auto-saving user progress...');
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [userState]);

  return (
    <div className="App" data-theme={state.ui.theme}>
      {/* Notification System */}
      <NotificationSystem notifications={notifications} />
      
      {/* Loading Spinner */}
      {(loading || isGenerating) && <LoadingSpinner />}
      
      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <span>{error.message}</span>
          <button onClick={actions.clearError} className="error-close">×</button>
        </div>
      )}

      {/* Header with Stats */}
      <header className="app-header">
        <h1>Workout Routine Generator</h1>
        {stats.points > 0 && (
          <div className="user-stats">
            <span className="points">🏆 {stats.points} pts</span>
            <span className="streak">🔥 {stats.streak} days</span>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="app-main">
        {currentView === 'form' && (
          <RoutineForm 
            onGenerate={handleGenerate} 
            isGenerating={isGenerating}
            disabled={loading}
          />
        )}
        
        {currentView === 'routine' && routine && (
          <>
            <RoutineResult 
              routine={routine} 
              onComplete={handleRoutineComplete}
              showCamera={showCamera}
              onToggleCamera={actions.toggleCamera}
            />
            <div className="routine-actions">
              <button 
                onClick={handleShare} 
                title="Share routine (Ctrl+S)"
                disabled={loading}
              >
                📤 Share
              </button>
              <button 
                onClick={handleDownload} 
                title="Download routine (Ctrl+D)"
                disabled={loading}
              >
                💾 Download
              </button>
              <button 
                onClick={actions.toggleHistory} 
                title="View history (Ctrl+H)"
                disabled={loading}
              >
                📅 {showHistory ? "Hide history" : "View history"}
              </button>
            </div>
          </>
        )}
      </main>

      {/* Motivational Quote */}
      <div className="motivational" key={quote}>
        {quote}
      </div>

      {/* Floating Action Button */}
      {routine && (
        <button 
          className="fab-restart" 
          title="Restart (Ctrl+R)" 
          onClick={handleRestart}
          disabled={loading}
        >
          &#8634;
        </button>
      )}

      {/* History Modal */}
      {showHistory && history.length > 0 && (
        <div className="modal-overlay" onClick={actions.toggleHistory}>
          <div className="history-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Routine History</h3>
              <button onClick={actions.toggleHistory} className="modal-close">×</button>
            </div>
            <div className="modal-content">
              <ul>
                {history.map((item, idx) => (
                  <li key={idx}>
                    <div className="history-date">
                      {item.date.toLocaleString()}
                    </div>
                    <ul>
                      {item.routine.map((day, i) => (
                        <li key={i}>
                          <strong>Day {i + 1}:</strong> {day.join(", ")}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Challenges */}
      {state.challenges.weekly.length > 0 && (
        <div className="weekly-challenges">
          <h3>🎯 Weekly Challenges</h3>
          <ul>
            {state.challenges.weekly.map((challenge, idx) => (
              <li key={idx} className={challenge.completed ? 'completed' : ''}>
                <span>{challenge.text}</span>
                {!challenge.completed && (
                  <button 
                    onClick={() => handleCompleteChallenge(idx)}
                    className="challenge-complete-btn"
                  >
                    Complete
                  </button>
                )}
                {challenge.completed && <span className="checkmark">✅</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Development Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="dev-info">
          <details>
            <summary>Debug Info</summary>
            <pre>{JSON.stringify(state, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
}

export default App;