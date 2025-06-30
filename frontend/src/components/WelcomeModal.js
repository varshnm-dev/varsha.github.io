import React from 'react';
import { useAuth } from '../context/AuthContext';

const WelcomeModal = ({ isOpen, onClose, onStartTour }) => {
  const { user } = useAuth();

  if (!isOpen) return null;

  const isAdmin = user?.role === 'admin';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
      animation: 'fadeIn 0.3s ease-in-out'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '15px',
        padding: '40px',
        maxWidth: '550px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        position: 'relative',
        animation: 'slideUp 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>
            {isAdmin ? '🎉' : '👋'}
          </div>
          <h1 style={{ 
            margin: 0, 
            color: '#333', 
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            Welcome to Household Gamification!
          </h1>
          <p style={{ 
            color: '#666', 
            fontSize: '16px',
            margin: '10px 0 0 0'
          }}>
            {isAdmin 
              ? "You're now the admin of your household! 🏠" 
              : "You've successfully joined the household! 🏠"
            }
          </p>
        </div>

        {/* Main Content */}
        <div style={{ marginBottom: '30px' }}>
          {isAdmin ? (
            <div>
              <h3 style={{ color: '#333', marginBottom: '20px', fontSize: '20px' }}>
                As a household admin, you can:
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>🛍️</span>
                  <div>
                    <strong style={{ color: '#333' }}>Browse the Chore Marketplace</strong>
                    <div style={{ color: '#666', fontSize: '14px' }}>Add chores from our curated library of 25+ templates</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>✏️</span>
                  <div>
                    <strong style={{ color: '#333' }}>Create Custom Chores</strong>
                    <div style={{ color: '#666', fontSize: '14px' }}>Design your own chores with custom points and categories</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>⚙️</span>
                  <div>
                    <strong style={{ color: '#333' }}>Manage Household Settings</strong>
                    <div style={{ color: '#666', fontSize: '14px' }}>Invite family members and customize your household</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>🏆</span>
                  <div>
                    <strong style={{ color: '#333' }}>Track Progress & Achievements</strong>
                    <div style={{ color: '#666', fontSize: '14px' }}>Monitor family progress and celebrate achievements</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 style={{ color: '#333', marginBottom: '20px', fontSize: '20px' }}>
                As a household member, you can:
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>✅</span>
                  <div>
                    <strong style={{ color: '#333' }}>Complete Chores & Earn Points</strong>
                    <div style={{ color: '#666', fontSize: '14px' }}>Finish tasks and build up your score</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>🏆</span>
                  <div>
                    <strong style={{ color: '#333' }}>Compete on Leaderboards</strong>
                    <div style={{ color: '#666', fontSize: '14px' }}>See daily, weekly, and monthly rankings</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>🔥</span>
                  <div>
                    <strong style={{ color: '#333' }}>Build Streaks & Unlock Achievements</strong>
                    <div style={{ color: '#666', fontSize: '14px' }}>Maintain daily streaks and earn special badges</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>📊</span>
                  <div>
                    <strong style={{ color: '#333' }}>Track Your Progress</strong>
                    <div style={{ color: '#666', fontSize: '14px' }}>Monitor your completed chores and points earned</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '10px', 
          marginBottom: '25px',
          textAlign: 'center'
        }}>
          <h4 style={{ color: '#333', margin: '0 0 10px 0' }}>Ready to get started?</h4>
          <p style={{ color: '#666', margin: '0 0 15px 0', fontSize: '14px' }}>
            Take a quick tour to see how everything works!
          </p>
          <button
            onClick={onStartTour}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            🚀 Start Interactive Tour
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          justifyContent: 'center'
        }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Skip for now
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#999',
            lineHeight: 1
          }}
        >
          ×
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default WelcomeModal;