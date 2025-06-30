import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: '',
    email: ''
  });

  useEffect(() => {
    fetchUserStats();
    if (user) {
      setEditData({
        username: user.username,
        email: user.email
      });
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const response = await api.getUserStats();
      setUserStats(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch user statistics');
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // Validate required fields
      if (!editData.username.trim()) {
        toast.error('Username is required');
        return;
      }
      if (!editData.email.trim()) {
        toast.error('Email is required');
        return;
      }

      // Call the updateProfile function from AuthContext
      const result = await updateProfile(editData);
      
      if (result.success) {
        setIsEditing(false);
        // The success message is already shown by updateProfile
        // editData will be updated in useEffect when user changes
      }
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const getRoleDisplay = (role) => {
    return role === 'admin' ? 'Administrator' : 'Member';
  };

  const getRoleBadgeColor = (role) => {
    return role === 'admin' ? '#dc3545' : '#28a745';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: 0, color: '#333' }}>My Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              backgroundColor: isEditing ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {isEditing ? 'Cancel' : '✏️ Edit Profile'}
          </button>
        </div>

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

        {/* Profile Information */}
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '10px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Profile Information</h3>
          
          {isEditing ? (
            <div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Username:
                </label>
                <input
                  type="text"
                  name="username"
                  value={editData.username}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <button
                onClick={handleSaveProfile}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Username</h4>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                  {user?.username}
                </div>
              </div>
              
              <div>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Email</h4>
                <div style={{ fontSize: '18px', color: '#333' }}>
                  {user?.email}
                </div>
              </div>
              
              <div>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Role</h4>
                <span style={{
                  backgroundColor: getRoleBadgeColor(user?.role),
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '15px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {getRoleDisplay(user?.role)}
                </span>
              </div>
              
              <div>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Total Points</h4>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                  ⚡ {user?.points || 0}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Household Information */}
        {user?.household && (
          <div style={{
            backgroundColor: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '10px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>🏠 Household Information</h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px' 
            }}>
              <div>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Household Name</h4>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                  {user.household?.name || 'Loading...'}
                </div>
              </div>
              
              <div>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Your Role</h4>
                <span style={{
                  backgroundColor: getRoleBadgeColor(user?.role),
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '15px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {getRoleDisplay(user?.role)}
                </span>
              </div>
              
              <div>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Member Since</h4>
                <div style={{ fontSize: '16px', color: '#333' }}>
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Statistics */}
        {userStats && (
          <div style={{
            backgroundColor: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '10px',
            padding: '30px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Statistics</h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px' 
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745', marginBottom: '5px' }}>
                  {userStats.totalChoresCompleted || 0}
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>Chores Completed</div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff', marginBottom: '5px' }}>
                  {userStats.totalPoints || 0}
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>Total Points Earned</div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107', marginBottom: '5px' }}>
                  {userStats.currentStreak || 0}
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>Current Streak</div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545', marginBottom: '5px' }}>
                  {userStats.householdRank || 'N/A'}
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>Household Rank</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
