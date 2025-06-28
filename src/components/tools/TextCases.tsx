'use client';

import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, ClipboardPaste, Trash2, Undo, Redo } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useHistory } from '@/hooks/use-history';

export default function TextCases() {
  const { state: text, set: setText, undo, redo, reset, canUndo, canRedo } = useHistory('Hello World. This is a test sentence.');
  const { toast } = useToast();

  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
  };

  const toSentenceCase = (str: string) => {
    return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
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
        <Button onClick={() => setText(text.toUpperCase())}>UPPER CASE</Button>
        <Button onClick={() => setText(text.toLowerCase())}>lower case</Button>
        <Button onClick={() => setText(toTitleCase(text))}>Title Case</Button>
        <Button onClick={() => setText(toSentenceCase(text))}>Sentence case</Button>
      </div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        className="min-h-[300px]"
      />
    </div>
  );
}
