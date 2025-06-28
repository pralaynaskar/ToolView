
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function WeatherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-secondary/40 dark:bg-background">
      <header className="sticky top-0 z-40 flex items-center justify-center border-b bg-background/80 p-4 backdrop-blur-sm relative">
        <div className="absolute left-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <h1 className="text-xl font-bold text-primary">
          ToolView
        </h1>
      </header>
      <main className="p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
