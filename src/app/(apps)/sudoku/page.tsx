
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Brain, Timer, RotateCcw, Lightbulb, Eraser, Play, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Advanced' | 'Random';
type Grid = (number | null)[][];
type Cell = { row: number; col: number } | null;

const EMPTY_CELL = null;

// --- Sudoku Logic ---

const puzzleStrings = {
  Easy: '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79',
  Medium: '..9748...7.........2.1.9...5...7...6...9.4..8..1.5.3...2.9.6...7.4.8...3..2.1.',
  Hard: '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..',
  Advanced: '...5.1.8...1..4....2...8.7.4...5..6.7.9.4.6.2.1..8...7.9.1.5...3....9..7...2.6.4...',
};

function stringToGrid(str: string): Grid {
  const grid: Grid = [];
  for (let i = 0; i < 9; i++) {
    const row: (number | null)[] = [];
    for (let j = 0; j < 9; j++) {
      const char = str[i * 9 + j];
      row.push(char === '.' ? EMPTY_CELL : parseInt(char, 10));
    }
    grid.push(row);
  }
  return grid;
}

function findEmpty(grid: Grid): [number, number] | null {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === EMPTY_CELL) {
        return [r, c];
      }
    }
  }
  return null;
}

function isCellValid(grid: Grid, row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num) return false;
    if (grid[i][col] === num) return false;
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (grid[startRow + r][startCol + c] === num) return false;
    }
  }
  return true;
}


function solve(grid: Grid): Grid | null {
  const newGrid = grid.map(r => [...r]);
  const emptyPos = findEmpty(newGrid);

  if (!emptyPos) {
    return newGrid; // Solved
  }

  const [row, col] = emptyPos;
  for (let num = 1; num <= 9; num++) {
    if (isCellValid(newGrid, row, col, num)) {
      newGrid[row][col] = num;
      const result = solve(newGrid);
      if (result) {
        return result;
      }
      newGrid[row][col] = EMPTY_CELL; // Backtrack
    }
  }
  return null;
}

function generatePuzzle(difficulty: Difficulty): Grid {
    const difficulties: Exclude<Difficulty, 'Random'>[] = ['Easy', 'Medium', 'Hard', 'Advanced'];
    if (difficulty === 'Random') {
        difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    }
    const baseString = puzzleStrings[difficulty as Exclude<Difficulty, 'Random'>];
    return stringToGrid(baseString);
}


