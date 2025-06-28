'use client';

import React, { useMemo, useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { HistoryEntry } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash2, History as HistoryIcon, Search } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { TOOLS } from '@/lib/constants';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function HistoryDisplay() {
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('calc-history', []);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = useMemo(() => {
    if (!searchTerm.trim()) {
      return history;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return history.filter(entry =>
      entry.type.toLowerCase().includes(lowercasedTerm) ||
      entry.calculation.toLowerCase().includes(lowercasedTerm)
    );
  }, [history, searchTerm]);

  const groupedHistory = useMemo(() => {
    const sortedHistory = [...filteredHistory].sort((a, b) => {
        try {
            return parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime();
        } catch (e) {
            return 0;
        }
    });

    return sortedHistory.reduce((acc, entry) => {
      try {
        const entryDate = parseISO(entry.timestamp);
        let groupTitle: string;

        if (isToday(entryDate)) {
          groupTitle = 'Today';
        } else if (isYesterday(entryDate)) {
          groupTitle = 'Yesterday';
        } else {
          groupTitle = format(entryDate, 'PPP'); // e.g., Jun 27, 2024
        }
        
        if (!acc[groupTitle]) {
          acc[groupTitle] = [];
        }
        acc[groupTitle].push(entry);
        return acc;
      } catch (e) {
        return acc;
      }
    }, {} as Record<string, HistoryEntry[]>);
  }, [filteredHistory]);
  
  const getToolIcon = (type: string) => {
    const tool = TOOLS.find(t => t.name === type);
    return tool ? React.cloneElement(tool.icon, { className: "size-5" }) : <HistoryIcon className="w-5 h-5 text-muted-foreground" />;
  };
  
  const handleClearEntry = (id: string) => {
    setHistory(prev => prev.filter(entry => entry.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${history.length} history entries...`}
            className="w-full pl-9"
          />
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={history.length === 0}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                calculation history.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => setHistory([])}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Card className="shadow-none">
        <CardContent className="p-0">
          <ScrollArea className="h-[60vh] w-full">
            {Object.keys(groupedHistory).length > 0 ? (
              <div className="space-y-4 p-1 md:p-2">
                {Object.entries(groupedHistory).map(([date, entries]) => (
                  <div key={date}>
                    <div className="flex items-center gap-4 px-2 mb-2">
                       <h3 className="text-sm font-semibold text-muted-foreground shrink-0">{date}</h3>
                       <Separator className="flex-grow" />
                    </div>
                    <ul className="space-y-1">
                      {entries.map((entry) => {
                          const tool = TOOLS.find(t => t.name === entry.type);
                          const href = tool ? `/${tool.slug}` : '#';
                          const isClickable = !!tool;

                          return (
                            <li key={entry.id} className="p-2 flex items-center gap-3 hover:bg-secondary/50 rounded-lg group">
                                <Link href={href} className={cn("flex-grow flex items-center gap-3 overflow-hidden", !isClickable && "pointer-events-none")}>
                                    <div className="p-2 bg-background rounded-full border shrink-0">
                                        {getToolIcon(entry.type)}
                                    </div>
                                    <div className="flex-grow overflow-hidden">
                                        <div className="flex justify-between items-baseline">
                                            <p className="font-semibold text-sm truncate">{entry.type}</p>
                                            <p className="text-xs text-muted-foreground shrink-0">{format(parseISO(entry.timestamp), 'p')}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">{entry.calculation}</p>
                                    </div>
                                </Link>
                                <Button variant="ghost" size="icon" className="shrink-0 invisible group-hover:visible" onClick={() => handleClearEntry(entry.id)}>
                                    <Trash2 className="w-4 h-4 text-destructive/70" />
                                </Button>
                            </li>
                          )
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-3 text-muted-foreground">
                <HistoryIcon className="w-12 h-12" />
                <h3 className="text-lg font-semibold">No History Yet</h3>
                <p>{searchTerm ? "No entries match your search." : "Your calculations and conversions will appear here."}</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
