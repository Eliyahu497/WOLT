import React, { createContext, useState, useContext, useEffect } from 'react';

// Initialize the context for user authentication details
const AuthContext = createContext();

// AuthProvider wraps the application and exposes authentication states
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Attempt to restore user session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('wolt_token');
      if (storedToken) {
        try {
          const res = await fetch(`/api/users/${storedToken}`);
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            setToken(storedToken);
            setIsLoggedIn(true);
          } else {
            // Token is invalid/expired
            localStorage.removeItem('wolt_token');
          }
        } catch (err) {
          console.warn('Failed to restore session from API:', err);
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  // Authenticate user session with credentials
  const login = async (userName, password, expectedRole = null) => {
    try {
      const res = await fetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, password })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Invalid credentials');
      }

      const { id } = await res.json();

      // Fetch user profile info
      const profileRes = await fetch(`/api/users/${id}`);
      if (!profileRes.ok) {
        throw new Error('Failed to retrieve user profile');
      }

      const userData = await profileRes.json();

      // Validate user role if expectedRole is specified
      if (expectedRole && userData.role !== expectedRole) {
        throw new Error('Selected role does not match this user account role');
      }

      setUser(userData);
      setToken(id);
      setIsLoggedIn(true);
      localStorage.setItem('wolt_token', id);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Register a new user
  const register = async (name, email, phone, address, userName, password, role, avatar) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, address, userName, password, role, avatar })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      // Automatically log the user in after registration
      return await login(userName, password, role);
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Terminate user session and clear active state
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setToken(null);
    localStorage.removeItem('wolt_token');
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, token, login, register, logout, loading }}>
      {!loading && children}
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
