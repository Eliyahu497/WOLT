import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { post, get } from '../services/api';

// ─── Context ────────────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

// Storage keys
const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

// ─── Provider ───────────────────────────────────────────────────────────────────

/**
 * AuthProvider wraps the app and provides authentication state & actions.
 *
 * Exposes via context:
 *  - user        {object|null}  – The authenticated user object ({ id, userName, role, ... }).
 *  - token       {string|null}  – The JWT token string.
 *  - isLoading   {boolean}      – True while the initial token is being restored from storage.
 *  - isLoggedIn  {boolean}      – Convenience flag: !!token.
 *  - role        {string|null}  – Shortcut: user?.role ('customer' | 'manager').
 *  - login(userName, password)  – Authenticates and stores the session.
 *  - register(userData)         – Creates a new account on the server.
 *  - logout()                   – Clears the stored session.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Restore session on app start ─────────────────────────────────────────────
  useEffect(() => {
    async function restoreSession() {
      try {
        const [savedToken, savedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);

        if (savedToken) {
          setToken(savedToken);

          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            // Token exists but no cached user – attempt to decode the user id
            // from the JWT payload and fetch the profile from the server.
            try {
              const payload = JSON.parse(atob(savedToken.split('.')[1]));
              const profile = await get(`/api/users/${payload.id}`);
              setUser(profile);
              await AsyncStorage.setItem(USER_KEY, JSON.stringify(profile));
            } catch {
              // Token is likely expired or invalid – clear everything
              await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
              setToken(null);
              setUser(null);
            }
          }
        }
      } catch {
        // Silently fail – user stays logged out
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────────
  /**
   * Authenticates a user by calling POST /api/tokens.
   * On success, stores the JWT token and fetches the full user profile.
   *
   * @param {string} userName - The user's username.
   * @param {string} password - The user's password.
   * @returns {Promise<object>} The user profile object.
   * @throws Will throw if credentials are invalid.
   */
  const login = useCallback(async (userName, password, expectedRole) => {
    // POST /api/tokens → { id, token }
    const data = await post('/api/tokens', { userName, password });

    // Temporarily persist token so API calls work
    await AsyncStorage.setItem(TOKEN_KEY, data.token);

    try {
      // Fetch full user profile using the returned id
      const profile = await get(`/api/users/${data.id}`);

      if (expectedRole && profile.role !== expectedRole) {
        throw new Error(`Access denied. You are registered as a ${profile.role}, not a ${expectedRole}.`);
      }

      setToken(data.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(profile));
      setUser(profile);

      return profile;
    } catch (err) {
      await AsyncStorage.removeItem(TOKEN_KEY);
      setToken(null);
      throw err;
    }
  }, []);

  // ── Register ──────────────────────────────────────────────────────────────────
  /**
   * Registers a new user account by calling POST /api/users.
   * Does NOT automatically log the user in – call login() afterwards.
   *
   * @param {object} userData - The registration payload:
   *   { name, email, phone, location: { lat, lng }, userName, password, role, avatar }
   * @returns {Promise<void>}
   * @throws Will throw if validation fails or username is taken.
   */
  const register = useCallback(async (userData) => {
    await post('/api/users', userData);
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────────
  /**
   * Clears the stored token and user data, returning the app to the
   * logged-out state.
   */
  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    setToken(null);
    setUser(null);
  }, []);

  // ── Context value ─────────────────────────────────────────────────────────────
  const value = {
    user,
    token,
    isLoading,
    isLoggedIn: !!token,
    role: user?.role ?? null, // 'customer' | 'manager' | null
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────────

/**
 * Custom hook to consume the AuthContext.
 * Must be called inside an <AuthProvider>.
 *
 * @returns {{ user, token, isLoading, isLoggedIn, role, login, register, logout }}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return context;
}

export default AuthContext;
