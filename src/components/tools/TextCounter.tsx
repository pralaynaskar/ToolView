'use client';

import React, { useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, ClipboardPaste, Trash2, Undo, Redo } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useHistory } from '@/hooks/use-history';

export default function TextCounter() {
  const { state: text, set: setText, undo, redo, reset, canUndo, canRedo } = useHistory('');
  const { toast } = useToast();

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

  const stats = useMemo(() => {
    const trimmedText = text.trim();
    const characters = text.length;
    const words = trimmedText ? trimmedText.split(/\s+/).length : 0;
    const lines = text ? text.split(/\n/).length : 0;
    if (trimmedText === '') return { characters: 0, words: 0, lines: text ? lines : 0, sentences: 0 };
    
    const sentences = (trimmedText.match(/[\w|)][.?!](\s|$)/g) || []).length;

    return {
      characters,
      words,
      lines,
      sentences: sentences === 0 && words > 0 ? 1 : sentences,
    };
  }, [text]);

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
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        className="min-h-[200px] text-base"
      />
      <Card>
        <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{stats.characters}</p>
            <p className="text-sm text-muted-foreground">Characters</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">{stats.words}</p>
            <p className="text-sm text-muted-foreground">Words</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">{stats.lines}</p>
            <p className="text-sm text-muted-foreground">Lines</p>
          </div>
           <div>
            <p className="text-2xl font-bold text-primary">{stats.sentences}</p>
            <p className="text-sm text-muted-foreground">Sentences</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
