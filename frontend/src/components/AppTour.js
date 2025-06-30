import React, { useState } from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useAuth } from '../context/AuthContext';

const AppTour = ({ runTour, onTourEnd }) => {
  const { user } = useAuth();
  const [stepIndex, setStepIndex] = useState(0);

  const isAdmin = user?.role === 'admin';

  // Tour steps for Admin users
  const adminSteps = [
    {
      target: '.navbar-brand',
      content: (
        <div>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Welcome to Household Gamification! 🏠</h3>
          <p style={{ margin: 0, color: '#666' }}>Let's take a quick tour to show you how to manage your household and gamify chores!</p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="dashboard-link"]',
      content: (
        <div>
          <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>📊 Dashboard</h4>
          <p style={{ margin: 0, color: '#666' }}>Your main hub to see household overview, recent activities, and quick stats.</p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="chores-link"]',
      content: (
        <div>
          <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>✅ Chores</h4>
          <p style={{ margin: 0, color: '#666' }}>Manage all household chores. You can browse the marketplace, create custom chores, and track completion.</p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="leaderboard-link"]',
      content: (
        <div>
          <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>🏆 Leaderboard</h4>
          <p style={{ margin: 0, color: '#666' }}>See who's leading in points! Track daily, weekly, monthly, and all-time rankings.</p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="household-link"]',
      content: (
        <div>
          <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>⚙️ Household Settings</h4>
          <p style={{ margin: 0, color: '#666' }}>Manage your household - invite family members, generate invite codes, and customize settings.</p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="profile-link"]',
      content: (
        <div>
          <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>👤 Profile</h4>
          <p style={{ margin: 0, color: '#666' }}>View your achievements, update your profile, and track your personal progress.</p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: 'body',
      content: (
        <div>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>🚀 You're all set!</h3>
          <p style={{ margin: '0 0 15px 0', color: '#666' }}>
            As an admin, start by browsing the chore marketplace to add chores to your household, then invite family members to join the fun!
          </p>
          <p style={{ margin: 0, color: '#666', fontStyle: 'italic' }}>
            You can restart this tour anytime from your profile menu.
          </p>
        </div>
      ),
      placement: 'center',
    },
  ];

  // Tour steps for Member users
  const memberSteps = [
    {
      target: '.navbar-brand',
      content: (
        <div>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Welcome to the Household! 👋</h3>
          <p style={{ margin: 0, color: '#666' }}>Let's show you how to complete chores, earn points, and climb the leaderboard!</p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="dashboard-link"]',
      content: (
        <div>
          <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>📊 Dashboard</h4>
          <p style={{ margin: 0, color: '#666' }}>See your current points, daily streak, and recent household activity.</p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="chores-link"]',
      content: (
        <div>
          <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>✅ Available Chores</h4>
          <p style={{ margin: 0, color: '#666' }}>Browse and complete household chores to earn points. Each chore shows its point value and difficulty!</p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="leaderboard-link"]',
      content: (
        <div>
          <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>🏆 Leaderboard</h4>
          <p style={{ margin: 0, color: '#666' }}>Compete with family members! See your ranking and strive to reach the top.</p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="profile-link"]',
      content: (
        <div>
          <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>👤 Your Profile</h4>
          <p style={{ margin: 0, color: '#666' }}>Track your achievements, view completed chores, and see your progress over time.</p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: 'body',
      content: (
        <div>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>🎉 Ready to earn points!</h3>
          <p style={{ margin: '0 0 15px 0', color: '#666' }}>
            Start by completing chores to earn points, build your daily streak, and unlock achievements!
          </p>
          <p style={{ margin: 0, color: '#666', fontStyle: 'italic' }}>
            You can restart this tour anytime from your profile menu.
          </p>
        </div>
      ),
      placement: 'center',
    },
  ];

  const steps = isAdmin ? adminSteps : memberSteps;

  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setStepIndex(0);
      onTourEnd();
    }
  };

  // Custom styles for the tour
  const joyrideStyles = {
    options: {
      primaryColor: '#007bff',
      width: 350,
      zIndex: 10000,
    },
    tooltip: {
      borderRadius: '10px',
      fontSize: '14px',
    },
    tooltipContainer: {
      textAlign: 'left',
    },
    tooltipTitle: {
      color: '#333',
      fontSize: '16px',
      fontWeight: 'bold',
    },
    tooltipContent: {
      color: '#666',
      lineHeight: '1.5',
    },
    buttonNext: {
      backgroundColor: '#007bff',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: 'bold',
      padding: '8px 16px',
    },
    buttonBack: {
      color: '#666',
      marginRight: '10px',
      fontSize: '13px',
    },
    buttonSkip: {
      color: '#999',
      fontSize: '13px',
    },
    buttonClose: {
      fontSize: '18px',
      fontWeight: 'bold',
    },
    beacon: {
      backgroundColor: '#007bff',
    },
    beaconInner: {
      backgroundColor: '#007bff',
    },
    spotlight: {
      borderRadius: '8px',
    },
  };

  if (!runTour) return null;

  return (
    <Joyride
      steps={steps}
      run={runTour}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      spotlightClicks
      disableOverlayClose
      callback={handleJoyrideCallback}
      styles={joyrideStyles}
      locale={{
        back: 'Previous',
        close: 'Close',
        last: 'Finish Tour',
        next: 'Next',
        skip: 'Skip Tour',
      }}
    />
  );
};

export default AppTour;