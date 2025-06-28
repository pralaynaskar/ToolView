'use client';
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Copy, ClipboardPaste, Trash2, Undo, Redo } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useHistory } from '@/hooks/use-history';

export default function SuffixPrefix() {
  const { state: text, set: setText, undo, redo, reset, canUndo, canRedo } = useHistory('Apple\nBanana\n\nCherry');
  const [prefix, setPrefix] = useState('-> ');
  const [suffix, setSuffix] = useState(' <-');
  const [onlyNonEmpty, setOnlyNonEmpty] = useState(true);
  const { toast } = useToast();

  const handleApply = () => {
    const lines = text.split('\n');
    const newLines = lines.map(line => {
      if (onlyNonEmpty && line.trim() === '') {
        return line;
      }
      return `${prefix}${line}${suffix}`;
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
          <Label htmlFor="prefix">Prefix</Label>
          <Input id="prefix" value={prefix} onChange={(e) => setPrefix(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="suffix">Suffix</Label>
          <Input id="suffix" value={suffix} onChange={(e) => setSuffix(e.target.value)} />
        </div>
      </div>
       <div className="flex items-center space-x-2">
        <Switch id="only-non-empty" checked={onlyNonEmpty} onCheckedChange={setOnlyNonEmpty} />
        <Label htmlFor="only-non-empty">Apply to non-empty lines only</Label>
      </div>
      <Button onClick={handleApply}>Apply</Button>
    </div>
  );
}
