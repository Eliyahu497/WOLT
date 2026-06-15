import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export const Login = ({ onToggleView }) => {
  const { login } = useAuth();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
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

    const result = await login(userName, password);
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

          <div className="form-group">
            <label htmlFor="username">Username</label>
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
            <label htmlFor="password">Password</label>
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

        <div className="auth-footer">
          <span>New to Wolt Clone? </span>
          <button onClick={onToggleView} className="auth-toggle-btn">
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
};
