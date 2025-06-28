"use client";

import React, { createContext, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

export type TimeFormat = '12h' | '24h';

interface TimeFormatContextType {
  timeFormat: TimeFormat;
  setTimeFormat: (format: TimeFormat) => void;
}

export const TimeFormatContext = createContext<TimeFormatContextType>({
  timeFormat: '12h',
  setTimeFormat: () => {},
});

export function TimeFormatProvider({ children }: { children: React.ReactNode }) {
  const [timeFormat, setTimeFormat] = useLocalStorage<TimeFormat>('time-format', '12h');

  const value = useMemo(() => ({
    timeFormat,
    setTimeFormat: (format: TimeFormat) => setTimeFormat(format),
  }), [timeFormat, setTimeFormat]);

  return (
    <TimeFormatContext.Provider value={value}>
      {children}
    </TimeFormatContext.Provider>
  );
}
