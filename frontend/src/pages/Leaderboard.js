import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('daily');
  const [periodInfo, setPeriodInfo] = useState(null);
  const [household, setHousehold] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    await Promise.all([
      fetchLeaderboard(),
      fetchHousehold()
    ]);
  };

  const fetchHousehold = async () => {
    try {
      const response = await api.getHousehold();
      setHousehold(response.data.data.household);
    } catch (err) {
      console.log('User not in household:', err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      let response;
      
      switch (activeTab) {
        case 'daily':
          response = await api.getDailyLeaderboard();
          break;
        case 'weekly':
          response = await api.getWeeklyLeaderboard();
          break;
        case 'monthly':
          response = await api.getMonthlyLeaderboard();
          break;
        case 'allTime':
          response = await api.getAllTimeLeaderboard();
          break;
        default:
          response = await api.getDailyLeaderboard();
      }
      
      setLeaderboardData(response.data.data.leaderboard);
      setPeriodInfo({
        periodStart: response.data.periodStart,
        periodEnd: response.data.periodEnd
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch leaderboard');
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return '#ffd700';
      case 2: return '#c0c0c0';
      case 3: return '#cd7f32';
      default: return '#f8f9fa';
    }
  };

  const getPeriodLabel = () => {
    switch (activeTab) {
      case 'daily': return 'Today';
      case 'weekly': return 'This Week';
      case 'monthly': return 'This Month';
      case 'allTime': return 'All Time';
      default: return '';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '10px', color: '#333', textAlign: 'center' }}>
          🏆 Leaderboard
        </h1>
        
        {/* Household Context */}
        {household && (
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '30px', 
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#495057', fontSize: '18px' }}>
              🏠 {household.name}
            </h3>
            <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>
              Competing with {household.members?.length || 0} household members
            </p>
          </div>
        )}

        {error && (
          <div style={{ 
            color: '#dc3545', 
            backgroundColor: '#f8d7da', 
            padding: '15px', 
            borderRadius: '5px', 
            marginBottom: '20px' 
          }}>
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '5px'
        }}>
          {[
            { key: 'daily', label: 'Daily' },
            { key: 'weekly', label: 'Weekly' },
            { key: 'monthly', label: 'Monthly' },
            { key: 'allTime', label: 'All Time' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                backgroundColor: activeTab === tab.key ? '#007bff' : '#f8f9fa',
                color: activeTab === tab.key ? 'white' : '#495057',
                border: '1px solid #007bff',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                minWidth: '80px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Period Info */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '30px', 
          fontSize: '18px', 
          fontWeight: 'bold',
          color: '#495057'
        }}>
          {getPeriodLabel()}
          {periodInfo && activeTab !== 'allTime' && (
            <div style={{ fontSize: '14px', fontWeight: 'normal', color: '#666', marginTop: '5px' }}>
              {formatDate(periodInfo.periodStart)} - {formatDate(periodInfo.periodEnd)}
            </div>
          )}
        </div>

        {/* Leaderboard List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {leaderboardData.map((entry, index) => (
            <div
              key={entry.user._id || entry.user.id}
              style={{
                backgroundColor: entry.user._id === user._id || entry.user.id === user.id 
                  ? '#e3f2fd' : getRankColor(entry.rank || index + 1),
                border: entry.user._id === user._id || entry.user.id === user.id 
                  ? '2px solid #2196f3' : '1px solid #e0e0e0',
                borderRadius: '10px',
                padding: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                {/* Rank */}
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  marginRight: '20px',
                  minWidth: '60px',
                  textAlign: 'center'
                }}>
                  {getRankIcon(entry.rank || index + 1)}
                </div>

                {/* User Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    color: '#333',
                    marginBottom: '5px'
                  }}>
                    {entry.user.username}
                    {(entry.user._id === user._id || entry.user.id === user.id) && (
                      <span style={{ 
                        color: '#2196f3', 
                        fontSize: '14px', 
                        marginLeft: '10px',
                        fontWeight: 'normal'
                      }}>
                        (You)
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {entry.completedChores || 0} chores completed
                  </div>
                </div>
              </div>

              {/* Points */}
              <div style={{ 
                textAlign: 'right',
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#007bff'
              }}>
                {entry.points || 0}
                <div style={{ 
                  fontSize: '12px', 
                  color: '#666', 
                  fontWeight: 'normal' 
                }}>
                  points
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {leaderboardData.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏆</div>
            <h3 style={{ marginBottom: '10px' }}>No data yet</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.6', maxWidth: '400px', margin: '0 auto' }}>
              Complete some chores to appear on the leaderboard! 
              {activeTab === 'daily' && ' Start today to claim your spot.'}
              {activeTab === 'weekly' && ' You have all week to climb the ranks.'}
              {activeTab === 'monthly' && ' There\'s still time this month to reach the top.'}
              {activeTab === 'allTime' && ' Every chore counts towards your legacy.'}
            </p>
          </div>
        )}

        {/* Leaderboard Info */}
        {leaderboardData.length > 0 && (
          <div style={{ 
            marginTop: '40px', 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h4 style={{ marginBottom: '15px', color: '#333' }}>How Rankings Work</h4>
            <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
              Rankings are based on points earned, with completed chores as a tiebreaker. 
              Points are calculated from chore base points multiplied by your household's point multiplier.
              {activeTab !== 'allTime' && ' Rankings reset at the start of each period.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;