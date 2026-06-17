import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                disabled={isSubmitting}
              />
              <button 
                type="button" 
                className="password-toggle-btn" 
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
          <div>
            <span>New to Wolt Clone? </span>
            <button onClick={() => navigate('/register')} className="auth-toggle-btn">
              Create an account
            </button>
          </div>
          <button onClick={() => navigate('/')} className="auth-toggle-btn" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            ← Back to Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
