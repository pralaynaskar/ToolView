'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

export default function YesNo() {
  const [result, setResult] = useState<'yes' | 'no' | null>(null);
  const [isDeciding, setIsDeciding] = useState(false);

  const decide = () => {
    setIsDeciding(true);
    setResult(null);
    setTimeout(() => {
      const newResult = Math.random() < 0.5 ? 'yes' : 'no';
      setResult(newResult);
      setIsDeciding(false);
    }, 500);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8 min-h-[300px]">
      <div className="h-24">
        {isDeciding && <div className="text-4xl font-bold animate-pulse">...</div>}
        {result === 'yes' && (
          <div className="flex flex-col items-center gap-2 text-green-500">
            <ThumbsUp className="w-16 h-16" />
            <span className="text-4xl font-bold">YES</span>
          </div>
        )}
        {result === 'no' && (
          <div className="flex flex-col items-center gap-2 text-red-500">
            <ThumbsDown className="w-16 h-16" />
            <span className="text-4xl font-bold">NO</span>
          </div>
        )}
      </div>
      <Button onClick={decide} disabled={isDeciding} size="lg">
        {isDeciding ? 'Deciding...' : (result === null ? 'Decide' : 'Decide Again')}
      </Button>
    </div>
  );
}
