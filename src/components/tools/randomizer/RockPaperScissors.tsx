'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Hand, Scissors, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Choice = 'rock' | 'paper' | 'scissors';
const choices: Choice[] = ['rock', 'paper', 'scissors'];

const RockIcon = (props: React.ComponentProps<'svg'>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14.4 11H18a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-3.6" />
    <path d="M12 9H8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4" />
    <path d="M16 11h-2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2" />
    <path d="M10 11H8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2" />
    <path d="M19 13a2 2 0 1 1-4 0" />
    <path d="M7 19a2 2 0 1 0-4 0" />
  </svg>
);


const choiceIcons: Record<Choice, React.ReactNode> = {
  rock: <RockIcon className="w-16 h-16" />,
  paper: <Hand className="w-16 h-16" />,
  scissors: <Scissors className="w-16 h-16" />,
};

const resultText: Record<string, {text: string, color: string}> = {
    win: {text: "You Win!", color: "text-green-500"},
    lose: {text: "You Lose!", color: "text-red-500"},
    draw: {text: "It's a Draw!", color: "text-muted-foreground"},
}

export default function RockPaperScissors() {
    const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
    const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
    const [result, setResult] = useState<'win' | 'lose' | 'draw' | null>(null);
    const [scores, setScores] = useState({ player: 0, computer: 0 });

    const handlePlay = (choice: Choice) => {
        const compChoice = choices[Math.floor(Math.random() * choices.length)];
        setPlayerChoice(choice);
        setComputerChoice(compChoice);

        if (choice === compChoice) {
            setResult('draw');
        } else if (
            (choice === 'rock' && compChoice === 'scissors') ||
            (choice === 'scissors' && compChoice === 'paper') ||
            (choice === 'paper' && compChoice === 'rock')
        ) {
            setResult('win');
            setScores(s => ({ ...s, player: s.player + 1 }));
        } else {
            setResult('lose');
            setScores(s => ({ ...s, computer: s.computer + 1 }));
        }
    };
    
    const resetGame = () => {
        setPlayerChoice(null);
        setComputerChoice(null);
        setResult(null);
    }
    
    const resetScoresAndGame = () => {
        resetGame();
        setScores({ player: 0, computer: 0 });
    }

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-4">
        <Card className="w-full max-w-sm">
            <CardContent className="p-4 flex justify-around text-center">
                <div>
                    <div className="font-bold text-2xl">{scores.player}</div>
                    <div className="text-sm text-muted-foreground">Your Score</div>
                </div>
                <div>
                    <div className="font-bold text-2xl">{scores.computer}</div>
                    <div className="text-sm text-muted-foreground">CPU Score</div>
                </div>
            </CardContent>
        </Card>

      <div className="grid grid-cols-2 gap-8 items-center min-h-[150px]">
        <div className="flex flex-col items-center gap-2">
            <div className="text-3xl text-primary h-24 w-24 flex items-center justify-center bg-secondary rounded-full">
                {playerChoice ? choiceIcons[playerChoice] : "?"}
            </div>
            <div className="font-semibold">You</div>
        </div>
        <div className="flex flex-col items-center gap-2">
            <div className="text-3xl text-primary h-24 w-24 flex items-center justify-center bg-secondary rounded-full">
                {computerChoice ? choiceIcons[computerChoice] : "?"}
            </div>
            <div className="font-semibold">Computer</div>
        </div>
      </div>

        <div className="h-10 text-3xl font-bold text-center">
            {result && <span className={resultText[result].color}>{resultText[result].text}</span>}
        </div>

      {result ? (
        <div className="flex gap-4">
             <Button onClick={resetGame} size="lg">Play Again</Button>
             <Button onClick={resetScoresAndGame} variant="secondary" size="lg"><RotateCcw/></Button>
        </div>
      ) : (
        <div className="space-y-4 text-center">
            <div className="font-semibold">Choose your weapon:</div>
            <div className="flex gap-4">
                <Button variant="outline" size="lg" onClick={() => handlePlay('rock')}>Rock</Button>
                <Button variant="outline" size="lg" onClick={() => handlePlay('paper')}>Paper</Button>
                <Button variant="outline" size="lg" onClick={() => handlePlay('scissors')}>Scissors</Button>
            </div>
        </div>
      )}
    </div>
  );
}
