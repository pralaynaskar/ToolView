'use client';
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Eraser, Copy, ClipboardPaste, Trash2, Undo, Redo } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useHistory } from '@/hooks/use-history';

export default function RemoveWhiteSpaces() {
  const { state: text, set: setText, undo, redo, reset, canUndo, canRedo } = useHistory('  Hello   world!  \n\n  This is   a test.  ');
  const { toast } = useToast();

  const handleProcess = () => {
    // Replaces multiple spaces with a single space, and trims each line
    const processedText = text
      .split('\n')
      .map(line => line.replace(/\s+/g, ' ').trim())
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
        <Button onClick={handleProcess}><Eraser className="mr-2" /> Remove Extra Spaces</Button>
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
