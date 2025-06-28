"use client"

import React, { createContext, useEffect, useMemo } from 'react'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { themes } from '@/lib/themes'

interface ColorThemeContextType {
  theme: string
  setTheme: (theme: string) => void
}

export const ColorThemeContext = createContext<ColorThemeContextType>({
  theme: 'zinc',
  setTheme: () => {},
})

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useLocalStorage<string>('color-theme', 'zinc');

  useEffect(() => {
    document.body.classList.forEach(className => {
      if (className.startsWith('theme-')) {
        document.body.classList.remove(className);
      }
    });
    
    const selectedTheme = themes.find((t) => t.name === theme);
    if (selectedTheme) {
      document.body.classList.add(`theme-${selectedTheme.name}`);
    } else {
      document.body.classList.add('theme-zinc');
    }
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    setTheme: (newTheme: string) => {
        const themeExists = themes.some(t => t.name === newTheme);
        if (themeExists) {
            setTheme(newTheme);
        }
    },
  }), [theme, setTheme]);

  return (
    <ColorThemeContext.Provider value={value}>
      {children}
    </ColorThemeContext.Provider>
  )
}
