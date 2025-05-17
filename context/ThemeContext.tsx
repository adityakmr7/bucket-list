import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

type ColorScheme = 'light' | 'dark';

interface ThemeContextType {
  theme: ColorScheme;
  toggleTheme: () => void;
  isDark: boolean;
  getColor: (color: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ColorScheme>(systemColorScheme || 'light');

  useEffect(() => {
    if (systemColorScheme) {
      setTheme(systemColorScheme);
    }
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const getColor = (color: string) => {
    const colorPath = color.split('.');
    const themeColors = theme === 'light' ? require('@/tailwind.config').theme.extend.colors.light : require('@/tailwind.config').theme.extend.colors.dark;
    
    let current = themeColors;
    for (const key of colorPath) {
      if (current[key] === undefined) {
        console.warn(`Color path "${color}" not found in ${theme} theme`);
        return '#000000';
      }
      current = current[key];
    }
    
    return current;
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        toggleTheme, 
        isDark: theme === 'dark',
        getColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 