import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = [
  { id: 'light', name: 'Light', icon: '☀️' },
  { id: 'dark', name: 'Dark', icon: '🌙' },
  { id: 'blue', name: 'Blue Ocean', icon: '🌊' },
  { id: 'purple', name: 'Purple Dream', icon: '💜' },
  { id: 'green', name: 'Green Forest', icon: '🌲' }
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to light
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
