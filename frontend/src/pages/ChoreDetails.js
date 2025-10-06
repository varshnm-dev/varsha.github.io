import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const ChoreDetails = () => {
  const [chore, setChore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [qualityRating, setQualityRating] = useState(5);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [householdMembers, setHouseholdMembers] = useState([]);
  const [completedByUser, setCompletedByUser] = useState(null);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchChore = useCallback(async () => {
    try {
      setLoading(true);
      const [choreResponse, householdResponse] = await Promise.all([
        api.getChore(id),
        api.getHousehold()
      ]);

      const choreData = choreResponse.data.data.chore;
      const householdData = householdResponse.data.data.household;

      setChore(choreData);
      setHouseholdMembers(householdData.members || []);
      setCompletedByUser(user._id); // Default to current user

      setEditFormData({
        name: choreData.name,
        category: choreData.category,
        points: choreData.points,
        emoji: choreData.emoji,
        difficulty: choreData.difficulty,
        estimatedMinutes: choreData.estimatedMinutes,
        description: choreData.description || ''
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch chore details');
      toast.error('Failed to load chore details');
    } finally {
      setLoading(false);
    }
  }, [id, user._id]);

  useEffect(() => {
    fetchChore();
  }, [id, fetchChore]);

  const handleCompleteChore = async () => {
    try {
      await api.completeChore({
        chore: id,
        qualityRating,
        notes: completionNotes,
        completedBy: completedByUser
      });
      toast.success('Chore completed successfully!');
      navigate('/completed');
    } catch (err) {
      toast.error('Failed to complete chore');
    }
  };

  const handleUpdateChore = async () => {
    try {
      await api.updateChore(id, editFormData);
      toast.success('Chore updated successfully!');
      setIsEditing(false);
      fetchChore(); // Refresh the chore data
    } catch (err) {
      toast.error('Failed to update chore');
    }
  };

  const handleDeleteChore = async () => {
    if (window.confirm('Are you sure you want to delete this chore?')) {
      try {
        await api.deleteChore(id);
        toast.success('Chore deleted successfully!');
        navigate('/chores');
      } catch (err) {
        toast.error('Failed to delete chore');
      }
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#28a745';
      case 'Medium': return '#ffc107';
      case 'Hard': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        onClick={() => setQualityRating(i + 1)}
        style={{
          fontSize: '24px',
          cursor: 'pointer',
          color: i < rating ? '#ffc107' : '#e9ecef',
          marginRight: '5px'
        }}
      >
        ⭐
      </span>
    ));
  };

  if (loading) return <LoadingSpinner />;

  if (error || !chore) {
    return (
      <div className="page-container">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Chore not found</h2>
          <p>{error || 'The requested chore could not be found.'}</p>
          <button
            onClick={() => navigate('/chores')}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Back to Chores
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <button
            onClick={() => navigate('/chores')}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            ← Back to Chores
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '48px', marginRight: '20px' }}>{chore?.emoji || '🏠'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h1 style={{ margin: 0, color: '#333' }}>{chore?.name || 'Unknown Chore'}</h1>
                  <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                    <span style={{
                      backgroundColor: getDifficultyColor(chore?.difficulty || 'Easy'),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '15px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {chore?.difficulty || 'Easy'}
                    </span>
                    <span style={{
                      backgroundColor: '#f8f9fa',
                      color: '#495057',
                      padding: '4px 12px',
                      borderRadius: '15px',
                      fontSize: '14px'
                    }}>
                      {chore?.category || 'General'}
                    </span>
                  </div>
                </div>
                {user?.role === 'admin' && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      style={{
                        backgroundColor: isEditing ? '#6c757d' : '#ffc107',
                        color: isEditing ? 'white' : '#212529',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      {isEditing ? 'Cancel Edit' : '✏️ Edit'}
                    </button>
                    <button
                      onClick={handleDeleteChore}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chore Info or Edit Form */}
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '10px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {isEditing ? (
            // Edit Form
            <div>
              <h3 style={{ marginBottom: '20px', color: '#333' }}>Edit Chore</h3>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Category:
                </label>
                <select
                  name="category"
                  value={editFormData.category}
                  onChange={handleEditInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value="Kitchen & Dining">Kitchen & Dining</option>
                  <option value="Cleaning & Maintenance">Cleaning & Maintenance</option>
                  <option value="Bedroom & Organization">Bedroom & Organization</option>
                  <option value="Shopping & Errands">Shopping & Errands</option>
                  <option value="Laundry & Clothes">Laundry & Clothes</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Points:
                  </label>
                  <input
                    type="number"
                    name="points"
                    value={editFormData.points}
                    onChange={handleEditInputChange}
                    min="1"
                    max="50"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Emoji:
                  </label>
                  <input
                    type="text"
                    name="emoji"
                    value={editFormData.emoji}
                    onChange={handleEditInputChange}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Difficulty:
                  </label>
                  <select
                    name="difficulty"
                    value={editFormData.difficulty}
                    onChange={handleEditInputChange}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Estimated Minutes:
                  </label>
                  <input
                    type="number"
                    name="estimatedMinutes"
                    value={editFormData.estimatedMinutes}
                    onChange={handleEditInputChange}
                    min="1"
                    max="240"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Description:
                </label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditInputChange}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button
                onClick={handleUpdateChore}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
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
            // Display Mode
            <div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '20px',
                marginBottom: '20px'
              }}>
                <div>
                  <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Points Reward</h4>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                    ⚡ {chore?.points || 5} points
                  </div>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Estimated Time</h4>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                    ⏱️ {chore?.estimatedMinutes || 15} minutes
                  </div>
                </div>
              </div>

              {chore?.description && (
                <div>
                  <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Description</h4>
                  <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#333' }}>
                    {chore.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Completion Form */}
        {!isEditing && (
          <div style={{
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '10px',
          padding: '30px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Complete This Chore</h3>

          {/* Who completed the chore */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
              Who completed this chore?
            </label>
            <select
              value={completedByUser || ''}
              onChange={(e) => setCompletedByUser(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            >
              {householdMembers.map(member => (
                <option key={member._id} value={member._id}>
                  {member.username} {member._id === user._id ? '(You)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Quality Rating */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
              Quality Rating:
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {getRatingStars(qualityRating)}
              <span style={{ fontSize: '14px', color: '#666' }}>
                ({qualityRating}/5)
              </span>
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '30px' }}>
            <label htmlFor="notes" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
              Notes (optional):
            </label>
            <textarea
              id="notes"
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              placeholder="Add any notes about how you completed this chore..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Complete Button */}
          <button
            onClick={handleCompleteChore}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              width: '100%'
            }}
          >
            ✓ Mark as Completed
          </button>
        </div>
        )}
      </div>
    </div>
  );
};

export default ChoreDetails;