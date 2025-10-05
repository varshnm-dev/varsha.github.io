import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ChoreMarketplace from '../components/ChoreMarketplace';
import { toast } from 'react-toastify';

const ChoreList = () => {
  const [chores, setChores] = useState([]);
  const [allChores, setAllChores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [editingChore, setEditingChore] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    points: 5,
    emoji: '🏠',
    difficulty: 'Easy',
    estimatedMinutes: 15,
    description: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  // Predefined chore categories
  const allCategories = [
    'Kitchen & Dining',
    'Laundry & Clothes',
    'Cleaning & Maintenance',
    'Shopping & Errands',
    'Bedroom & Organization',
    'Other'
  ];

  useEffect(() => {
    fetchAllChores();
  }, []);

  useEffect(() => {
    if (selectedCategory && allChores.length > 0) {
      setChores(allChores.filter(chore => chore.category === selectedCategory));
    } else {
      setChores(allChores);
    }
  }, [selectedCategory, allChores]);

  const fetchAllChores = async () => {
    try {
      setLoading(true);
      const response = await api.getChores();
      const choresList = response.data.data.chores;
      setAllChores(choresList);
      setChores(choresList);
      
      // Extract unique categories from existing chores
      const existingCategories = [...new Set(choresList.map(chore => chore.category))];
      setCategories(existingCategories);
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch chores');
      toast.error('Failed to load chores');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteChore = async (choreId) => {
    try {
      await api.completeChore({
        chore: choreId,
        qualityRating: 5
      });
      toast.success('Chore completed successfully!');
      fetchAllChores(); // Refresh the list
    } catch (err) {
      toast.error('Failed to complete chore');
    }
  };

  const handleCreateChore = async () => {
    try {
      if (!formData.name || !formData.category) {
        toast.error('Please fill in all required fields');
        return;
      }
      await api.createChore(formData);
      toast.success('Chore created successfully!');
      setShowCreateForm(false);
      setEditingChore(null);
      resetForm();
      fetchAllChores();
    } catch (err) {
      toast.error('Failed to create chore');
    }
  };

  const handleUpdateChore = async () => {
    try {
      if (!formData.name || !formData.category) {
        toast.error('Please fill in all required fields');
        return;
      }
      await api.updateChore(editingChore._id, formData);
      toast.success('Chore updated successfully!');
      setEditingChore(null);
      setShowCreateForm(false);
      resetForm();
      fetchAllChores();
    } catch (err) {
      toast.error('Failed to update chore');
    }
  };

  const handleDeleteChore = async (choreId) => {
    if (window.confirm('Are you sure you want to delete this chore?')) {
      try {
        await api.deleteChore(choreId);
        toast.success('Chore deleted successfully!');
        fetchAllChores();
      } catch (err) {
        toast.error('Failed to delete chore');
      }
    }
  };

  const startEditing = (chore) => {
    setEditingChore(chore);
    setFormData({
      name: chore.name,
      category: chore.category,
      points: chore.points,
      emoji: chore.emoji,
      difficulty: chore.difficulty,
      estimatedMinutes: chore.estimatedMinutes,
      description: chore.description || ''
    });
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      points: 5,
      emoji: '🏠',
      difficulty: 'Easy',
      estimatedMinutes: 15,
      description: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: 0, color: '#333' }}>Available Chores</h1>
          {user?.role === 'admin' && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowMarketplace(true)}
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
                🛍️ Browse Marketplace
              </button>
              <button
                onClick={() => {
                  setEditingChore(null);
                  resetForm();
                  setShowCreateForm(true);
                }}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                ➕ Create Custom Chore
              </button>
            </div>
          )}
        </div>

        {/* Create/Edit Form Modal */}
        {showCreateForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '10px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <h2 style={{ marginBottom: '20px' }}>
                {editingChore ? 'Edit Chore' : 'Create New Chore'}
              </h2>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Category:
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                  required
                >
                  <option value="">Select Category</option>
                  {allCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
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
                    value={formData.points}
                    onChange={handleInputChange}
                    min="1"
                    max="50"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Emoji:
                  </label>
                  <input
                    type="text"
                    name="emoji"
                    value={formData.emoji}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    required
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
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    required
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
                    value={formData.estimatedMinutes}
                    onChange={handleInputChange}
                    min="1"
                    max="240"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Description (optional):
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
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

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingChore(null);
                    resetForm();
                  }}
                  style={{
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={editingChore ? handleUpdateChore : handleCreateChore}
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  {editingChore ? 'Update Chore' : 'Create Chore'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter - Only show if there are chores */}
        {chores.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <label htmlFor="category" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
              Filter by Category:
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '16px',
                minWidth: '200px'
              }}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
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

        {/* Chores Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {chores.map(chore => (
            <div
              key={chore._id}
              style={{
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '10px',
                padding: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ fontSize: '24px', marginRight: '10px' }}>{chore.emoji}</span>
                <h3 style={{ margin: 0, color: '#333' }}>{chore.name}</h3>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <span style={{ 
                  backgroundColor: getDifficultyColor(chore.difficulty),
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '15px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {chore.difficulty}
                </span>
                <span style={{ 
                  backgroundColor: '#f8f9fa',
                  color: '#495057',
                  padding: '4px 8px',
                  borderRadius: '15px',
                  fontSize: '12px',
                  marginLeft: '8px'
                }}>
                  {chore.category}
                </span>
              </div>

              <div style={{ marginBottom: '15px', color: '#666', fontSize: '14px' }}>
                <div>⚡ {chore.points} points</div>
                <div>⏱️ ~{chore.estimatedMinutes} minutes</div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleCompleteChore(chore._id)}
                  style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    flex: 1,
                    minWidth: '80px'
                  }}
                >
                  ✓ Complete
                </button>
                <button
                  onClick={() => navigate(`/chores/${chore._id}`)}
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Details
                </button>
                {user?.role === 'admin' && (
                  <>
                    <button
                      onClick={() => startEditing(chore)}
                      style={{
                        backgroundColor: '#ffc107',
                        color: '#212529',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteChore(chore._id)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {chores.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <h3>No chores available</h3>
            <p>
              {selectedCategory 
                ? `No chores found in the "${selectedCategory}" category.`
                : 'No chores have been created yet.'
              }
            </p>
            {user?.role === 'admin' && (
              <button
                onClick={() => setShowMarketplace(true)}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginTop: '20px'
                }}
              >
                🛍️ Browse Marketplace to Add Chores
              </button>
            )}
          </div>
        )}

        {/* Chore Marketplace Modal */}
        {showMarketplace && (
          <ChoreMarketplace
            onChoreAdded={() => {
              fetchAllChores();
              setShowMarketplace(false);
            }}
            onClose={() => setShowMarketplace(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ChoreList;