export default function SudokuPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [grid, setGrid] = useState<Grid | null>(null);
  const [initialGrid, setInitialGrid] = useState<Grid | null>(null);
  const [solution, setSolution] = useState<Grid | null>(null);
  const [selectedCell, setSelectedCell] = useState<Cell>(null);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [errors, setErrors] = useState<boolean[][]>([]);

  const { toast } = useToast();

  const createNewGame = useCallback((diff: Difficulty) => {
    const newPuzzle = generatePuzzle(diff);
    const newSolution = solve(newPuzzle);
    setInitialGrid(newPuzzle.map(r => [...r]));
    setGrid(newPuzzle.map(r => [...r]));
    setSolution(newSolution);
    setSelectedCell(null);
    setIsSolved(false);
    setTime(0);
    setIsActive(true);
    setErrors(Array(9).fill(null).map(() => Array(9).fill(false)));
  }, []);

  useEffect(() => {
    createNewGame(difficulty);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && !isSolved) {
      interval = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isSolved]);

  const handleCellClick = (row: number, col: number) => {
    if (initialGrid && initialGrid[row][col] === EMPTY_CELL) {
      setSelectedCell({ row, col });
    } else {
      setSelectedCell(null);
    }
  };

  const validateGrid = useCallback((currentGrid: Grid) => {
      const newErrors = Array(9).fill(null).map(() => Array(9).fill(false));
      const hasError = false;
      for(let r=0; r<9; r++) {
          for (let c=0; c<9; c++) {
              const val = currentGrid[r][c];
              if (val !== EMPTY_CELL) {
                const gridCopy = currentGrid.map(row => [...row]);
                gridCopy[r][c] = EMPTY_CELL; // Temporarily empty the cell to validate against the rest
                if (!isCellValid(gridCopy, r, c, val)) {
                    newErrors[r][c] = true;
                }
              }
          }
      }
      setErrors(newErrors);
      return !newErrors.flat().some(e => e);
  }, []);

  const checkIfSolved = useCallback((currentGrid: Grid) => {
      for(let r=0; r<9; r++) {
          for(let c=0; c<9; c++) {
              if (currentGrid[r][c] === EMPTY_CELL) return false;
          }
      }
      if (validateGrid(currentGrid)) {
          setIsSolved(true);
          setIsActive(false);
          toast({ title: "Congratulations!", description: `You solved the puzzle in ${formatTime(time)}.` });
          return true;
      }
      return false;
  }, [time, toast, validateGrid]);


  const handleNumberInput = useCallback((num: number) => {
    if (!selectedCell || !grid || isSolved) return;
    const { row, col } = selectedCell;
    if (initialGrid && initialGrid[row][col] !== EMPTY_CELL) return;

    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = num;
    setGrid(newGrid);
    
    validateGrid(newGrid);
    checkIfSolved(newGrid);
  }, [selectedCell, grid, isSolved, initialGrid, checkIfSolved, validateGrid]);
  
  const handleErase = () => {
    if (!selectedCell || !grid || isSolved) return;
    const { row, col } = selectedCell;
    if (initialGrid && initialGrid[row][col] !== EMPTY_CELL) return;
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = EMPTY_CELL;
    setGrid(newGrid);
    validateGrid(newGrid);
  };
  
  const handleHint = () => {
    if (!grid || isSolved) return;
    if (selectedCell && grid[selectedCell.row][selectedCell.col] === EMPTY_CELL) {
      const { row, col } = selectedCell;
       if (solution) {
          const newGrid = grid.map(r => [...r]);
          newGrid[row][col] = solution[row][col];
          setGrid(newGrid);
          validateGrid(newGrid);
          checkIfSolved(newGrid);
       }
    } else {
        const emptyCells: {row: number, col: number}[] = [];
        grid.forEach((row, rIdx) => row.forEach((cell, cIdx) => {
            if (cell === EMPTY_CELL) emptyCells.push({row: rIdx, col: cIdx});
        }));
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
             if (solution) {
                const newGrid = grid.map(r => [...r]);
                newGrid[randomCell.row][randomCell.col] = solution[randomCell.row][randomCell.col];
                setGrid(newGrid);
                validateGrid(newGrid);
                checkIfSolved(newGrid);
             }
        }
    }
  };
  
  const handleSolve = () => {
    if (solution) {
        setGrid(solution);
        setIsSolved(true);
        setIsActive(false);
    }
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
  };

  if (!grid || !initialGrid) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading Sudoku...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
      <div className="w-full md:max-w-lg lg:max-w-xl">
        <div className="grid grid-cols-9 gap-0 mx-auto w-full aspect-square border-2 border-primary rounded-lg overflow-hidden">
          {grid.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const isSelected = selectedCell?.row === rIdx && selectedCell?.col === cIdx;
              const isInitial = initialGrid[rIdx][cIdx] !== EMPTY_CELL;
              const isError = errors[rIdx]?.[cIdx];
              const isRelated = selectedCell && (
                  selectedCell.row === rIdx ||
                  selectedCell.col === cIdx ||
                  (Math.floor(selectedCell.row / 3) === Math.floor(rIdx / 3) && Math.floor(selectedCell.col / 3) === Math.floor(cIdx / 3))
              )

              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => handleCellClick(rIdx, cIdx)}
                  className={cn(
                    'w-full h-full flex items-center justify-center text-2xl md:text-3xl font-mono focus:outline-none transition-colors duration-200',
                    'border-r border-b border-secondary',
                    cIdx % 3 === 2 && cIdx !== 8 && 'border-r-muted-foreground',
                    rIdx % 3 === 2 && rIdx !== 8 && 'border-b-muted-foreground',
                    isInitial ? 'font-bold' : 'text-primary',
                    isSelected ? 'bg-primary/20' : isRelated ? 'bg-secondary/70' : 'bg-background hover:bg-secondary',
                    isError && !isInitial && 'bg-destructive/20 text-destructive'
                  )}
                >
                  {cell}
                </button>
              );
            })
          )}
        </div>
      </div>
      
      <div className="w-full md:max-w-xs space-y-4">
         <Card>
            <CardHeader className="p-4">
                 <CardTitle className="flex justify-between items-center text-lg">
                    <div className="flex items-center gap-2"><Brain className="size-5" /><span>Sudoku</span></div>
                    <div className="flex items-center gap-2 text-base font-normal text-muted-foreground">
                        <Timer className="size-4" />
                        <span>{formatTime(time)}</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
                 <div className="grid grid-cols-2 gap-2">
                    <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                            <SelectItem value="Random">Random</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={() => createNewGame(difficulty)}><Play className="mr-2"/>New Game</Button>
                </div>
            </CardContent>
         </Card>
        
         <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }, (_, i) => i + 1).map(num => (
            <Button key={num} onClick={() => handleNumberInput(num)} variant="outline" className="text-xl aspect-square h-auto">
              {num}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
            <Button onClick={handleErase} variant="outline"><Eraser className="mr-2"/> Erase</Button>
            <Button onClick={handleHint} variant="outline"><Lightbulb className="mr-2"/> Hint</Button>
            <Button onClick={() => setGrid(initialGrid.map(r => [...r]))} variant="outline"><RotateCcw className="mr-2"/> Reset</Button>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="secondary" className="w-full"><Check className="mr-2" /> Solve Puzzle</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reveal the entire solution and end the current game.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSolve}>Show Solution</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
