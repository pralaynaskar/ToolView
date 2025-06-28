'use client';
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, ClipboardPaste, ListOrdered, Trash2, Undo, Redo } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useHistory } from '@/hooks/use-history';

export default function AddNumbersToLines() {
  const { state: text, set: setText, undo, redo, reset, canUndo, canRedo } = useHistory('Apple\nBanana\nCherry');
  const [start, setStart] = useState(1);
  const [separator, setSeparator] = useState('. ');
  const { toast } = useToast();

  const handleApply = () => {
    let currentNum = start;
    const lines = text.split('\n');
    const newLines = lines.map(line => {
      if (line.trim() === '') return line;
      return `${currentNum++}${separator}${line}`;
    });
    setText(newLines.join('\n'));
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
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here..."
        className="min-h-[200px]"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start">Start Number</Label>
          <Input id="start" type="number" value={start} onChange={(e) => setStart(parseInt(e.target.value, 10) || 1)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="separator">Separator</Label>
          <Input id="separator" value={separator} onChange={(e) => setSeparator(e.target.value)} />
        </div>
      </div>
      <Button onClick={handleApply}><ListOrdered className="mr-2" /> Add Numbers</Button>
    </div>
  );
}
