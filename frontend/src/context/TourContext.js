import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const TourContext = createContext();

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

export const TourProvider = ({ children }) => {
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [runTour, setRunTour] = useState(false);

  // Check if user has seen welcome/tour before
  useEffect(() => {
    if (user) {
      const welcomeKey = `welcome-seen-${user._id}`;
      
      const hasSeenWelcome = localStorage.getItem(welcomeKey);
      
      // Show welcome for new users who haven't seen it
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }
    }
  }, [user]);

  const startTour = () => {
    setShowWelcome(false);
    setRunTour(true);
  };

  const endTour = () => {
    setRunTour(false);
    if (user) {
      const tourKey = `tour-completed-${user._id}`;
      localStorage.setItem(tourKey, 'true');
    }
  };

  const closeWelcome = () => {
    setShowWelcome(false);
    if (user) {
      const welcomeKey = `welcome-seen-${user._id}`;
      localStorage.setItem(welcomeKey, 'true');
    }
  };

  const restartTour = () => {
    setRunTour(true);
  };

  const resetUserTourData = () => {
    if (user) {
      const tourKey = `tour-completed-${user._id}`;
      const welcomeKey = `welcome-seen-${user._id}`;
      localStorage.removeItem(tourKey);
      localStorage.removeItem(welcomeKey);
    }
  };

  const value = {
    showWelcome,
    runTour,
    startTour,
    endTour,
    closeWelcome,
    restartTour,
    resetUserTourData,
  };

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
};

export default TourContext;