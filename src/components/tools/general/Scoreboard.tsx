'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Scoreboard() {
  const [team1Name, setTeam1Name] = useState('Team A');
  const [team2Name, setTeam2Name] = useState('Team B');
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);

  const resetScores = () => {
    setTeam1Score(0);
    setTeam2Score(0);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Input
              value={team1Name}
              onChange={e => setTeam1Name(e.target.value)}
              className="text-2xl font-bold text-center border-0 focus-visible:ring-1"
            />
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="text-7xl font-bold text-primary">{team1Score}</div>
            <div className="flex gap-2">
              <Button onClick={() => setTeam1Score(s => s + 1)}>+1</Button>
              <Button onClick={() => setTeam1Score(s => s + 5)}>+5</Button>
              <Button variant="outline" onClick={() => setTeam1Score(s => Math.max(0, s - 1))}>-1</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Input
              value={team2Name}
              onChange={e => setTeam2Name(e.target.value)}
              className="text-2xl font-bold text-center border-0 focus-visible:ring-1"
            />
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="text-7xl font-bold text-primary">{team2Score}</div>
            <div className="flex gap-2">
              <Button onClick={() => setTeam2Score(s => s + 1)}>+1</Button>
              <Button onClick={() => setTeam2Score(s => s + 5)}>+5</Button>
              <Button variant="outline" onClick={() => setTeam2Score(s => Math.max(0, s - 1))}>-1</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="text-center">
        <Button onClick={resetScores} variant="destructive">
          <RotateCcw className="mr-2" /> Reset Scores
        </Button>
      </div>
    </div>
  );
}
