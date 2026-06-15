import React from 'react';
import './Header.css';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

// Header component for Wolt website layout.
// Props:
// - searchQuery: The current text query entered in the search bar.
// - setSearchQuery: State setter function to update the search query text.
// - onViewHistory: Callback function to open the Order History screen.
export const Header = ({ searchQuery, setSearchQuery, onViewHistory, onLoginClick }) => {
  // Consume global states from custom hooks
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    // Dynamic styling application: Appends 'dark' or 'light' class modifier based on theme context state
    <header className={`wolt-header ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="header-container">

        {/* 1. Brand Logo Container */}
        <div className="header-logo">
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
              onClick={onViewHistory}
              className="theme-toggle-btn"
              title="View past orders"
            >
              📋 My Orders
            </button>
          )}

          {/* Conditional Profile Rendering */}
          {user ? (
            <div className="user-profile-group">
              <div className="user-profile">
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
            <button className="login-btn" onClick={onLoginClick}>Log In</button>
          )}
        </div>
      </div>
    </header>
  );
};
