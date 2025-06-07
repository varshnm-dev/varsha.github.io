import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [recentChores, setRecentChores] = useState([]);
  const [household, setHousehold] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get user stats
        const userStatsRes = await api.getUserStats();
        setStats(userStatsRes.data.data);

        // Get household info
        try {
          const householdRes = await api.getHousehold();
          setHousehold(householdRes.data.data.household);
        } catch (err) {
          // User might not be in a household yet
          console.log('User not in household:', err);
        }

        // Get recent completed chores
        const completedChoresRes = await api.getCompletedChores({ limit: 5 });
        setRecentChores(completedChoresRes.data.data.completedChores);

        // Get weekly leaderboard
        try {
          const leaderboardRes = await api.getWeeklyLeaderboard();
          setLeaderboard(leaderboardRes.data.data.leaderboard);
        } catch (err) {
          console.log('Error fetching leaderboard:', err);
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome, {user?.username}!</h2>
        <p>Here's an overview of your household chores and achievements.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h3>Total Points</h3>
            <div className="stat-value">{stats?.totalPoints || 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Chores Completed</h3>
            <div className="stat-value">{stats?.totalChoresCompleted || 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>Current Streak</h3>
            <div className="stat-value">{stats?.currentStreak || 0} days</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏅</div>
          <div className="stat-content">
            <h3>Achievements</h3>
            <div className="stat-value">{stats?.achievementsCount || 0}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Recent Activity</h3>
            <Link to="/completed" className="btn btn-secondary">View All</Link>
          </div>
          <div className="recent-chores">
            {recentChores.length > 0 ? (
              recentChores.map((chore) => (
                <div key={chore._id} className="chore-card">
                  <div className="chore-emoji">{chore.chore.emoji}</div>
                  <div className="chore-details">
                    <h4>{chore.chore.name}</h4>
                    <p>Completed on {new Date(chore.completedAt).toLocaleDateString()}</p>
                    <div className="chore-points">+{chore.pointsEarned} points</div>
                  </div>
                </div>
              ))
            ) : (
              <p>No recent chores completed. Start earning points!</p>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h3>Leaderboard</h3>
            <Link to="/leaderboard" className="btn btn-secondary">Full Leaderboard</Link>
          </div>
          <div className="leaderboard">
            {leaderboard.length > 0 ? (
              leaderboard.map((entry, index) => (
                <div key={entry._id || index} className="leaderboard-item">
                  <div className="rank">{entry.rank || index + 1}</div>
                  <div className="user-info">
                    <h4>{entry.user.username}</h4>
                  </div>
                  <div className="points">{entry.points} points</div>
                </div>
              ))
            ) : (
              <p>No leaderboard data available yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/chores" className="action-card">
          <div className="action-icon">➕</div>
          <div className="action-content">
            <h3>Complete a Chore</h3>
            <p>Add points to your score</p>
          </div>
        </Link>

        <Link to="/achievements" className="action-card">
          <div className="action-icon">🏆</div>
          <div className="action-content">
            <h3>View Achievements</h3>
            <p>See your accomplishments</p>
          </div>
        </Link>

        {user?.role === 'admin' && (
          <Link to="/admin/household" className="action-card">
            <div className="action-icon">⚙️</div>
            <div className="action-content">
              <h3>Household Settings</h3>
              <p>Manage your household</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
