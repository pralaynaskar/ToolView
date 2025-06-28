
"use client";

import React, { createContext, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

export type WeatherProviderType = 'openweathermap' | 'accuweather';

interface WeatherProviderContextType {
  provider: WeatherProviderType;
  setProvider: (provider: WeatherProviderType) => void;
}

export const WeatherProviderContext = createContext<WeatherProviderContextType>({
  provider: 'openweathermap',
  setProvider: () => {},
});

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useLocalStorage<WeatherProviderType>('weather-provider', 'openweathermap');

  const value = useMemo(() => ({
    provider,
    setProvider,
  }), [provider, setProvider]);

  return (
    <WeatherProviderContext.Provider value={value}>
      {children}
    </WeatherProviderContext.Provider>
  );
}
