

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Menu, Ruler, Calculator, History, Settings, PanelLeftClose, PanelRightClose, Home, ArrowLeft, Clapperboard, Type, Tv2, Palette, Dices, Briefcase, Sparkles, HeartPulse, FileText, Bot, Keyboard, Music, Video, Newspaper, Brain, Gamepad2, Tv, CloudSun, Camera, StickyNote, CheckSquare, Calendar as CalendarIconApp, Hash, Lightbulb
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from '@/components/ui/separator';
import { OnScreenKeyboard } from '@/components/OnScreenKeyboard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { UniversalSearch } from './UniversalSearch';

const navConfig = {
    tools: [
        { href: '/ai-tools', label: 'AI Tools', icon: <Bot className="size-5" /> },
        { href: '/general-tools', label: 'General Tools', icon: <Briefcase className="size-5" /> },
        { href: '/calculators', label: 'Calculators', icon: <Calculator className="size-5" /> },
        { href: '/unit-converters', label: 'Unit Converters', icon: <Ruler className="size-5" /> },
        { href: '/health-tools', label: 'Health Tools', icon: <HeartPulse className="size-5" /> },
        { href: '/text-tools', label: 'Text Tools', icon: <Type className="size-5" /> },
        { href: '/image-tools', label: 'Image Tools', icon: <Clapperboard className="size-5" /> },
        { href: '/pdf-tools', label: 'PDF Tools', icon: <FileText className="size-5" /> },
        { href: '/colors-tools', label: 'Colors Tools', icon: <Palette className="size-5" /> },
        { href: '/development-tools', label: 'Dev Tools', icon: <Tv2 className="size-5" /> },
        { href: '/randomizer-tools', label: 'Randomizers', icon: <Dices className="size-5" /> },
        { href: '/generator-tools', label: 'Generators', icon: <Sparkles className="size-5" /> },
    ],
    apps: [
        { href: '/weather', label: 'Weather', icon: <CloudSun className="size-5" /> },
        { href: '/calendar', label: 'Calendar', icon: <CalendarIconApp className="size-5" /> },
        { href: '/todo', label: 'To-Do List', icon: <CheckSquare className="size-5" /> },
        { href: '/notes', label: 'Notes', icon: <StickyNote className="size-5" /> },
        { href: '/quiz', label: 'Quiz', icon: <Lightbulb className="size-5" /> },
        { href: '/music', label: 'Music Player', icon: <Music className="size-5" /> },
        { href: '/video', label: 'Video Player', icon: <Video className="size-5" /> },
        { href: '/news', label: 'News', icon: <Newspaper className="size-5" /> },
        { href: '/camera', label: 'Camera', icon: <Camera className="size-5" /> },
    ],
    games: [
        { href: '/sudoku', label: 'Sudoku', icon: <Brain className="size-5" /> },
        { href: '/dinosaur-game', label: 'Dinosaur Game', icon: <Gamepad2 className="size-5" /> },
        { href: '/tic-tac-toe', label: 'Tic-Tac-Toe', icon: <Hash className="size-5" /> },
        { href: '/memory-game', label: 'Memory Game', icon: <Brain className="size-5" /> },
    ]
};

