'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Apple, Banana, Cherry, Grape, Heart, Star, Sun, Moon } from 'lucide-react';

const icons = [
    { icon: <Apple/>, id: 'apple' }, { icon: <Banana/>, id: 'banana' },
    { icon: <Cherry/>, id: 'cherry' }, { icon: <Grape/>, id: 'grape' },
    { icon: <Heart/>, id: 'heart' }, { icon: <Star/>, id: 'star' },
    { icon: <Sun/>, id: 'sun' }, { icon: <Moon/>, id: 'moon' }
];

const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const generateCards = () => {
    const duplicatedIcons = [...icons, ...icons];
    return shuffleArray(duplicatedIcons).map((item, index) => ({
        ...item,
        key: index,
        isFlipped: false,
        isMatched: false,
    }));
};

type CardType = {
    icon: React.ReactNode;
    id: string;
    key: number;
    isFlipped: boolean;
    isMatched: boolean;
}

export default function MemoryGamePage() {
    const [cards, setCards] = useState<CardType[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const { toast } = useToast();

    useEffect(() => {
        setCards(generateCards());
    }, []);

    const resetGame = () => {
        setCards(generateCards());
        setFlippedCards([]);
        setMoves(0);
    };

    const handleCardClick = (index: number) => {
        if (flippedCards.length === 2 || cards[index].isFlipped || cards[index].isMatched) {
            return;
        }

        const newCards = [...cards];
        newCards[index].isFlipped = true;
        setCards(newCards);
        setFlippedCards([...flippedCards, index]);
    };

    useEffect(() => {
        if (flippedCards.length === 2) {
            setMoves(m => m + 1);
            const [firstIndex, secondIndex] = flippedCards;
            const firstCard = cards[firstIndex];
            const secondCard = cards[secondIndex];

            if (firstCard.id === secondCard.id) {
                // Match
                const newCards = [...cards];
                newCards[firstIndex].isMatched = true;
                newCards[secondIndex].isMatched = true;
                setCards(newCards);
                setFlippedCards([]);

                if (newCards.every(card => card.isMatched)) {
                    toast({ title: "You Win!", description: `You completed the game in ${moves + 1} moves.` });
                }
            } else {
                // No match
                setTimeout(() => {
                    const newCards = [...cards];
                    newCards[firstIndex].isFlipped = false;
                    newCards[secondIndex].isFlipped = false;
                    setCards(newCards);
                    setFlippedCards([]);
                }, 1000);
            }
        }
    }, [flippedCards, cards, toast]);

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Brain className="size-6" /> Memory Game
                </CardTitle>
                 <p className="text-lg font-semibold text-muted-foreground">Moves: {moves}</p>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                <div className="grid grid-cols-4 gap-4">
                    {cards.map((card, index) => (
                        <div key={card.key} className="[perspective:1000px]" onClick={() => handleCardClick(index)}>
                            <div className={cn(
                                "relative w-20 h-20 md:w-24 md:h-24 [transform-style:preserve-3d] transition-transform duration-500 cursor-pointer",
                                (card.isFlipped || card.isMatched) && '[transform:rotateY(180deg)]'
                            )}>
                                <div className="absolute w-full h-full [backface-visibility:hidden] flex items-center justify-center bg-secondary rounded-lg border">
                                    {/* Card Back */}
                                </div>
                                <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center bg-primary/20 text-primary rounded-lg border border-primary">
                                    {/* Card Front */}
                                    {React.cloneElement(card.icon as React.ReactElement, { className: "size-10" })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                 <Button onClick={resetGame}>
                    <RotateCcw className="mr-2" /> Reset Game
                </Button>
            </CardContent>
        </Card>
    );
}
