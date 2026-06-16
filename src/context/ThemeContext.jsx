import React, { createContext, useState, useContext } from 'react';

// Initialize the context for Theme state tracking
const ThemeContext = createContext();

// ThemeProvider wraps the application and exposes theme states
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle theme state between true (dark) and false (light)
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for convenient theme consumption in children components.
// Bundles useContext(ThemeContext) and adds a safety check to ensure it is used
// within the ThemeProvider boundaries.
export const useTheme = () => {
  const context = useContext(ThemeContext);
  // Throw a clear error if the hook is consumed outside the ThemeProvider
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
