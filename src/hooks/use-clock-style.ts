"use client";

import { useContext } from 'react';
import { ClockStyleContext } from '@/contexts/ClockStyleContext';

export function useClockStyle() {
  const context = useContext(ClockStyleContext);
  if (!context) {
    throw new Error('useClockStyle must be used within a ClockStyleProvider');
  }
  return context;
}
