import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

// Header component for Wolt website layout.
// Props:
// - searchQuery: The current text query entered in the search bar.
// - setSearchQuery: State setter function to update the search query text.
export const Header = ({ searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();
  // Consume global states from custom hooks
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    // Dynamic styling application: Appends 'dark' or 'light' class modifier based on theme context state
    <header className={`wolt-header ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="header-container">

        {/* 1. Brand Logo Container */}
        <div className="header-logo" onClick={() => navigate(user?.role === 'manager' ? '/owner' : '/')} style={{ cursor: 'pointer' }}>
          <span className="logo-wolt">Wolt</span>
          <span className="logo-badge">Clone</span>
        </div>

        {/* 2. Global Search Bar */}
        {/* Captures text input and propagates changes upstream to the parent state */}
        {(!user || user.role !== 'manager') && (
          <div className="header-search">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search for restaurants or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        )}

        {/* 3. Utility Controls and Profile Slot */}
        <div className="header-actions">

          {/* Light/Dark mode toggle button - visible only after logging in */}
          {user && (
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              title="Toggle theme"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          )}

          {/* Past orders navigation button (visible only if user is logged in and not a manager) */}
          {user && user.role !== 'manager' && (
            <button
              onClick={() => navigate('/orders')}
              className="theme-toggle-btn"
              title="View past orders"
            >
              📋 My Orders
            </button>
          )}

          {/* Conditional Profile Rendering */}
          {user ? (
            <div className="user-profile-group">
              <div className="user-profile" onClick={() => setShowProfile(!showProfile)} style={{ cursor: 'pointer', position: 'relative' }}>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="user-avatar"
                  />
                ) : (
                  <div className="user-avatar-placeholder">
                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
                {/* show user name and if role is manager */}
                <span className="user-name">{user.name} {user.role === 'manager' ? '(Restaurant Owner)' : ''}</span>
                
                {showProfile && (
                  <div className="profile-popup premium-popup">
                    <div className="profile-popup-header">
                      <div className="profile-popup-title-row">
                        <h4>Personal Details</h4>
                        <span className={`role-badge ${user.role === 'manager' ? 'role-manager' : 'role-customer'}`}>
                          {user.role === 'manager' ? '★ Owner' : '👤 Customer'}
                        </span>
                      </div>
                    </div>
                    <div className="profile-popup-body">
                      <div className="profile-detail-item">
                        <span className="detail-icon">👤</span>
                        <div className="detail-text">
                          <span className="detail-label">Name</span>
                          <span className="detail-value">{user.name}</span>
                        </div>
                      </div>
                      <div className="profile-detail-item">
                        <span className="detail-icon">📧</span>
                        <div className="detail-text">
                          <span className="detail-label">Email</span>
                          <span className="detail-value">{user.email}</span>
                        </div>
                      </div>
                      <div className="profile-detail-item">
                        <span className="detail-icon">📱</span>
                        <div className="detail-text">
                          <span className="detail-label">Phone</span>
                          <span className="detail-value">{user.phone}</span>
                        </div>
                      </div>
                      <div className="profile-detail-item">
                        <span className="detail-icon">🆔</span>
                        <div className="detail-text">
                          <span className="detail-label">Username</span>
                          <span className="detail-value">@{user.userName}</span>
                        </div>
                      </div>
                      {user.location && (
                        <div className="profile-detail-item">
                          <span className="detail-icon">📍</span>
                          <div className="detail-text">
                            <span className="detail-label">Location</span>
                            <span className="detail-value">{user.location.lat.toFixed(4)}, {user.location.lng.toFixed(4)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={logout}
                className="logout-btn"
                title="Log Out"
              >
                Logout ➔
              </button>
            </div>
          ) : (
            <button className="login-btn" onClick={() => navigate('/login')}>Log In</button>
          )}
        </div>
      </div>
    </header>
  );
};
