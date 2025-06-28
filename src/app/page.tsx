
'use client';

import Link from 'next/link';
import React, { useState, useMemo, useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent } from '@/components/ui/card';
import { History, Settings, Search, Menu, Gamepad2, Brain, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTimeFormat } from '@/hooks/use-time-format';
import { TOOLS, getSearchableItems, mainApps, mainCategories, mainGames } from '@/lib/constants';
import { useClockStyle, type ClockStyle } from '@/hooks/use-clock-style';
import WeatherCard from '@/components/WeatherCard';
import TodoWidget from '@/components/TodoWidget';

function Clock() {
  const [time, setTime] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { timeFormat } = useTimeFormat();
  const { clockStyle } = useClockStyle();

  useEffect(() => {
    setTime(new Date());
    setIsClient(true);
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const clockClasses = useMemo(() => {
    const base = "text-center tabular-nums transition-all duration-500 text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] leading-tight";
    switch(clockStyle) {
      case 'minimalist':
        return cn(base, 'font-mono font-bold text-primary tracking-tighter');
      case 'digital-glow':
        return cn(base, 'font-orbitron text-cyan-400 dark:text-cyan-300 [text-shadow:0_0_8px_theme(colors.cyan.400),0_0_24px_theme(colors.cyan.600)] dark:[text-shadow:0_0_8px_theme(colors.cyan.300),0_0_24px_theme(colors.cyan.500)]');
      case 'elegant-serif':
        return cn(base, 'font-serif font-bold text-primary');
      case 'bold-modern':
        return cn(base, 'font-anton font-normal text-primary tracking-wider');
      default:
        return cn(base, 'font-mono font-bold text-primary tracking-tighter');
    }
  }, [clockStyle]);

  const dateClasses = useMemo(() => {
    const base = "text-center transition-all duration-500 text-lg sm:text-xl md:text-2xl lg:text-3xl text-primary/80";
    switch(clockStyle) {
      case 'minimalist':
        return cn(base, 'font-mono font-medium tracking-tight');
      case 'digital-glow':
        return cn(base, 'font-orbitron text-cyan-400/80 dark:text-cyan-300/80 [text-shadow:0_0_4px_theme(colors.cyan.400)] dark:[text-shadow:0_0_4px_theme(colors.cyan.300)]');
      case 'elegant-serif':
        return cn(base, 'font-serif font-medium');
      case 'bold-modern':
        return cn(base, 'font-anton font-normal tracking-wide');
      default:
        return cn(base, 'font-mono font-medium tracking-tight');
    }
  }, [clockStyle]);


  if (!isClient || !time) {
    return (
      <div className="flex flex-col items-center">
        <div className={cn(clockClasses, 'opacity-50')}>
          --:--:--
        </div>
        <div className={cn(dateClasses, 'opacity-50')}>
          Loading...
        </div>
      </div>
    );
  }

  const displayTime = time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: timeFormat === '12h',
      });

  const displayDate = time.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
  });

  return (
    <div className="flex flex-col items-center">
      <div className={clockClasses}>
        {displayTime}
      </div>
      <div className={dateClasses}>
        {displayDate}
      </div>
    </div>
  );
}

const categoryGradientClasses: Record<string, string> = {
  ai: 'bg-gradient-to-br from-blue-500 to-purple-600',
  general: 'bg-gradient-to-br from-sky-500 to-indigo-500',
  calculators: 'bg-gradient-to-br from-yellow-500 to-orange-500',
  'unit-converters': 'bg-gradient-to-br from-green-500 to-teal-500',
  health: 'bg-gradient-to-br from-green-400 to-teal-600',
  text: 'bg-gradient-to-br from-blue-500 to-cyan-500',
  image: 'bg-gradient-to-br from-purple-500 to-indigo-600',
  pdf: 'bg-gradient-to-br from-red-500 to-pink-500',
  colors: 'bg-gradient-to-br from-red-500 to-orange-500',
  development: 'bg-gradient-to-br from-gray-500 to-gray-700',
  randomizer: 'bg-gradient-to-br from-pink-500 to-rose-500',
  generator: 'bg-gradient-to-br from-teal-400 to-cyan-600',
};

const appGradientClasses: Record<string, string> = {
  weather: 'bg-gradient-to-br from-blue-400 to-blue-600',
  calendar: 'bg-gradient-to-br from-purple-500 to-indigo-600',
  todo: 'bg-gradient-to-br from-sky-500 to-cyan-500',
  notes: 'bg-gradient-to-br from-yellow-500 to-amber-500',
  quiz: 'bg-gradient-to-br from-yellow-400 to-orange-500',
  music: 'bg-gradient-to-br from-pink-500 to-rose-500',
  video: 'bg-gradient-to-br from-red-500 to-orange-500',
  news: 'bg-gradient-to-br from-blue-500 to-cyan-500',
  camera: 'bg-gradient-to-br from-gray-500 to-gray-700',
};

const gameGradientClasses: Record<string, string> = {
  sudoku: 'bg-gradient-to-br from-green-500 to-teal-500',
  dinosaur: 'bg-gradient-to-br from-gray-700 to-gray-900',
  'tic-tac-toe': 'bg-gradient-to-br from-blue-500 to-cyan-500',
  memory: 'bg-gradient-to-br from-pink-500 to-rose-500',
};


function ToolsDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="lg" className="rounded-full shadow-lg">
          <Menu className="mr-2" />
          Tools
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-full md:h-[80vh] flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-center text-2xl">Tools</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto py-4">
              {mainCategories.map((category) => (
                  <Link href={category.slug} key={category.slug} className="block group">
                    <Card className={cn("h-full transition-all duration-300 group-hover:transform group-hover:-translate-y-2 group-hover:shadow-2xl overflow-hidden border-2 border-transparent hover:border-primary/50", categoryGradientClasses[category.color])}>
                      <CardContent className={cn("p-6 flex flex-col items-center justify-center text-center", category.textColor)}>
                        <div className="mb-4">
                          {category.icon}
                        </div>
                        <h3 className="text-xl font-bold">{category.name}</h3>
                        <p className="mt-2 text-sm opacity-90">{category.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function AppsDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="lg" className="rounded-full shadow-lg">
          <Menu className="mr-2" />
          Apps
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-full md:h-[80vh] flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-center text-2xl">Apps</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto py-4">
              {mainApps.map((app) => (
                  <Link href={app.slug} key={app.slug} className="block group">
                    <Card className={cn("h-full transition-all duration-300 group-hover:transform group-hover:-translate-y-2 group-hover:shadow-2xl overflow-hidden border-2 border-transparent hover:border-primary/50", appGradientClasses[app.color])}>
                      <CardContent className={cn("p-6 flex flex-col items-center justify-center text-center", app.textColor)}>
                        <div className="mb-4 p-4 bg-white/20 rounded-full">
                          {app.icon}
                        </div>
                        <h3 className="text-xl font-bold">{app.name}</h3>
                        <p className="mt-2 text-sm opacity-90">{app.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function GamesDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="lg" className="rounded-full shadow-lg">
          <Gamepad2 className="mr-2" />
          Games
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-full md:h-[80vh] flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-center text-2xl">Games</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto py-4">
              {mainGames.map((game) => (
                  <Link href={game.slug} key={game.slug} className="block group">
                    <Card className={cn("h-full transition-all duration-300 group-hover:transform group-hover:-translate-y-2 group-hover:shadow-2xl overflow-hidden border-2 border-transparent hover:border-primary/50", gameGradientClasses[game.color])}>
                      <CardContent className={cn("p-6 flex flex-col items-center justify-center text-center", game.textColor)}>
                        <div className="mb-4 p-4 bg-white/20 rounded-full">
                          {game.icon}
                        </div>
                        <h3 className="text-xl font-bold">{game.name}</h3>
                        <p className="mt-2 text-sm opacity-90">{game.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}


export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const allSearchableItems = useMemo(() => getSearchableItems(), []);

  const searchedItems = useMemo(() => {
    if (!searchTerm.trim()) {
      return [];
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return allSearchableItems.filter(item => 
      item.name.toLowerCase().includes(lowercasedTerm) ||
      item.category.toLowerCase().includes(lowercasedTerm) ||
      (item.subCategory && item.subCategory.toLowerCase().includes(lowercasedTerm)) ||
      (item.keywords && item.keywords.some(keyword => keyword.toLowerCase().includes(lowercasedTerm))) ||
      (item.description && item.description.toLowerCase().includes(lowercasedTerm))
    );
  }, [searchTerm, allSearchableItems]);


  return (
    <div className="flex flex-col min-h-screen bg-secondary/40 dark:bg-background">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-background/80 p-4 backdrop-blur-sm">
        <div className="flex-1"></div>
        <Link href="/" className="text-xl font-bold text-primary flex-1 text-center">ToolView</Link>
        <div className="flex-1 flex justify-end items-center gap-2">
            <Button variant="outline" size="icon" asChild>
                <Link href="/history">
                    <History className="h-4 w-4" />
                </Link>
            </Button>
            <Button variant="outline" size="icon" asChild>
                <Link href="/settings">
                    <Settings className="h-4 w-4" />
                </Link>
            </Button>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 space-y-8">
        <div className="text-center space-y-4">
            <Clock />
            <WeatherCard />
        </div>

        <div className="relative w-full max-w-lg">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Search for any tool, app, or game..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-14 h-16 text-xl rounded-full shadow-lg"
            />
        </div>

        {searchTerm.trim() ? (
          <div className="w-full max-w-5xl">
            <ScrollArea className="h-[40vh]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
                  {searchedItems.length > 0 ? (
                    searchedItems.map((item) => (
                      <Link href={item.href} key={item.href} className="block group">
                        <div className="p-3 bg-card border rounded-lg h-full flex flex-col items-center justify-center text-center gap-2 transition-all duration-200 hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                            {React.cloneElement(item.icon, { className: "size-6" })}
                          </div>
                          <span className="font-semibold text-xs leading-tight">{item.name}</span>
                          <span className="text-xs text-muted-foreground">{item.category}</span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                      <h3 className="text-lg font-semibold">No Results Found</h3>
                      <p>Try a different search term.</p>
                    </div>
                  )}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <ToolsDrawer />
            <AppsDrawer />
            <GamesDrawer />
          </div>
        )}
      </main>
      <TodoWidget />
    </div>
  );
}
