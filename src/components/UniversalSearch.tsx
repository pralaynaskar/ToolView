
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { History, Search } from 'lucide-react';
import { getSearchableItems, TOOLS } from '@/lib/constants';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { HistoryEntry } from '@/types';
import { Separator } from './ui/separator';

export function UniversalSearch() {
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [history] = useLocalStorage<HistoryEntry[]>('calc-history', []);

    const allSearchableItems = React.useMemo(() => getSearchableItems(), []);

    const searchedItems = React.useMemo(() => {
        if (!searchTerm.trim()) {
          return { tools: [], history: [] };
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        
        const tools = allSearchableItems.filter(item => 
          item.name.toLowerCase().includes(lowercasedTerm) ||
          item.category.toLowerCase().includes(lowercasedTerm) ||
          (item.subCategory && item.subCategory.toLowerCase().includes(lowercasedTerm)) ||
          (item.keywords && item.keywords.some(keyword => keyword.toLowerCase().includes(lowercasedTerm))) ||
          (item.description && item.description.toLowerCase().includes(lowercasedTerm))
        );

        const historyResults = history.filter(entry => 
            entry.type.toLowerCase().includes(lowercasedTerm) ||
            entry.calculation.toLowerCase().includes(lowercasedTerm)
        ).map(entry => {
            const tool = TOOLS.find(t => t.name === entry.type);
            return {
                id: entry.id,
                name: entry.type,
                href: tool ? `/${tool.slug}` : '#',
                icon: tool?.icon ? React.cloneElement(tool.icon, { className: "size-6" }) : <History className="size-6" />,
                category: 'History',
                description: entry.calculation,
            }
        });

        return { tools, history: historyResults.slice(0, 5) }; // Limit history results
      }, [searchTerm, allSearchableItems, history]);
      
    React.useEffect(() => {
        if (!open) {
            setTimeout(() => setSearchTerm(''), 200);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Search">
                    <Search className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="p-0 gap-0 max-w-2xl">
                <DialogHeader className="p-3 border-b">
                  <DialogTitle className="sr-only">Universal Search</DialogTitle>
                  <div className="flex items-center">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search for any tool, app, or game..."
                        className="flex h-10 w-full rounded-md bg-transparent text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                    />
                  </div>
                </DialogHeader>
                <ScrollArea className="h-[50vh]">
                    <div className="p-2 space-y-4">
                        {searchedItems.history.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="px-2 text-xs font-semibold text-muted-foreground">History</h4>
                                {searchedItems.history.map((item) => (
                                    <Link href={item.href} key={`hist-${item.id}`} className="block group" onClick={() => setOpen(false)}>
                                        <div className="p-2 rounded-lg flex items-center gap-3 transition-colors hover:bg-secondary">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm leading-tight">{item.name}</div>
                                                <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {searchedItems.tools.length > 0 && searchedItems.history.length > 0 && <Separator />}

                        {searchedItems.tools.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="px-2 text-xs font-semibold text-muted-foreground">Tools & Apps</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                    {searchedItems.tools.map((item) => (
                                        <Link href={item.href} key={item.href} className="block group" onClick={() => setOpen(false)}>
                                            <div className="p-3 bg-card border rounded-lg h-full flex flex-col items-center justify-center text-center gap-2 transition-all duration-200 hover:bg-secondary hover:-translate-y-0.5">
                                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                                                    {React.cloneElement(item.icon, { className: "size-6" })}
                                                </div>
                                                <span className="font-semibold text-xs leading-tight">{item.name}</span>
                                                <span className="text-xs text-muted-foreground">{item.category}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {searchedItems.tools.length === 0 && searchedItems.history.length === 0 && searchTerm.trim() && (
                             <div className="py-12 text-center text-sm text-muted-foreground">
                                No results found for "{searchTerm}".
                            </div>
                        )}

                         {!searchTerm.trim() && (
                            <div className="py-12 text-center text-sm text-muted-foreground">
                                Start typing to search...
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