function SidebarNav({ isCollapsed, toggleCollapse }: { isCollapsed: boolean, toggleCollapse: () => void }) {
  if (isCollapsed) {
    const mainCategories = [
      { href: '/general-tools', label: 'Tools', icon: <Briefcase className="size-5" /> },
      { href: '/music', label: 'Apps', icon: <Tv className="size-5" /> },
      { href: '/dinosaur-game', label: 'Games', icon: <Gamepad2 className="size-5" /> },
    ];

    return (
        <div className="flex h-full flex-col items-center p-2 gap-2">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={toggleCollapse} variant="ghost" size="icon">
                    <PanelRightClose className="size-5" />
                    <span className="sr-only">Expand Sidebar</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Expand Sidebar</TooltipContent>
              </Tooltip>
              <Separator className="my-1" />
              <nav className="flex flex-col items-center gap-1">
                  {mainCategories.map(item => (
                    <Tooltip key={item.href}>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" asChild>
                                <Link href={item.href}>
                                    {item.icon}
                                    <span className="sr-only">{item.label}</span>
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  ))}
                  <Separator className="my-1" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href="/history">
                          <History className="size-5" />
                          <span className="sr-only">History</span>
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">History</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href="/settings">
                          <Settings className="size-5" />
                          <span className="sr-only">Settings</span>
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Settings</TooltipContent>
                  </Tooltip>
              </nav>
            </TooltipProvider>
        </div>
    );
  }

  return (
    <div className="p-4 h-full">
        <Card className="h-full w-full rounded-lg border flex flex-col">
            <div className={cn("p-4 border-b flex items-center justify-between")}>
                <Link href="/" className="font-bold text-primary text-2xl">ToolView</Link>
                <Button onClick={toggleCollapse} variant="ghost" size="icon">
                <PanelLeftClose className="size-5" />
                <span className="sr-only">Toggle Sidebar</span>
                </Button>
            </div>
            <ScrollArea className="flex-grow">
                <Accordion type="multiple" className="w-full p-2" defaultValue={['tools', 'apps', 'games']}>
                <AccordionItem value="tools" className="border-b-0">
                    <AccordionTrigger className="py-2 hover:no-underline text-base font-semibold rounded-md px-2 hover:bg-accent">
                    <div className="flex items-center gap-2">
                        <Briefcase className="size-5" />
                        <span>Tools</span>
                    </div>
                    </AccordionTrigger>
                    <AccordionContent>
                    <div className="pl-4 flex flex-col space-y-1 pt-1">
                        {navConfig.tools.map(item => (
                        <Button key={item.href} variant="ghost" className="w-full justify-start" asChild>
                            <Link href={item.href}>
                            {React.cloneElement(item.icon, { className: "mr-2 size-5" })}
                            {item.label}
                            </Link>
                        </Button>
                        ))}
                    </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="apps" className="border-b-0">
                    <AccordionTrigger className="py-2 hover:no-underline text-base font-semibold rounded-md px-2 hover:bg-accent">
                    <div className="flex items-center gap-2">
                        <Tv className="size-5" />
                        <span>Apps</span>
                    </div>
                    </AccordionTrigger>
                    <AccordionContent>
                    <div className="pl-4 flex flex-col space-y-1 pt-1">
                        {navConfig.apps.map(item => (
                        <Button key={item.href} variant="ghost" className="w-full justify-start" asChild>
                            <Link href={item.href}>
                            {React.cloneElement(item.icon, { className: "mr-2 size-5" })}
                            {item.label}
                            </Link>
                        </Button>
                        ))}
                    </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="games" className="border-b-0">
                    <AccordionTrigger className="py-2 hover:no-underline text-base font-semibold rounded-md px-2 hover:bg-accent">
                    <div className="flex items-center gap-2">
                        <Gamepad2 className="size-5" />
                        <span>Games</span>
                    </div>
                    </AccordionTrigger>
                    <AccordionContent>
                    <div className="pl-4 flex flex-col space-y-1 pt-1">
                        {navConfig.games.map(item => (
                        <Button key={item.href} variant="ghost" className="w-full justify-start" asChild>
                            <Link href={item.href}>
                            {React.cloneElement(item.icon, { className: "mr-2 size-5" })}
                            {item.label}
                            </Link>
                        </Button>
                        ))}
                    </div>
                    </AccordionContent>
                </AccordionItem>
                </Accordion>
                <div className="px-2">
                <Separator className="my-2" />
                </div>
                <nav className="p-2 space-y-1">
                <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                    <Link href="/history">
                    <History className="size-5" />
                    History
                    </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                    <Link href="/settings">
                    <Settings className="size-5" />
                    Settings
                    </Link>
                </Button>
                </nav>
            </ScrollArea>
        </Card>
    </div>
  );
}


export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const toggleCollapse = () => setIsCollapsed(prev => !prev);
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-background">
      <aside className={cn(
          "hidden md:block fixed top-0 left-0 h-full z-40 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[60px]" : "w-[280px]"
      )}>
        <SidebarNav isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      </aside>
      <div className="flex flex-col h-screen">
        <header className="sticky top-0 z-40 flex items-center justify-center border-b bg-background/80 p-4 backdrop-blur-sm md:hidden relative">
          <div className="absolute left-4 flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" asChild>
                  <Link href="/">
                      <Home className="h-4 w-4" />
                  </Link>
              </Button>
          </div>
          
          <Link href="/" className="text-xl font-bold text-primary">ToolView</Link>

          <div className="absolute right-4 flex items-center gap-2">
            <UniversalSearch />
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <SidebarNav isCollapsed={false} toggleCollapse={() => {}} />
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <header className="hidden md:flex sticky top-0 z-30 items-center justify-between border-b bg-background/80 px-8 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 pl-12">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" asChild>
                  <Link href="/">
                      <Home className="h-4 w-4" />
                  </Link>
              </Button>
          </div>
          <div className="flex items-center gap-2">
            <UniversalSearch />
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
            <Button variant="outline" size="icon" onClick={() => setIsKeyboardVisible(true)}>
                <Keyboard className="h-4 w-4" />
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 md:pl-[calc(60px+2rem)]">
          {children}
        </main>
      </div>
      {isKeyboardVisible && <OnScreenKeyboard onClose={() => setIsKeyboardVisible(false)} />}
    </div>
  );
}
