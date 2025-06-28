'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Dices } from 'lucide-react';

const diceIcons = [
  <Dice1 key={1} className="w-24 h-24 text-primary" />,
  <Dice2 key={2} className="w-24 h-24 text-primary" />,
  <Dice3 key={3} className="w-24 h-24 text-primary" />,
  <Dice4 key={4} className="w-24 h-24 text-primary" />,
  <Dice5 key={5} className="w-24 h-24 text-primary" />,
  <Dice6 key={6} className="w-24 h-24 text-primary" />,
];

export default function RollDice() {
  const [result, setResult] = useState(6);
  const [isRolling, setIsRolling] = useState(false);

  const roll = () => {
    setIsRolling(true);
    let rollCount = 0;
    const interval = setInterval(() => {
      setResult(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      if (rollCount > 10) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8 min-h-[300px]">
      <div className={`transition-transform duration-300 ${isRolling ? 'animate-spin' : ''}`}>
        {diceIcons[result - 1]}
      </div>
      <Button onClick={roll} disabled={isRolling} size="lg">
        <Dices className="mr-2 h-5 w-5" />
        {isRolling ? 'Rolling...' : 'Roll Again'}
      </Button>
    </div>
  );
}
