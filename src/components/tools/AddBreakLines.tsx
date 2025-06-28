'use client';
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Combine, Copy, ClipboardPaste, Trash2, Undo, Redo } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useHistory } from '@/hooks/use-history';

export default function AddBreakLines() {
  const { state: text, set: setText, undo, redo, reset, canUndo, canRedo } = useHistory('first.second.third');
  const [separator, setSeparator] = useState('.');
  const { toast } = useToast();

  const handleApply = () => {
    if (!separator) return;
    const processedText = text.split(separator).join('\n');
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
        className="min-h-[300px]"
      />
       <div className="flex gap-4 items-end">
        <div className="space-y-2 flex-grow">
          <Label htmlFor="separator">Add line break at each</Label>
          <Input id="separator" value={separator} onChange={(e) => setSeparator(e.target.value)} placeholder="Enter separator character(s)"/>
        </div>
        <Button onClick={handleApply}><Combine className="mr-2" /> Add Break Lines</Button>
      </div>
    </div>
  );
}
