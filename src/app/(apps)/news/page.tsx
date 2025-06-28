'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import type { NewsArticle } from '@/ai/flows/newsFlow';
import { getNewsArticles } from '@/ai/flows/newsFlow';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

function ArticleSkeleton() {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-0">
                <Skeleton className="h-48 w-full" />
            </CardHeader>
            <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
            </CardContent>
        </Card>
    );
}


export default function NewsPage() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNews = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const newsArticles = await getNewsArticles();
            setArticles(newsArticles);
        } catch (e) {
            console.error(e);
            setError("Failed to fetch news articles. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold">Top Stories</h1>
                    <p className="text-muted-foreground">Your AI-generated daily news briefing.</p>
                </div>
                 <Button onClick={fetchNews} disabled={isLoading}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>
            
            {error && <Card><CardContent className="p-4 text-destructive">{error}</CardContent></Card>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => <ArticleSkeleton key={i} />)
                ) : (
                    articles.map((article, index) => (
                        <Card key={index} className="flex flex-col overflow-hidden transition-transform hover:scale-105 duration-300">
                            <CardHeader className="p-0">
                                <div className="relative aspect-video">
                                    <Image
                                        src={article.imageUrl}
                                        alt={article.headline}
                                        fill
                                        className="object-cover"
                                        data-ai-hint={article.imagePrompt}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 flex flex-col flex-grow">
                                <Badge variant="outline" className="mb-2 w-fit">{article.category}</Badge>
                                <h2 className="text-lg font-semibold leading-tight flex-grow">{article.headline}</h2>
                                <p className="text-sm text-muted-foreground mt-2">{article.summary}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
