import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { MainView } from './components/Dashboard/MainView';
import './components/Dashboard/theme.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <MainView />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
