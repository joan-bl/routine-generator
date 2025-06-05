import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getUserProgress, saveUserProgress } from '../utils/personalization';
import { AppError, ERROR_TYPES } from '../utils/errorUtils';

// Initial state
const initialState = {
  user: {
    progress: {},
    preferences: {},
    stats: {
      totalWorkouts: 0,
      totalDays: 0,
      streak: 0,
      points: 0
    }
  },
  routine: {
    current: null,
    history: [],
    isGenerating: false
  },
  ui: {
    currentView: 'form', // 'form', 'routine', 'history', 'settings'
    showHistory: false,
    showCamera: false,
    notifications: [],
    theme: 'light'
  },
  challenges: {
    weekly: [],
    completed: []
  },
  error: null,
  loading: false
};

// Action types
export const ACTION_TYPES = {
  // User actions
  SET_USER_PROGRESS: 'SET_USER_PROGRESS',
  UPDATE_USER_STATS: 'UPDATE_USER_STATS',
  COMPLETE_WORKOUT: 'COMPLETE_WORKOUT',
  
  // Routine actions
  SET_ROUTINE: 'SET_ROUTINE',
  ADD_TO_HISTORY: 'ADD_TO_HISTORY',
  CLEAR_ROUTINE: 'CLEAR_ROUTINE',
  SET_GENERATING: 'SET_GENERATING',
  
  // UI actions
  SET_VIEW: 'SET_VIEW',
  TOGGLE_HISTORY: 'TOGGLE_HISTORY',
  TOGGLE_CAMERA: 'TOGGLE_CAMERA',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  SET_THEME: 'SET_THEME',
  
  // Challenge actions
  SET_CHALLENGES: 'SET_CHALLENGES',
  COMPLETE_CHALLENGE: 'COMPLETE_CHALLENGE',
  
  // Error handling
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_USER_PROGRESS:
      return {
        ...state,
        user: {
          ...state.user,
          progress: action.payload
        }
      };

    case ACTION_TYPES.UPDATE_USER_STATS:
      return {
        ...state,
        user: {
          ...state.user,
          stats: {
            ...state.user.stats,
            ...action.payload
          }
        }
      };

    case ACTION_TYPES.COMPLETE_WORKOUT:
      const newStats = {
        ...state.user.stats,
        totalWorkouts: state.user.stats.totalWorkouts + 1,
        points: state.user.stats.points + (action.payload.points || 10),
        streak: action.payload.maintainedStreak ? state.user.stats.streak + 1 : 1
      };
      return {
        ...state,
        user: {
          ...state.user,
          stats: newStats
        }
      };

    case ACTION_TYPES.SET_ROUTINE:
      return {
        ...state,
        routine: {
          ...state.routine,
          current: action.payload,
          isGenerating: false
        },
        ui: {
          ...state.ui,
          currentView: 'routine'
        }
      };

    case ACTION_TYPES.ADD_TO_HISTORY:
      return {
        ...state,
        routine: {
          ...state.routine,
          history: [action.payload, ...state.routine.history.slice(0, 9)] // Keep only last 10
        }
      };

    case ACTION_TYPES.CLEAR_ROUTINE:
      return {
        ...state,
        routine: {
          ...state.routine,
          current: null
        },
        ui: {
          ...state.ui,
          currentView: 'form'
        }
      };

    case ACTION_TYPES.SET_GENERATING:
      return {
        ...state,
        routine: {
          ...state.routine,
          isGenerating: action.payload
        }
      };

    case ACTION_TYPES.SET_VIEW:
      return {
        ...state,
        ui: {
          ...state.ui,
          currentView: action.payload
        }
      };

    case ACTION_TYPES.TOGGLE_HISTORY:
      return {
        ...state,
        ui: {
          ...state.ui,
          showHistory: !state.ui.showHistory
        }
      };

    case ACTION_TYPES.TOGGLE_CAMERA:
      return {
        ...state,
        ui: {
          ...state.ui,
          showCamera: !state.ui.showCamera
        }
      };

    case ACTION_TYPES.ADD_NOTIFICATION:
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: [...state.ui.notifications, {
            id: Date.now(),
            ...action.payload
          }]
        }
      };

    case ACTION_TYPES.REMOVE_NOTIFICATION:
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(n => n.id !== action.payload)
        }
      };

    case ACTION_TYPES.SET_THEME:
      return {
        ...state,
        ui: {
          ...state.ui,
          theme: action.payload
        }
      };

    case ACTION_TYPES.SET_CHALLENGES:
      return {
        ...state,
        challenges: {
          ...state.challenges,
          weekly: action.payload
        }
      };

    case ACTION_TYPES.COMPLETE_CHALLENGE:
      const challengeIndex = action.payload;
      const updatedChallenges = [...state.challenges.weekly];
      updatedChallenges[challengeIndex] = {
        ...updatedChallenges[challengeIndex],
        completed: true
      };
      return {
        ...state,
        challenges: {
          ...state.challenges,
          weekly: updatedChallenges,
          completed: [...state.challenges.completed, updatedChallenges[challengeIndex]]
        }
      };

    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load user progress on mount
  useEffect(() => {
    try {
      const userProgress = getUserProgress();
      if (userProgress) {
        dispatch({
          type: ACTION_TYPES.SET_USER_PROGRESS,
          payload: userProgress
        });
      }
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: new AppError(ERROR_TYPES.STORAGE, 'Error loading user data')
      });
    }
  }, []);

  // Auto-save user progress
  useEffect(() => {
    if (state.user.progress && Object.keys(state.user.progress).length > 0) {
      try {
        saveUserProgress(state.user.progress);
      } catch (error) {
        console.error('Error saving user progress:', error);
      }
    }
  }, [state.user.progress]);

  // Action creators
  const actions = {
    setUserProgress: (progress) => 
      dispatch({ type: ACTION_TYPES.SET_USER_PROGRESS, payload: progress }),

    updateUserStats: (stats) => 
      dispatch({ type: ACTION_TYPES.UPDATE_USER_STATS, payload: stats }),

    completeWorkout: (workoutData) => 
      dispatch({ type: ACTION_TYPES.COMPLETE_WORKOUT, payload: workoutData }),

    setRoutine: (routine) => {
      dispatch({ type: ACTION_TYPES.SET_ROUTINE, payload: routine });
      dispatch({ 
        type: ACTION_TYPES.ADD_TO_HISTORY, 
        payload: { date: new Date(), routine } 
      });
    },

    clearRoutine: () => 
      dispatch({ type: ACTION_TYPES.CLEAR_ROUTINE }),

    setGenerating: (isGenerating) => 
      dispatch({ type: ACTION_TYPES.SET_GENERATING, payload: isGenerating }),

    setView: (view) => 
      dispatch({ type: ACTION_TYPES.SET_VIEW, payload: view }),

    toggleHistory: () => 
      dispatch({ type: ACTION_TYPES.TOGGLE_HISTORY }),

    toggleCamera: () => 
      dispatch({ type: ACTION_TYPES.TOGGLE_CAMERA }),

    addNotification: (notification) => 
      dispatch({ type: ACTION_TYPES.ADD_NOTIFICATION, payload: notification }),

    removeNotification: (id) => 
      dispatch({ type: ACTION_TYPES.REMOVE_NOTIFICATION, payload: id }),

    setTheme: (theme) => 
      dispatch({ type: ACTION_TYPES.SET_THEME, payload: theme }),

    setChallenges: (challenges) => 
      dispatch({ type: ACTION_TYPES.SET_CHALLENGES, payload: challenges }),

    completeChallenge: (index) => 
      dispatch({ type: ACTION_TYPES.COMPLETE_CHALLENGE, payload: index }),

    setError: (error) => 
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error }),

    clearError: () => 
      dispatch({ type: ACTION_TYPES.CLEAR_ERROR }),

    setLoading: (loading) => 
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading })
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;