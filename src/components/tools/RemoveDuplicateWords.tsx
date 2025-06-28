'use client';

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CopyX, Copy, ClipboardPaste, Trash2, Undo, Redo } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useHistory } from '@/hooks/use-history';

export default function RemoveDuplicateWords() {
  const { state: text, set: setText, undo, redo, reset, canUndo, canRedo } = useHistory('the quick brown fox jumps over the lazy dog and the quick brown fox.');
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);
  const { toast } = useToast();

  const handleProcess = () => {
    const words = text.split(/(\s+)/); // Split by space but keep separators
    const seen = new Set();
    const uniqueWords = words.filter(word => {
      const wordToCompare = isCaseSensitive ? word : word.toLowerCase();
      
      // Don't treat whitespace as a word to be removed
      if (word.trim() === '') return true;

      if (seen.has(wordToCompare)) {
        return false;
      } else {
        seen.add(wordToCompare);
        return true;
      }
    });
    setText(uniqueWords.join(''));
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
       <div className="flex items-center justify-between">
            <Button onClick={handleProcess}><CopyX className="mr-2" /> Remove Duplicate Words</Button>
            <div className="flex items-center space-x-2">
                <Switch id="case-sensitive" checked={isCaseSensitive} onCheckedChange={setIsCaseSensitive} />
                <Label htmlFor="case-sensitive">Case Sensitive</Label>
            </div>
       </div>
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
        placeholder="Paste your text with duplicate words here..."
        className="min-h-[300px]"
      />
    </div>
  );
}
