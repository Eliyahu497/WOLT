import React from 'react';
import './Header.css';

// Header component for Wolt website layout.
// Props:
// - searchQuery: The current text query entered in the search bar.
// - setSearchQuery: State setter function to update the search query text.
// - onThemeToggle: Callback function to switch between light and dark modes.
// - isDarkMode: Boolean value representing the active theme state.
// - user: The current authenticated user object (null represents guest mode).
export const Header = ({ searchQuery, setSearchQuery, onThemeToggle, isDarkMode, user }) => {
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
          {/* Invokes onThemeToggle to flip global theme context variables */}
          <button 
            onClick={onThemeToggle} 
            className="theme-toggle-btn" 
            title="Toggle theme"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>

          {/* Conditional Profile Rendering */}
          {/* Renders the user's name and avatar if logged in, otherwise renders a login call-to-action button */}
          {user ? (
            <div className="user-profile">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="user-avatar" 
              />
              <span className="user-name">{user.name}</span>
            </div>
          ) : (
            <button className="login-btn">Log In</button>
          )}
        </div>
      </div>
    </header>
  );
};
