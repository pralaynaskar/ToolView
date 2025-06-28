"use client";

import { useContext } from 'react';
import { ColorThemeContext } from '@/contexts/ColorThemeContext';

export function useColorTheme() {
  const context = useContext(ColorThemeContext);
  if (!context) {
    throw new Error('useColorTheme must be used within a ColorThemeProvider');
  }
  return context;
}
