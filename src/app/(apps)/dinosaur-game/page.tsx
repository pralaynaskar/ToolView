
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Gamepad2, Camera, Expand, Shrink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';

// Game Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 250;
const GROUND_Y = CANVAS_HEIGHT - 30;
const DINO_WIDTH = 40;
const DINO_HEIGHT = 60;
const DINO_X = 50;
const GRAVITY = 0.6;
const JUMP_STRENGTH = -15;
const INITIAL_GAME_SPEED = 5;
const GAME_SPEED_INCREMENT = 0.001;

class Dino {
    x: number;
    y: number;
    width: number;
    height: number;
    dy: number; // velocity y
    isJumping: boolean;

    constructor() {
        this.x = DINO_X;
        this.y = GROUND_Y - DINO_HEIGHT;
        this.width = DINO_WIDTH;
        this.height = DINO_HEIGHT;
        this.dy = 0;
        this.isJumping = false;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'hsl(var(--primary))';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // Eye
        ctx.fillStyle = 'hsl(var(--background))';
        ctx.fillRect(this.x + 28, this.y + 10, 5, 5);
    }

    update() {
        if (this.y + this.height < GROUND_Y || this.isJumping) {
            this.dy += GRAVITY;
            this.y += this.dy;
        }

        if (this.y + this.height > GROUND_Y) {
            this.y = GROUND_Y - this.height;
            this.dy = 0;
            this.isJumping = false;
        }
    }

    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.dy = JUMP_STRENGTH;
        }
    }
}

class Obstacle {
    x: number;
    y: number;
    width: number;
    height: number;
    
    constructor(x: number) {
        this.x = x;
        this.width = 20 + Math.random() * 30;
        this.height = 30 + Math.random() * 40;
        this.y = GROUND_Y - this.height;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'hsl(var(--destructive))';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(speed: number) {
        this.x -= speed;
    }
}

export default function DinosaurGamePage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const [highScore, setHighScore] = useLocalStorage<number>('dino-highscore', 0);
    
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameOver'>('idle');
    const [score, setScore] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Using refs for mutable game objects that don't need to trigger re-renders
    const dinoRef = useRef(new Dino());
    const obstaclesRef = useRef<Obstacle[]>([]);
    const gameSpeedRef = useRef(INITIAL_GAME_SPEED);
    const obstacleTimerRef = useRef(0);
    const animationFrameId = useRef<number>();

    const resetGame = useCallback(() => {
        dinoRef.current = new Dino();
        obstaclesRef.current = [];
        gameSpeedRef.current = INITIAL_GAME_SPEED;
        obstacleTimerRef.current = 0;
        setScore(0);
    }, []);

    const gameLoop = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw ground
        ctx.fillStyle = 'hsl(var(--muted-foreground))';
        ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 2);

        // Dino
        const dino = dinoRef.current;
        dino.update();
        dino.draw(ctx);

        // Obstacles
        obstacleTimerRef.current++;
        if (obstacleTimerRef.current > 100 - gameSpeedRef.current * 5 && Math.random() < 0.05) {
            obstaclesRef.current.push(new Obstacle(CANVAS_WIDTH));
            obstacleTimerRef.current = 0;
        }

        obstaclesRef.current.forEach((obstacle, index) => {
            obstacle.update(gameSpeedRef.current);
            obstacle.draw(ctx);

            // Collision detection
            if (
                dino.x < obstacle.x + obstacle.width &&
                dino.x + dino.width > obstacle.x &&
                dino.y < obstacle.y + obstacle.height &&
                dino.y + dino.height > obstacle.y
            ) {
                setGameState('gameOver');
                if(score > highScore) {
                    setHighScore(score);
                }
            }

            if (obstacle.x + obstacle.width < 0) {
                obstaclesRef.current.splice(index, 1);
            }
        });

        // Score
        setScore(s => s + 1);
        gameSpeedRef.current += GAME_SPEED_INCREMENT;

        animationFrameId.current = requestAnimationFrame(gameLoop);
    }, [score, highScore, setHighScore]);

    const startGame = useCallback(() => {
        resetGame();
        setGameState('playing');
    }, [resetGame]);

    useEffect(() => {
        if (gameState === 'playing') {
            animationFrameId.current = requestAnimationFrame(gameLoop);
        } else {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        }
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [gameState, gameLoop]);
    
    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault();
            if (gameState === 'playing') {
                dinoRef.current.jump();
            } else if(gameState !== 'playing') {
                startGame();
            }
        }
    }, [gameState, startGame]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    const handleScreenshot = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const link = document.createElement('a');
            link.download = `dino-game-screenshot-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast({ title: 'Screenshot Saved!' });
        }
    };

    const handleFullScreen = () => {
        const elem = gameContainerRef.current;
        if (elem) {
            if (!document.fullscreenElement) {
                elem.requestFullscreen().catch(err => {
                    toast({ variant: 'destructive', title: `Error entering full-screen mode: ${err.message}`});
                });
            } else {
                document.exitFullscreen();
            }
        }
    };

    useEffect(() => {
        const onFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', onFullScreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullScreenChange);
    }, []);

    return (
        <Card className="w-full max-w-4xl mx-auto shadow-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Gamepad2 className="size-6" /> Dinosaur Game
                </CardTitle>
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">High Score: {highScore.toLocaleString()}</p>
                    <p className="text-lg font-bold">Score: {score.toLocaleString()}</p>
                </div>
            </CardHeader>
            <CardContent
                ref={gameContainerRef}
                className="relative bg-secondary/50 p-0"
                style={{ width: '100%', aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}` }}
            >
                <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className="w-full h-full cursor-pointer"
                    onClick={() => {
                        if (gameState === 'playing') dinoRef.current.jump();
                        else startGame();
                    }}
                />
                {gameState !== 'playing' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4">
                        {gameState === 'idle' && (
                            <>
                                <h2 className="text-4xl font-bold">Dinosaur Game</h2>
                                <p className="mt-2">Press Space or Tap to Start</p>
                            </>
                        )}
                        {gameState === 'gameOver' && (
                             <>
                                <h2 className="text-4xl font-bold">Game Over</h2>
                                <p className="mt-2 text-xl">Your Score: {score.toLocaleString()}</p>
                                <Button onClick={startGame} className="mt-4">Play Again</Button>
                            </>
                        )}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2 p-4 bg-background/50">
                <Button onClick={handleScreenshot} variant="outline">
                    <Camera className="size-4 mr-2" /> Take Screenshot
                </Button>
                <Button onClick={handleFullScreen} variant="outline">
                    {isFullScreen ? <Shrink className="size-4 mr-2" /> : <Expand className="size-4 mr-2" />}
                    {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                </Button>
            </CardFooter>
        </Card>
    );
}
