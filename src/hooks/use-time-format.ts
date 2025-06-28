"use client";

import { useContext } from 'react';
import { TimeFormatContext } from '@/contexts/TimeFormatContext';

export function useTimeFormat() {
  const context = useContext(TimeFormatContext);
  if (!context) {
    throw new Error('useTimeFormat must be used within a TimeFormatProvider');
  }
  return context;
}
