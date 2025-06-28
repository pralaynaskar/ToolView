
"use client";

import { useContext } from 'react';
import { WeatherProviderContext } from '@/contexts/WeatherProviderContext';

export function useWeatherProvider() {
  const context = useContext(WeatherProviderContext);
  if (!context) {
    throw new Error('useWeatherProvider must be used within a WeatherProvider');
  }
  return context;
}
