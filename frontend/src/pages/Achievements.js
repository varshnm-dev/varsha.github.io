import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const Achievements = () => {
  const [myAchievements, setMyAchievements] = useState([]);
  const [householdAchievements, setHouseholdAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('my');
  const { user } = useAuth();

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const [myResponse, householdResponse] = await Promise.all([
        api.getMyAchievements(),
        api.getHouseholdAchievements()
      ]);
      
      setMyAchievements(myResponse.data.data.achievements);
      setHouseholdAchievements(householdResponse.data.data.achievements);
      setError(null);
    } catch (err) {
      setError('Failed to fetch achievements');
      toast.error('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAchievementIcon = (achievementName) => {
    const iconMap = {
      'First Chore': '🎯',
      'Ten Chores': '🔟',
      'Fifty Chores': '5️⃣0️⃣',
      'Hundred Chores': '💯',
      '3 Day Streak': '🔥',
      '7 Day Streak': '🔥🔥',
      '30 Day Streak': '🔥🔥🔥',
      '100 Points': '💎',
      '500 Points': '💎💎',
      '1000 Points': '💎💎💎',
      '5000 Points': '👑',
      'Kitchen Master': '👨‍🍳',
      'Cleaning Specialist': '🧽',
      'Organization Expert': '📦',
      'Shopping Pro': '🛒',
      'Laundry Champion': '👕'
    };
    return iconMap[achievementName] || '🏆';
  };

  const getAchievementColor = (achievementName) => {
    if (achievementName.includes('Streak')) return '#ff6b35';
    if (achievementName.includes('Points')) return '#4ecdc4';
    if (achievementName.includes('Master') || achievementName.includes('Specialist') || 
        achievementName.includes('Expert') || achievementName.includes('Pro') || 
        achievementName.includes('Champion')) return '#a8e6cf';
    return '#ffd93d';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '30px', color: '#333' }}>Achievements</h1>

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
        <div style={{ marginBottom: '30px' }}>
          <button
            onClick={() => setActiveTab('my')}
            style={{
              backgroundColor: activeTab === 'my' ? '#007bff' : '#f8f9fa',
              color: activeTab === 'my' ? 'white' : '#495057',
              border: '1px solid #007bff',
              padding: '10px 20px',
              borderRadius: '5px 0 0 5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            My Achievements ({myAchievements.length})
          </button>
          <button
            onClick={() => setActiveTab('household')}
            style={{
              backgroundColor: activeTab === 'household' ? '#007bff' : '#f8f9fa',
              color: activeTab === 'household' ? 'white' : '#495057',
              border: '1px solid #007bff',
              borderLeft: 'none',
              padding: '10px 20px',
              borderRadius: '0 5px 5px 0',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Household Achievements ({householdAchievements.length})
          </button>
        </div>

        {/* Achievements Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {(activeTab === 'my' ? myAchievements : householdAchievements).map(achievement => (
            <div
              key={achievement._id}
              style={{
                backgroundColor: getAchievementColor(achievement.achievement),
                border: '1px solid #e0e0e0',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                textAlign: 'center',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>
                {getAchievementIcon(achievement.achievement)}
              </div>
              
              <h3 style={{ 
                margin: '0 0 10px 0', 
                color: '#333', 
                fontSize: '18px',
                fontWeight: 'bold' 
              }}>
                {achievement.achievement}
              </h3>
              
              <p style={{ 
                margin: '0 0 15px 0', 
                color: '#555', 
                fontSize: '14px',
                lineHeight: '1.4' 
              }}>
                {achievement.description}
              </p>
              
              <div style={{ fontSize: '12px', color: '#666' }}>
                <div style={{ marginBottom: '5px' }}>
                  <strong>Earned on:</strong> {formatDate(achievement.earnedAt)}
                </div>
                {activeTab === 'household' && achievement.user && (
                  <div>
                    <strong>By:</strong> {achievement.user.username}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {((activeTab === 'my' && myAchievements.length === 0) || 
          (activeTab === 'household' && householdAchievements.length === 0)) && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏆</div>
            <h3 style={{ marginBottom: '10px' }}>No achievements yet</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.6', maxWidth: '400px', margin: '0 auto' }}>
              {activeTab === 'my' 
                ? 'Complete chores to start earning achievements! Your first achievement is just one chore away.'
                : 'No one in your household has earned achievements yet. Be the first to complete a chore!'
              }
            </p>
          </div>
        )}

        {/* Achievement Categories Info */}
        {((activeTab === 'my' && myAchievements.length > 0) || 
          (activeTab === 'household' && householdAchievements.length > 0)) && (
          <div style={{ 
            marginTop: '40px', 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '10px' 
          }}>
            <h4 style={{ marginBottom: '15px', color: '#333' }}>Achievement Categories</h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '15px',
              fontSize: '14px',
              color: '#666'
            }}>
              <div>
                <strong>🎯 Milestone Achievements:</strong> First chore, 10, 50, 100 chores
              </div>
              <div>
                <strong>🔥 Streak Achievements:</strong> 3, 7, and 30-day streaks
              </div>
              <div>
                <strong>💎 Points Achievements:</strong> 100, 500, 1000, 5000 points
              </div>
              <div>
                <strong>🏅 Category Masters:</strong> Complete 20 chores in each category
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;