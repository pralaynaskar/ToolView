'use client';

import React, { useState, useEffect } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { generateQuiz, type QuizInput, type QuizOutput } from '@/ai/flows/quizFlow';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Loader2, Lightbulb, Bot, History, Trash2 } from 'lucide-react';
import { Input } from './ui/input';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


type GameState = 'selecting' | 'loading' | 'playing' | 'finished';
type Question = QuizOutput['questions'][0];
type QuizResult = {
    id: string;
    topic: string;
    score: number;
    totalQuestions: number;
    date: string;
};

const predefinedTopics = [
    'General Knowledge',
    'Science & Nature',
    'History',
    'Geography',
    'Movies',
    'Music',
    'Computer Science',
    'IT'
];

export default function QuizApp() {
    const [gameState, setGameState] = useState<GameState>('selecting');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [customTopic, setCustomTopic] = useState('');
    const [currentTopic, setCurrentTopic] = useState('');
    const { toast } = useToast();
    const [quizHistory, setQuizHistory] = useLocalStorage<QuizResult[]>('quiz-app-history', []);

    useEffect(() => {
        if (gameState === 'finished' && questions.length > 0) {
            const newResult: QuizResult = {
                id: new Date().toISOString(),
                topic: currentTopic,
                score,
                totalQuestions: questions.length,
                date: new Date().toISOString(),
            };
            setQuizHistory(prev => [newResult, ...prev]);
        }
    }, [gameState, questions.length, score, currentTopic, setQuizHistory]);

    const startQuiz = async (topic: string) => {
        setGameState('loading');
        setCurrentTopic(topic);
        try {
            const quizData = await generateQuiz({ topic });
            if (quizData && quizData.questions.length > 0) {
                setQuestions(quizData.questions);
                setCurrentQuestionIndex(0);
                setScore(0);
                setSelectedAnswer(null);
                setIsCorrect(null);
                setGameState('playing');
            } else {
                throw new Error('No questions were generated.');
            }
        } catch (error) {
            console.error("Failed to generate quiz:", error);
            toast({
                variant: 'destructive',
                title: 'Failed to start quiz',
                description: 'Could not generate questions. Please try again.',
            });
            setGameState('selecting');
        }
    };

    const handleAnswer = (answer: string) => {
        if (selectedAnswer) return;

        setSelectedAnswer(answer);
        const correct = answer === questions[currentQuestionIndex].correctAnswer;
        setIsCorrect(correct);
        if (correct) {
            setScore(s => s + 1);
        }
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(i => i + 1);
            setSelectedAnswer(null);
            setIsCorrect(null);
        } else {
            setGameState('finished');
        }
    };

    const restartQuiz = () => {
        setGameState('selecting');
        setQuestions([]);
        setCustomTopic('');
    };

    if (gameState === 'loading' || gameState === 'playing' || gameState === 'finished') {
        return (
             <div className="w-full max-w-2xl mx-auto">
                {gameState === 'loading' && (
                    <div className="text-center p-8 space-y-4">
                        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                        <p className="text-muted-foreground">Generating your quiz...</p>
                    </div>
                )}

                {gameState === 'playing' && questions.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Question {currentQuestionIndex + 1} / {questions.length}</CardTitle>
                            <CardDescription className="text-lg pt-2">{questions[currentQuestionIndex].question}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {questions[currentQuestionIndex].options.map(option => {
                                const isSelected = selectedAnswer === option;
                                const isTheCorrectAnswer = option === questions[currentQuestionIndex].correctAnswer;
                                
                                return (
                                    <Button
                                        key={option}
                                        onClick={() => handleAnswer(option)}
                                        disabled={!!selectedAnswer}
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start h-auto py-3 text-base whitespace-normal text-left",
                                            selectedAnswer && isTheCorrectAnswer && 'bg-green-500/20 border-green-500 text-green-700 dark:text-green-400 hover:bg-green-500/30',
                                            isSelected && !isTheCorrectAnswer && 'bg-red-500/20 border-red-500 text-red-700 dark:text-red-400 hover:bg-red-500/30'
                                        )}
                                    >
                                        {option}
                                    </Button>
                                )
                            })}
                        </CardContent>
                        <CardFooter>
                            {selectedAnswer && <Button onClick={nextQuestion} className="w-full">Next Question</Button>}
                        </CardFooter>
                    </Card>
                )}

                {gameState === 'finished' && (
                    <Card>
                        <CardHeader className="items-center text-center">
                            <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
                            <CardDescription>You scored</CardDescription>
                            <p className="text-6xl font-bold text-primary">{score} / {questions.length}</p>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Button onClick={restartQuiz}>Play Again</Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        );
    }
    
    return (
        <Tabs defaultValue="new-quiz" className="w-full max-w-2xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="new-quiz">New Quiz</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="new-quiz">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Lightbulb /> AI Quiz</CardTitle>
                        <CardDescription>Choose a topic to start the quiz.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {predefinedTopics.map(topic => (
                                <Button key={topic} onClick={() => startQuiz(topic)} variant="outline" size="lg">{topic}</Button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                           <hr className="flex-1"/>
                           <span className="text-sm text-muted-foreground">OR</span>
                           <hr className="flex-1"/>
                        </div>
                        <Button onClick={() => startQuiz('Random')} variant="secondary" className="w-full">Random Topic</Button>
                        <div className="flex gap-2">
                            <Input placeholder="Enter custom topic..." value={customTopic} onChange={e => setCustomTopic(e.target.value)} />
                            <Button onClick={() => startQuiz(customTopic)} disabled={!customTopic.trim()}>Start</Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="history">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2"><History /> Quiz History</CardTitle>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm" disabled={quizHistory.length === 0}><Trash2 className="mr-2"/> Clear</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>This will permanently delete all your quiz history.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => setQuizHistory([])} className={buttonVariants({ variant: 'destructive' })}>Clear History</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-96">
                             {quizHistory.length > 0 ? (
                                <div className="space-y-3 pr-4">
                                    {quizHistory.map(result => (
                                        <div key={result.id} className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                                            <div>
                                                <p className="font-semibold">{result.topic}</p>
                                                <p className="text-sm text-muted-foreground">{format(new Date(result.date), "PPP p")}</p>
                                            </div>
                                            <p className="font-bold text-lg text-primary">{result.score} / {result.totalQuestions}</p>
                                        </div>
                                    ))}
                                </div>
                             ) : (
                                <div className="text-center text-muted-foreground py-16">
                                    <p>No quiz history yet.</p>
                                    <p>Your results will appear here after you complete a quiz.</p>
                                </div>
                             )}
                        </ScrollArea>
                    </CardContent>
                 </Card>
            </TabsContent>
        </Tabs>
    );
}
