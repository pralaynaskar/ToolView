'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Flag, RotateCcw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime(t => t + 10); // Update every 10ms
      }, 10);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTime(0);
    setLaps([]);
  };
  const addLap = () => {
    if (isActive) {
      setLaps(l => [time, ...l]);
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    const ms = (milliseconds % 1000).toString().padStart(3, '0').slice(0, 2);
    return `${minutes}:${seconds}.${ms}`;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-4">
      <div className="font-mono text-8xl font-bold text-primary tracking-tighter">
        {formatTime(time)}
      </div>
      <div className="flex gap-4">
        <Button onClick={toggleTimer} size="lg">
          {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
          {isActive ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={addLap} variant="outline" size="lg" disabled={!isActive}>
          <Flag className="mr-2" /> Lap
        </Button>
        <Button onClick={resetTimer} variant="secondary" size="lg">
          <RotateCcw className="mr-2" /> Reset
        </Button>
      </div>
      {laps.length > 0 && (
        <ScrollArea className="h-48 w-full max-w-xs rounded-md border p-2">
          <ul className="divide-y">
            {laps.map((lap, i) => (
              <li key={i} className="flex justify-between items-center p-2 font-mono">
                <span>Lap {laps.length - i}</span>
                <span>{formatTime(lap)}</span>
              </li>
            ))}
          </ul>
        </ScrollArea>
      )}
    </div>
  );
}
