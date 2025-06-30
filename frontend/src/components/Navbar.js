import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useTour } from '../context/TourContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { restartTour } = useTour();

  const handleLogout = () => {
    logout();
  };

  const handleRestartTour = () => {
    restartTour();
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/">
            <h1>{process.env.REACT_APP_APP_NAME || 'Household Gamification'}</h1>
          </Link>
        </div>

        <nav className="navbar-nav">
          {isAuthenticated ? (
            <>
              <Link to="/" className="nav-link" data-tour="dashboard-link">Dashboard</Link>
              <Link to="/chores" className="nav-link" data-tour="chores-link">Chores</Link>
              <Link to="/completed" className="nav-link">Completed</Link>
              <Link to="/achievements" className="nav-link">Achievements</Link>
              <Link to="/leaderboard" className="nav-link" data-tour="leaderboard-link">Leaderboard</Link>

              <div className="nav-dropdown">
                <button className="dropdown-btn" data-tour="profile-link">
                  {user?.username || 'User'}
                </button>
                <div className="dropdown-content">
                  <Link to="/profile">Profile</Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin/household" data-tour="household-link">Household Settings</Link>
                  )}
                  <button onClick={handleRestartTour} className="dropdown-item">
                    🎯 Take Tour Again
                  </button>
                  <button onClick={handleLogout} className="dropdown-item">Logout</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
