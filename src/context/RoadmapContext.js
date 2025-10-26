import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  // Imported from Profile Evaluator
  profileData: null,

  // New data collected from questions
  currentSkills: [],
  timeline: null,

  // Generated roadmap
  roadmap: null,

  // UI state
  loading: false,
  error: null,
};

// Action types
const ActionTypes = {
  SET_PROFILE_DATA: 'SET_PROFILE_DATA',
  SET_CURRENT_SKILLS: 'SET_CURRENT_SKILLS',
  SET_TIMELINE: 'SET_TIMELINE',
  SET_ROADMAP: 'SET_ROADMAP',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  RESET_ROADMAP: 'RESET_ROADMAP',
};

// Reducer function
function roadmapReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_PROFILE_DATA:
      return { ...state, profileData: action.payload };

    case ActionTypes.SET_CURRENT_SKILLS:
      return { ...state, currentSkills: action.payload };

    case ActionTypes.SET_TIMELINE:
      return { ...state, timeline: action.payload };

    case ActionTypes.SET_ROADMAP:
      return { ...state, roadmap: action.payload, loading: false };

    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case ActionTypes.RESET_ROADMAP:
      return initialState;

    default:
      return state;
  }
}

// Create context
const RoadmapContext = createContext();

// Provider component
export function RoadmapProvider({ children }) {
  const [state, dispatch] = useReducer(roadmapReducer, initialState, (initial) => {
    // Try to load from localStorage
    try {
      const saved = localStorage.getItem('scalerRoadmapState');
      return saved ? JSON.parse(saved) : initial;
    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
      return initial;
    }
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('scalerRoadmapState', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
    }
  }, [state]);

  // Action creators
  const setProfileData = (data) => {
    dispatch({ type: ActionTypes.SET_PROFILE_DATA, payload: data });
  };

  const setCurrentSkills = (skills) => {
    dispatch({ type: ActionTypes.SET_CURRENT_SKILLS, payload: skills });
  };

  const setTimeline = (timeline) => {
    dispatch({ type: ActionTypes.SET_TIMELINE, payload: timeline });
  };

  const setRoadmap = (roadmap) => {
    dispatch({ type: ActionTypes.SET_ROADMAP, payload: roadmap });
  };

  const setLoading = (loading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  };

  const resetRoadmap = () => {
    dispatch({ type: ActionTypes.RESET_ROADMAP });
    localStorage.removeItem('scalerRoadmapState');
  };

  const value = {
    ...state,
    setProfileData,
    setCurrentSkills,
    setTimeline,
    setRoadmap,
    setLoading,
    setError,
    resetRoadmap,
  };

  return (
    <RoadmapContext.Provider value={value}>
      {children}
    </RoadmapContext.Provider>
  );
}

// Custom hook to use the context
export function useRoadmap() {
  const context = useContext(RoadmapContext);
  if (!context) {
    throw new Error('useRoadmap must be used within RoadmapProvider');
  }
  return context;
}

export default RoadmapContext;
