"use client";

import React, { createContext, useState, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

export type Currency = {
  code: string;
  symbol: string;
  name: string;
};

export const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

export const CurrencyContext = createContext<CurrencyContextType>({
  currency: currencies[0],
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currencyCode, setCurrencyCode] = useLocalStorage<string>('currency', 'USD');

  const setCurrency = (currency: Currency) => {
    setCurrencyCode(currency.code);
  };

  const currency = useMemo(
    () => currencies.find((c) => c.code === currencyCode) || currencies[0],
    [currencyCode]
  );

  const value = useMemo(() => ({ currency, setCurrency }), [currency]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}
