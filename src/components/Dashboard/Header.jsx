import React from 'react';
import './Header.css';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

// Header component for Wolt website layout.
// Props:
// - searchQuery: The current text query entered in the search bar.
// - setSearchQuery: State setter function to update the search query text.
// - onViewHistory: Callback function to open the Order History screen.
export const Header = ({ searchQuery, setSearchQuery, onViewHistory }) => {
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

        {/* 3. Utility Controls and Profile Slot */}
        <div className="header-actions">

          {/* Light/Dark mode toggle button */}
          {/* Invokes toggleTheme to flip global theme context variables */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title="Toggle theme"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>

          {/* Past orders navigation button (visible only if user is logged in) */}
          {user && (
            <button
              onClick={onViewHistory}
              className="theme-toggle-btn"
              title="View past orders"
            >
              📋 My Orders
            </button>
          )}

          {/* Conditional Profile Rendering */}
          {/* Renders the user's name, avatar, and logout action if logged in, otherwise renders a login button */}
          {user ? (
            <div className="user-profile-group">
              <div className="user-profile">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="user-avatar"
                />
                {/* show user name and if role is restaurant_owner */}
                <span className="user-name">{user.name} ({user.role === 'restaurant_owner' ? 'Restaurant Owner' : ''})</span>
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
            <button className="login-btn">Log In</button>
          )}
        </div>
      </div>
    </header>
  );
};
