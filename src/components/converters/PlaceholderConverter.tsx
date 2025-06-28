'use client';
import React from 'react';
import { Construction } from 'lucide-react';

export default function PlaceholderConverter({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 min-h-[300px] bg-secondary/50 rounded-lg">
      <Construction className="w-16 h-16 text-primary/50" />
      <h3 className="text-xl font-semibold">Coming Soon!</h3>
      <p className="text-muted-foreground">The {name} converter is under construction.</p>
    </div>
  );
}
