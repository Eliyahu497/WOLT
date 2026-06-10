import React, { createContext, useState, useContext } from 'react';
import { mockUser } from '../mockData';

// Initialize the context for user authentication details
const AuthContext = createContext();

// AuthProvider wraps the application and exposes authentication states
export const AuthProvider = ({ children }) => {
  // Start with a mock user session active for development
  const [user, setUser] = useState(mockUser);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [token, setToken] = useState('mock-jwt-token-123'); // Expose mock token for API requests

  // Authenticate user session with credentials (mock implementation)
  const login = (username, password) => {
    setUser(mockUser);
    setIsLoggedIn(true);
    setToken('mock-jwt-token-123');
  };

  // Terminate user session and clear active state
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for convenient authentication consumption in children components.
// Bundles useContext(AuthContext) and adds a safety check to ensure it is used
// within the AuthProvider boundaries.
export const useAuth = () => {
  const context = useContext(AuthContext);
  // Throw a clear error if the hook is consumed outside the AuthProvider
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
