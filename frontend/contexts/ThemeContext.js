// contexts/ThemeContext.js
// Context para gestionar el tema claro/oscuro

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

// Definir colores para cada tema
export const lightTheme = {
  // Backgrounds
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  backgroundTertiary: '#E8E8E8',
  card: '#FFFFFF',
  
  // Text
  text: '#000000',
  textSecondary: '#666666',
  textTertiary: '#999999',
  
  // Accent
  primary: '#D4AF37',
  primaryDark: '#B8962E',
  
  // Borders
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  
  // Status
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
  
  // Special
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const darkTheme = {
  // Backgrounds
  background: '#0A0A0A',
  backgroundSecondary: '#1C1C1E',
  backgroundTertiary: '#2C2C2E',
  card: '#1C1C1E',
  
  // Text
  text: '#F5F5F5',
  textSecondary: '#C7C7CC',
  textTertiary: '#8E8E93',
  
  // Accent
  primary: '#D4AF37',
  primaryDark: '#B8962E',
  
  // Borders
  border: '#2C2C2E',
  borderLight: '#3C3C3E',
  
  // Status
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
  
  // Special
  shadow: 'rgba(0, 0, 0, 0.5)',
  overlay: 'rgba(0, 0, 0, 0.7)',
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);

  // Cargar tema guardado al iniciar
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error cargando tema:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error guardando tema:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDarkMode,
        toggleTheme,
        loading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};