"use client";

import { useState, useEffect, useCallback } from "react";

function getStoredValue<T>(key: string, initialValue: T | (() => T)): T {
  if (typeof window === "undefined") {
    return initialValue instanceof Function ? initialValue() : initialValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : (initialValue instanceof Function ? initialValue() : initialValue);
  } catch (error) {
    console.warn(`Error reading localStorage key “${key}”:`, error);
    return initialValue instanceof Function ? initialValue() : initialValue;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [storedValue, setStoredValue] = useState<T>(() => getStoredValue(key, initialValue));

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      setStoredValue(prevValue => {
        const valueToStore = value instanceof Function ? value(prevValue) : value;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        return valueToStore;
      });
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key]);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === key && event.newValue) {
          try {
            setStoredValue(JSON.parse(event.newValue));
          } catch(error) {
             console.warn(`Error parsing storage event value for key “${key}”:`, error);
          }
        }
      };
      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, [key]);

  return [storedValue, setValue] as const;
}
