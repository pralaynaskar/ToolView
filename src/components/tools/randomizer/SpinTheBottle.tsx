'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const BottleIcon = (props: React.ComponentProps<'svg'>) => (
  <svg width="60" height="200" viewBox="0 0 60 200" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M45 200H15C12.2386 200 10 197.761 10 195V90C10 87.2386 12.2386 85 15 85H45C47.7614 85 50 87.2386 50 90V195C50 197.761 47.7614 200 45 200Z" fill="#84CC16"/>
    <path d="M40 85H20V40C20 34.4772 24.4772 30 30 30C35.5228 30 40 34.4772 40 40V85Z" fill="#A3E635"/>
    <rect x="25" y="10" width="10" height="20" rx="3" fill="#A3E635"/>
    <rect x="23" width="14" height="10" rx="5" fill="#A3E635"/>
  </svg>
);


export default function SpinTheBottle() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    // Add multiple full rotations plus a random amount for variability
    const newRotation = rotation + 360 * (Math.floor(Math.random() * 5) + 3) + Math.random() * 360;
    setRotation(newRotation);
    
    // The duration should match the CSS transition duration
    setTimeout(() => {
        setIsSpinning(false);
    }, 3000); 
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-12 p-8 min-h-[400px]">
      <div 
        className="transform transition-transform duration-3000 ease-out" 
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <BottleIcon />
      </div>
      <Button onClick={spin} disabled={isSpinning} size="lg">
        {isSpinning ? 'Spinning...' : 'Spin the Bottle'}
      </Button>
    </div>
  );
}
