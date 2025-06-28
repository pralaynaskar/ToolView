'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function Countdown() {
  const [initialTime, setInitialTime] = useState(60); // in seconds
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(t => t - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value, 10) || 0;
    setInitialTime(newTime);
    if (!isActive) {
      setTime(newTime);
    }
  };
  
  const toggleTimer = () => {
    if (time === 0) resetTimer();
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(initialTime);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8">
      <div className="font-mono text-8xl font-bold text-primary tracking-tighter">
        {formatTime(time)}
      </div>
      <Progress value={(time / initialTime) * 100} className="w-full max-w-md" />
      <div className="flex items-end gap-4">
        <div className="space-y-2">
            <Label htmlFor="countdown-seconds">Set Seconds</Label>
            <Input
              id="countdown-seconds"
              type="number"
              value={initialTime}
              onChange={handleTimeChange}
              className="w-32 text-center"
              disabled={isActive}
            />
        </div>
        <div className="flex gap-2">
          <Button onClick={toggleTimer} size="lg">
            {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
            {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={resetTimer} variant="secondary" size="lg">
            <RotateCcw className="mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
