'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Always use dark theme
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Always set to dark theme regardless of localStorage
    setTheme('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    // Store dark theme in localStorage for consistency
    localStorage.setItem('theme', 'dark');
  }, []);

  // Toggle function exists but does nothing to maintain API compatibility
  const toggleTheme = () => {
    // Do nothing - always stay in dark mode
    console.log('Theme switching is disabled');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 