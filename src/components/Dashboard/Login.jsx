import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export const Login = ({ onToggleView, onBackToGuest }) => {
  const { login } = useAuth();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setIsSubmitting(true);

    const result = await login(userName, password, role);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Login failed. Please check your username and password.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo">Wolt</span>
          <span className="auth-badge">Clone</span>
          <h2 className="auth-title">Welcome back!</h2>
          <p className="auth-subtitle">Log in to order from your favorite restaurants</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error-message">{error}</div>}

          {/* Role Selection Segmented Cards */}
          <div className="role-selection-group">
            <span className="role-label">Log in as:</span>
            <div className="role-cards-container">
              <div 
                className={`role-card ${role === 'customer' ? 'active' : ''}`}
                onClick={() => setRole('customer')}
              >
                <div className="role-card-icon">🍔</div>
                <div className="role-card-content">
                  <span className="role-card-title">Customer</span>
                  <span className="role-card-desc">regular account</span>
                </div>
              </div>

              <div 
                className={`role-card ${role === 'manager' ? 'active' : ''}`}
                onClick={() => setRole('manager')}
              >
                <div className="role-card-icon">🏪</div>
                <div className="role-card-content">
                  <span className="role-card-title">Restaurant Manager</span>
                  <span className="role-card-desc">Boss account</span>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username <span style={{ color: '#eb5757' }}>*</span></label>
            <input
              type="text"
              id="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="user name"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password <span style={{ color: '#eb5757' }}>*</span></label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
          <div>
            <span>New to Wolt Clone? </span>
            <button onClick={onToggleView} className="auth-toggle-btn">
              Create an account
            </button>
          </div>
          {onBackToGuest && (
            <button onClick={onBackToGuest} className="auth-toggle-btn" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              ← Back to Browsing
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
