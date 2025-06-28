'use client';

import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Copy, ClipboardPaste, Trash2, Undo, Redo } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHistory } from '@/hooks/use-history';

export default function RepeatText() {
  const { state: text, set: setText, undo, redo, reset, canUndo, canRedo } = useHistory('Hello! ');
  const [count, setCount] = useState(5);
  const [separator, setSeparator] = useState(' ');
  const [result, setResult] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (!text || count <= 0) {
      setResult('');
      return;
    }
    const joiner = separator === 'none' ? '' : separator;
    const repeated = Array(Number(count)).fill(text).join(joiner);
    setResult(repeated);
  }, [text, count, separator]);
  
  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
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
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-4 items-end">
        <div className="space-y-2">
            <Label htmlFor="text-to-repeat">Text</Label>
            <div className="flex gap-2">
                <Input id="text-to-repeat" value={text} onChange={(e) => setText(e.target.value)} />
                <Button variant="outline" size="icon" onClick={undo} disabled={!canUndo}>
                    <Undo className="size-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={redo} disabled={!canRedo}>
                    <Redo className="size-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handlePaste}>
                    <ClipboardPaste className="size-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={handleClear} disabled={!text}>
                    <Trash2 className="size-4" />
                </Button>
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="repeat-count">Count</Label>
            <Input id="repeat-count" type="number" value={count} onChange={(e) => setCount(Math.max(0, parseInt(e.target.value, 10)))} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="separator">Separator</Label>
            <Select value={separator} onValueChange={setSeparator}>
                <SelectTrigger id="separator" className="w-[150px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value=" ">Empty Space</SelectItem>
                    <SelectItem value="\n">New Line</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>
      <Textarea
        readOnly
        value={result}
        placeholder="Result will appear here..."
        className="min-h-[200px]"
      />
      <Button onClick={handleCopy} disabled={!result}><Copy className="mr-2" /> Copy to Clipboard</Button>
    </div>
  );
}
