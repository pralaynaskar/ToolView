'use client';
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MinusSquare, Copy, ClipboardPaste, Trash2, Undo, Redo } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useHistory } from '@/hooks/use-history';

export default function RemoveEmptyLines() {
  const { state: text, set: setText, undo, redo, reset, canUndo, canRedo } = useHistory('Line 1\n\nLine 2\n   \nLine 3');
  const { toast } = useToast();

  const handleProcess = () => {
    const processedText = text
      .split('\n')
      .filter(line => line.trim() !== '')
      .join('\n');
    setText(processedText);
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
      <div className="flex justify-between items-center">
        <Button onClick={handleProcess}><MinusSquare className="mr-2" /> Remove Empty Lines</Button>
        <div className="flex gap-2">
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
      </div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here..."
        className="min-h-[300px]"
      />
    </div>
  );
}
