'use client';

import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowDownAZ, ArrowUpAZ, Shuffle, ArrowDown10, ArrowUp10, Undo2, Copy, ClipboardPaste, Trash2, Undo, Redo } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useHistory } from '@/hooks/use-history';

export default function SortLines() {
  const { state: text, set: setText, undo, redo, reset, canUndo, canRedo } = useHistory('Banana\nApple\nCherry\nDate');
  const { toast } = useToast();

  const getLines = () => text.split('\n');
  const setLines = (lines: string[]) => setText(lines.join('\n'));

  const handleSort = (direction: 'asc' | 'desc') => {
    const lines = getLines();
    lines.sort((a, b) => direction === 'asc' ? a.localeCompare(b) : b.localeCompare(a));
    setLines(lines);
  };
  
  const handleSortByLength = (direction: 'asc' | 'desc') => {
    const lines = getLines();
    lines.sort((a, b) => direction === 'asc' ? a.length - b.length : b.length - a.length);
    setLines(lines);
  };
  
  const handleReverse = () => {
    const lines = getLines();
    setLines(lines.reverse());
  };

  const handleShuffle = () => {
    const lines = getLines();
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lines[i], lines[j]] = [lines[j], lines[i]];
    }
    setLines(lines);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
  };
  
  const handlePaste = async () => {
    const pasteText = await navigator.clipboard.readText();
    setText(pasteText);
    toast({ title: 'Pasted from clipboard!' });
  };

  const handleClear = () => {
    reset('');
  };

  return (
    <div className="space-y-4">
        <div className="flex justify-end gap-2">
            <Button variant="outline" size="icon" onClick={undo} disabled={!canUndo}>
                <Undo className="size-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={redo} disabled={!canRedo}>
                <Redo className="size-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleCopy} disabled={!text}>
                <Copy className="size-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handlePaste}>
                <ClipboardPaste className="size-4" />
            </Button>
            <Button variant="destructive" size="icon" onClick={handleClear} disabled={!text}>
                <Trash2 className="size-4" />
            </Button>
        </div>
        <div className="flex flex-wrap gap-2">
            <Button onClick={() => handleSort('asc')}><ArrowDownAZ className="mr-2" /> Sort A-Z</Button>
            <Button onClick={() => handleSort('desc')}><ArrowUpAZ className="mr-2" /> Sort Z-A</Button>
            <Button onClick={() => handleSortByLength('asc')}><ArrowDown10 className="mr-2" /> Sort by Length</Button>
            <Button onClick={() => handleSortByLength('desc')}><ArrowUp10 className="mr-2" /> Sort by Length (Reverse)</Button>
            <Button onClick={handleReverse}><Undo2 className="mr-2" /> Reverse Lines</Button>
            <Button onClick={handleShuffle} variant="outline"><Shuffle className="mr-2" /> Shuffle Lines</Button>
        </div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text with multiple lines..."
        className="min-h-[300px]"
      />
    </div>
  );
}
