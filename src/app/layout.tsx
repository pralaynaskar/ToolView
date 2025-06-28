
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import React from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { TimeFormatProvider } from '@/contexts/TimeFormatContext';
import { ClockStyleProvider } from '@/contexts/ClockStyleContext';
import { ColorThemeProvider } from '@/contexts/ColorThemeContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'ToolView',
  description: 'A comprehensive suite of converters and a scientific calculator.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&family=Orbitron:wght@700&family=Anton&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased', inter.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ColorThemeProvider>
            <ClockStyleProvider>
              <TimeFormatProvider>
                <CurrencyProvider>
                  {children}
                  <Toaster />
                </CurrencyProvider>
              </TimeFormatProvider>
            </ClockStyleProvider>
          </ColorThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
