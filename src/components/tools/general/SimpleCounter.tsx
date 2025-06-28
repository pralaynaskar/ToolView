'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus, RotateCcw } from 'lucide-react';

export default function SimpleCounter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8">
      <div className="text-8xl font-bold text-primary">{count}</div>
      <div className="flex gap-4">
        <Button onClick={() => setCount(c => c - 1)} variant="outline" size="lg">
          <Minus className="mr-2" /> Decrement
        </Button>
        <Button onClick={() => setCount(0)} variant="secondary" size="lg">
          <RotateCcw className="mr-2" /> Reset
        </Button>
        <Button onClick={() => setCount(c => c + 1)} variant="outline" size="lg">
          Increment <Plus className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
