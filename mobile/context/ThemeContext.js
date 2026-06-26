import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Colors = {
  light: {
    accent: '#009DE0',
    accentLight: '#E5F5FC',
    background: '#FFFFFF',
    card: '#F2F2F7',
    text: '#1A1A2E',
    subtext: '#8E8E93',
    border: '#E5E5EA',
    error: '#FF3B30',
    success: '#34C759',
    white: '#FFFFFF',
    dark: '#1A1A2E',
    overlay: 'rgba(0,0,0,0.5)',
  },
  dark: {
    accent: '#00A3FF',
    accentLight: '#00334D',
    background: '#121212',
    card: '#1E1E1E',
    text: '#F0F0F0',
    subtext: '#A0A0A0',
    border: '#333333',
    error: '#FF453A',
    success: '#32D74B',
    white: '#FFFFFF',
    dark: '#1A1A2E',
    overlay: 'rgba(0,0,0,0.7)',
  },
};

const ThemeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
  colors: Colors.light,
});

export function ThemeProvider({ children }) {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadTheme() {
      try {
        const savedTheme = await AsyncStorage.getItem('appTheme');
        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === 'dark');
        } else {
          // If no saved preference, use system preference
          setIsDarkMode(systemColorScheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setIsLoaded(true);
      }
    }
    loadTheme();
  }, [systemColorScheme]);

  const toggleDarkMode = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem('appTheme', newMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  // Prevent flash of incorrect theme before AsyncStorage is loaded
  if (!isLoaded) return null;

  const colors = isDarkMode ? Colors.dark : Colors.light;

  const resetTheme = async () => {
    try {
      setIsDarkMode(false);
      await AsyncStorage.setItem('appTheme', 'light');
    } catch (error) {
      console.error('Error resetting theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, resetTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
