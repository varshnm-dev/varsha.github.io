import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const HouseholdSettings = () => {
  const { user } = useAuth();
  const [household, setHousehold] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: ''
  });
  const [newInviteCode, setNewInviteCode] = useState('');
  const [generatingCode, setGeneratingCode] = useState(false);

  useEffect(() => {
    fetchHousehold();
  }, []);

  const fetchHousehold = async () => {
    try {
      setLoading(true);
      const response = await api.getHousehold();
      const householdData = response.data.data.household;
      setHousehold(householdData);
      setEditData({
        name: householdData.name
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch household information');
      toast.error('Failed to load household settings');
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

  const handleSaveHousehold = async () => {
    try {
      await api.updateHousehold(household._id, editData);
      toast.success('Household updated successfully!');
      setIsEditing(false);
      fetchHousehold();
    } catch (err) {
      toast.error('Failed to update household');
    }
  };

  const handleGenerateInviteCode = async () => {
    try {
      setGeneratingCode(true);
      const response = await api.generateInviteCode(household._id);
      setNewInviteCode(response.data.data.inviteCode);
      toast.success('New invite code generated!');
      fetchHousehold();
    } catch (err) {
      toast.error('Failed to generate invite code');
    } finally {
      setGeneratingCode(false);
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(household.inviteCode);
    toast.success('Invite code copied to clipboard!');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <LoadingSpinner />;

  if (user?.role !== 'admin') {
    return (
      <div className="page-container">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Access Denied</h2>
          <p>Only administrators can access household settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: 0, color: '#333' }}>Household Settings</h1>
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
            {isEditing ? 'Cancel' : '✏️ Edit Household'}
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

        {household && (
          <>
            {/* Household Information */}
            <div style={{
              backgroundColor: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '10px',
              padding: '30px',
              marginBottom: '30px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '20px', color: '#333' }}>Household Information</h3>
              
              {isEditing ? (
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      Household Name:
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
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
                    onClick={handleSaveHousehold}
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
                    <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Name</h4>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                      {household.name}
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Created</h4>
                    <div style={{ fontSize: '16px', color: '#333' }}>
                      {formatDate(household.createdAt)}
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Members</h4>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                      {household.members.length}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Invite Code Section */}
            <div style={{
              backgroundColor: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '10px',
              padding: '30px',
              marginBottom: '30px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '20px', color: '#333' }}>Invite Code</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <p style={{ color: '#666', marginBottom: '15px' }}>
                  Share this invite code with family members so they can join your household.
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '5px',
                  border: '1px solid #e9ecef'
                }}>
                  <code style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    color: '#007bff',
                    flex: 1
                  }}>
                    {household.inviteCode}
                  </code>
                  
                  <button
                    onClick={copyInviteCode}
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleGenerateInviteCode}
                disabled={generatingCode}
                style={{
                  backgroundColor: generatingCode ? '#6c757d' : '#ffc107',
                  color: generatingCode ? 'white' : '#212529',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: generatingCode ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                {generatingCode ? 'Generating...' : '🔄 Generate New Code'}
              </button>
              
              {newInviteCode && (
                <div style={{ 
                  marginTop: '15px',
                  padding: '10px',
                  backgroundColor: '#d4edda',
                  border: '1px solid #c3e6cb',
                  borderRadius: '4px',
                  color: '#155724'
                }}>
                  <strong>New invite code generated:</strong> {newInviteCode}
                </div>
              )}
            </div>

            {/* Household Members */}
            <div style={{
              backgroundColor: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '10px',
              padding: '30px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '20px', color: '#333' }}>Household Members</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {household.members.map((member, index) => (
                  <div
                    key={member._id || index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '15px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '5px',
                      border: '1px solid #e9ecef'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#333' }}>
                        {member.username || 'Unknown User'}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        {member.email || 'No email'}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        backgroundColor: member.role === 'admin' ? '#dc3545' : '#28a745',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {member.role === 'admin' ? 'Admin' : 'Member'}
                      </span>
                      
                      <span style={{ 
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#007bff'
                      }}>
                        ⚡ {member.points || 0} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HouseholdSettings;
