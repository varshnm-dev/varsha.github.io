import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
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
              <Link to="/" className="nav-link">Dashboard</Link>
              <Link to="/chores" className="nav-link">Chores</Link>
              <Link to="/completed" className="nav-link">Completed</Link>
              <Link to="/achievements" className="nav-link">Achievements</Link>
              <Link to="/leaderboard" className="nav-link">Leaderboard</Link>

              <div className="nav-dropdown">
                <button className="dropdown-btn">
                  {user?.username || 'User'}
                </button>
                <div className="dropdown-content">
                  <Link to="/profile">Profile</Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin/household">Household Settings</Link>
                  )}
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
