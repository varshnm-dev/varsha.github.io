import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from './LoadingSpinner';
import { toast } from 'react-toastify';

const ChoreMarketplace = ({ onChoreAdded, onClose }) => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [categorizedTemplates, setCategorizedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [addingChores, setAddingChores] = useState(new Set());
  const [viewMode, setViewMode] = useState('category'); // 'category' or 'list'

  const categories = [
    'All Categories',
    'Kitchen & Dining',
    'Laundry & Clothes',
    'Cleaning & Maintenance',
    'Shopping & Errands',
    'Bedroom & Organization',
    'Other'
  ];

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await api.getChoreTemplatesByCategory();
      setCategorizedTemplates(response.data.data.categories);
      
      // Also get all templates for search functionality
      const allResponse = await api.getChoreTemplates();
      setTemplates(allResponse.data.data.templates);
    } catch (error) {
      toast.error('Failed to load marketplace');
    } finally {
      setLoading(false);
    }
  };

  const handleAddChore = async (templateId, templateName) => {
    if (user?.role !== 'admin') {
      toast.error('Only household admins can add chores');
      return;
    }

    try {
      setAddingChores(prev => new Set([...prev, templateId]));
      await api.addChoreFromTemplate(templateId);
      toast.success(`"${templateName}" added to your household!`);
      if (onChoreAdded) onChoreAdded();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add chore';
      toast.error(message);
    } finally {
      setAddingChores(prev => {
        const newSet = new Set(prev);
        newSet.delete(templateId);
        return newSet;
      });
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#28a745';
      case 'Medium': return '#ffc107';
      case 'Hard': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getFilteredTemplates = () => {
    if (viewMode === 'category') {
      return categorizedTemplates.filter(category => 
        selectedCategory === 'all' || category._id === selectedCategory
      );
    } else {
      return templates.filter(template => {
        const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
      });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '30px',
        maxWidth: '900px',
        maxHeight: '80vh',
        width: '90%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px',
          paddingBottom: '15px',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <h2 style={{ margin: 0, color: '#333' }}>🛍️ Chore Marketplace</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ✕
          </button>
        </div>

        {/* Controls */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          marginBottom: '20px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value === 'All Categories' ? 'all' : e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          >
            {categories.map(category => (
              <option key={category} value={category === 'All Categories' ? 'all' : category}>
                {category}
              </option>
            ))}
          </select>

          {/* Search */}
          <input
            type="text"
            placeholder="Search chores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px',
              flex: 1,
              minWidth: '200px'
            }}
          />

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', gap: '5px' }}>
            <button
              onClick={() => setViewMode('category')}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                backgroundColor: viewMode === 'category' ? '#007bff' : '#fff',
                color: viewMode === 'category' ? '#fff' : '#333',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              📂 Categories
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                backgroundColor: viewMode === 'list' ? '#007bff' : '#fff',
                color: viewMode === 'list' ? '#fff' : '#333',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              📋 List
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ 
          flex: 1, 
          overflow: 'auto',
          border: '1px solid #e0e0e0',
          borderRadius: '5px',
          padding: '15px'
        }}>
          {viewMode === 'category' ? (
            // Category View
            <div>
              {getFilteredTemplates().map((category) => (
                <div key={category._id} style={{ marginBottom: '30px' }}>
                  <h3 style={{ 
                    color: '#333', 
                    marginBottom: '15px',
                    padding: '10px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '5px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    {category._id}
                    <span style={{ fontSize: '14px', color: '#666' }}>
                      {category.count} chores
                    </span>
                  </h3>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                    gap: '15px' 
                  }}>
                    {category.chores.map((template) => (
                      <ChoreTemplateCard
                        key={template._id}
                        template={template}
                        onAdd={handleAddChore}
                        isAdding={addingChores.has(template._id)}
                        getDifficultyColor={getDifficultyColor}
                        userRole={user?.role}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List View
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '15px' 
            }}>
              {getFilteredTemplates().map((template) => (
                <ChoreTemplateCard
                  key={template._id}
                  template={template}
                  onAdd={handleAddChore}
                  isAdding={addingChores.has(template._id)}
                  getDifficultyColor={getDifficultyColor}
                  userRole={user?.role}
                  showCategory={true}
                />
              ))}
            </div>
          )}

          {getFilteredTemplates().length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              color: '#666', 
              padding: '40px',
              fontSize: '16px'
            }}>
              {searchTerm ? 'No chores match your search.' : 'No chores available in this category.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Chore Template Card Component
const ChoreTemplateCard = ({ template, onAdd, isAdding, getDifficultyColor, userRole, showCategory = false }) => {
  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '15px',
      backgroundColor: '#fff',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'default'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = 'none';
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>{template.emoji}</span>
          <h4 style={{ margin: 0, color: '#333', fontSize: '16px' }}>
            {template.name}
          </h4>
        </div>
        <div style={{
          backgroundColor: getDifficultyColor(template.difficulty),
          color: '#fff',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {template.difficulty}
        </div>
      </div>

      {/* Details */}
      <div style={{ marginBottom: '15px' }}>
        {showCategory && (
          <div style={{ 
            fontSize: '12px', 
            color: '#666', 
            marginBottom: '5px',
            fontStyle: 'italic'
          }}>
            {template.category}
          </div>
        )}
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: '14px',
          color: '#666'
        }}>
          <span>⚡ {template.points} points</span>
          <span>⏱️ {template.estimatedMinutes} min</span>
        </div>
        
        {template.description && (
          <p style={{ 
            fontSize: '13px', 
            color: '#666', 
            marginTop: '8px',
            lineHeight: '1.4'
          }}>
            {template.description}
          </p>
        )}
      </div>

      {/* Add Button */}
      <button
        onClick={() => onAdd(template._id, template.name)}
        disabled={isAdding || userRole !== 'admin'}
        style={{
          width: '100%',
          padding: '8px 12px',
          backgroundColor: isAdding ? '#6c757d' : userRole !== 'admin' ? '#e9ecef' : '#28a745',
          color: userRole !== 'admin' ? '#6c757d' : '#fff',
          border: 'none',
          borderRadius: '5px',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: isAdding || userRole !== 'admin' ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s ease'
        }}
      >
        {isAdding ? 'Adding...' : userRole !== 'admin' ? 'Admin Only' : '+ Add to Household'}
      </button>
    </div>
  );
};

export default ChoreMarketplace;