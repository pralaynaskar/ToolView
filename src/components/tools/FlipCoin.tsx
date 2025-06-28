'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CircleDollarSign } from 'lucide-react';

const Coin = ({ side }: { side: 'heads' | 'tails' }) => (
  <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold transition-transform duration-500 bg-yellow-400 border-8 border-yellow-500 text-yellow-800`}>
    {side === 'heads' ? 'H' : 'T'}
  </div>
);

export default function FlipCoin() {
  const [result, setResult] = useState<'heads' | 'tails'>('heads');
  const [isFlipping, setIsFlipping] = useState(false);

  const flip = () => {
    setIsFlipping(true);
    setTimeout(() => {
      const newResult = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(newResult);
      setIsFlipping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8 min-h-[300px]">
      <div className={`relative w-32 h-32 preserve-3d transition-transform duration-1000 ${isFlipping ? 'animate-flip' : ''}`}>
        <style jsx>{`
          .preserve-3d { transform-style: preserve-3d; }
          @keyframes flip {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(1800deg); }
          }
          .animate-flip {
            animation: flip 1s ease-out;
          }
        `}</style>
        <Coin side={result} />
      </div>
       <div className="text-xl font-semibold capitalize">{isFlipping ? 'Flipping...' : `It's ${result}!`}</div>
      <Button onClick={flip} disabled={isFlipping} size="lg">
        <CircleDollarSign className="mr-2 h-5 w-5" />
        {isFlipping ? 'Flipping...' : 'Flip Again'}
      </Button>
    </div>
  );
}
