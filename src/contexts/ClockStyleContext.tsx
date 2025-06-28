"use client";

import React, { createContext, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

export type ClockStyle = 'minimalist' | 'digital-glow' | 'elegant-serif' | 'bold-modern';

export const clockStyles = [
  { id: 'minimalist', name: 'Minimalist' },
  { id: 'digital-glow', name: 'Digital Glow' },
  { id: 'elegant-serif', name: 'Elegant Serif' },
  { id: 'bold-modern', name: 'Bold & Modern' },
] as const;

interface ClockStyleContextType {
  clockStyle: ClockStyle;
  setClockStyle: (style: ClockStyle) => void;
}

export const ClockStyleContext = createContext<ClockStyleContextType>({
  clockStyle: 'minimalist',
  setClockStyle: () => {},
});

export function ClockStyleProvider({ children }: { children: React.ReactNode }) {
  const [clockStyle, setClockStyle] = useLocalStorage<ClockStyle>('clock-style', 'minimalist');

  const value = useMemo(() => ({
    clockStyle,
    setClockStyle: (style: ClockStyle) => setClockStyle(style),
  }), [clockStyle, setClockStyle]);

  return (
    <ClockStyleContext.Provider value={value}>
      {children}
    </ClockStyleContext.Provider>
  );
}
