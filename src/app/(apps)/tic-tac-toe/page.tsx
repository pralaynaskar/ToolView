'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hash, RotateCcw, X, Circle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Player = 'X' | 'O';
type SquareValue = Player | null;

const calculateWinner = (squares: SquareValue[]): Player | null => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const TicTacToeSquare = ({ value, onClick }: { value: SquareValue, onClick: () => void }) => (
    <Button 
        variant="outline"
        className="w-24 h-24 md:w-32 md:h-32 text-5xl md:text-7xl font-bold flex items-center justify-center p-0"
        onClick={onClick}
    >
        {value === 'X' && <X className="size-16 text-primary" />}
        {value === 'O' && <Circle className="size-14 text-destructive" />}
    </Button>
);

export default function TicTacToePage() {
    const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const { toast } = useToast();

    const winner = calculateWinner(board);
    const isDraw = !winner && board.every(Boolean);
    
    const handleClick = (i: number) => {
        if (winner || board[i]) {
            return;
        }
        const newBoard = [...board];
        newBoard[i] = xIsNext ? 'X' : 'O';
        setBoard(newBoard);
        setXIsNext(!xIsNext);
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setXIsNext(true);
    };
    
    useEffect(() => {
        if (winner) {
            toast({ title: 'Game Over!', description: `Player ${winner} wins!` });
        } else if (isDraw) {
            toast({ title: 'Game Over!', description: `It's a draw!` });
        }
    }, [winner, isDraw, toast]);


    const getStatus = () => {
        if (winner) return `Winner: Player ${winner}`;
        if (isDraw) return "It's a Draw!";
        return `Next player: ${xIsNext ? 'X' : 'O'}`;
    };

    return (
        <Card className="w-full max-w-lg mx-auto shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Hash className="size-6" /> Tic-Tac-Toe
                </CardTitle>
                <p className="text-lg font-semibold text-muted-foreground">{getStatus()}</p>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4 p-4">
                <div className="grid grid-cols-3 gap-2 bg-muted p-2 rounded-lg">
                    {board.map((square, i) => (
                        <TicTacToeSquare key={i} value={square} onClick={() => handleClick(i)} />
                    ))}
                </div>
                <Button onClick={resetGame}>
                    <RotateCcw className="mr-2" /> Reset Game
                </Button>
            </CardContent>
        </Card>
    );
}
