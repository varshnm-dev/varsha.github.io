import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const CompletedChores = () => {
  const [completedChores, setCompletedChores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCompletedChores = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getCompletedChores({
        page: currentPage,
        limit: 10
      });
      setCompletedChores(response.data.data.completedChores);
      setTotalPages(response.data.pagination.pages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch completed chores');
      toast.error('Failed to load completed chores');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchCompletedChores();
  }, [currentPage, fetchCompletedChores]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRatingStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  const handleDeleteCompletedChore = async (id) => {
    if (window.confirm('Are you sure you want to delete this completed chore?')) {
      try {
        await api.deleteCompletedChore(id);
        toast.success('Completed chore deleted successfully');
        fetchCompletedChores();
      } catch (err) {
        toast.error('Failed to delete completed chore');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '30px', color: '#333' }}>Completed Chores</h1>

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

        {/* Completed Chores List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {completedChores.map(completed => (
            <div
              key={completed._id}
              style={{
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '10px',
                padding: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '24px', marginRight: '10px' }}>
                      {completed.chore?.emoji || '🏠'}
                    </span>
                    <h3 style={{ margin: 0, color: '#333' }}>
                      {completed.chore?.name || 'Unknown Chore'}
                    </h3>
                    <span style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '15px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginLeft: '10px'
                    }}>
                      Completed
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '20px', marginBottom: '10px', fontSize: '14px', color: '#666' }}>
                    <div>
                      <strong>Completed by:</strong> {completed.user.username}
                    </div>
                    <div>
                      <strong>Points earned:</strong> {completed.pointsEarned}
                    </div>
                    <div>
                      <strong>Quality rating:</strong> {getRatingStars(completed.qualityRating)} ({completed.qualityRating}/5)
                    </div>
                  </div>

                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                    <strong>Completed on:</strong> {formatDate(completed.completedAt)}
                  </div>

                  {completed.notes && (
                    <div style={{ 
                      backgroundColor: '#f8f9fa', 
                      padding: '10px', 
                      borderRadius: '5px', 
                      fontSize: '14px',
                      fontStyle: 'italic'
                    }}>
                      <strong>Notes:</strong> {completed.notes}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteCompletedChore(completed._id)}
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
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '10px', 
            marginTop: '30px' 
          }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                backgroundColor: currentPage === 1 ? '#e9ecef' : '#007bff',
                color: currentPage === 1 ? '#6c757d' : 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>

            <span style={{ fontSize: '14px', color: '#666' }}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                backgroundColor: currentPage === totalPages ? '#e9ecef' : '#007bff',
                color: currentPage === totalPages ? '#6c757d' : 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </div>
        )}

        {completedChores.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <h3>No completed chores yet</h3>
            <p>Complete some chores to see them here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedChores;