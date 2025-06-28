'use client';

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, ClipboardPaste, Trash2, Undo, Redo } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useHistory } from '@/hooks/use-history';

export default function FindReplace() {
  const { state: text, set: setText, undo, redo, reset, canUndo, canRedo } = useHistory('Hello world, hello universe.');
  const [find, setFind] = useState('hello');
  const [replace, setReplace] = useState('hi');
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);
  const { toast } = useToast();

  const handleReplace = () => {
    if (!find) return;
    const regex = new RegExp(find, isCaseSensitive ? 'g' : 'gi');
    setText(text.replace(regex, replace));
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
          <Label htmlFor="find-text">Find</Label>
          <Input id="find-text" value={find} onChange={(e) => setFind(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="replace-text">Replace</Label>
          <Input id="replace-text" value={replace} onChange={(e) => setReplace(e.target.value)} />
        </div>
      </div>
       <div className="flex items-center space-x-2">
        <input type="checkbox" id="case-sensitive" checked={isCaseSensitive} onChange={e => setIsCaseSensitive(e.target.checked)} />
        <Label htmlFor="case-sensitive">Case Sensitive</Label>
      </div>
      <Button onClick={handleReplace}>Replace All</Button>
    </div>
  );
}
