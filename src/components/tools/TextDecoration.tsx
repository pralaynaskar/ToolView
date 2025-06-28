'use client';
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, ClipboardPaste, Trash2, Undo, Redo } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useHistory } from '@/hooks/use-history';

type Decoration = 'underline' | 'strikethrough' | 'overline';

const decorate = (text: string, decoration: Decoration) => {
    const combiningChar = {
        underline: '\u0332',
        strikethrough: '\u0336',
        overline: '\u0305',
    }[decoration];
    return text.split('').join(combiningChar) + combiningChar;
};

export default function TextDecoration() {
  const { state: text, set: setText, undo, redo, reset, canUndo, canRedo } = useHistory('Decorated Text');
  const [decoration, setDecoration] = useState<Decoration>('underline');
  const [convertedText, setConvertedText] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setConvertedText(decorate(text, decoration));
  }, [text, decoration]);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(convertedText);
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
        <div className="flex justify-between items-center gap-2">
            <Select value={decoration} onValueChange={(v) => setDecoration(v as any)}>
                <SelectTrigger className="w-[180px]">
                <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="underline">Underline</SelectItem>
                    <SelectItem value="strikethrough">Strikethrough</SelectItem>
                    <SelectItem value="overline">Overline</SelectItem>
                </SelectContent>
            </Select>
            <div className="flex gap-2">
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
                <Button variant="outline" size="icon" onClick={handleCopy} disabled={!convertedText}>
                    <Copy className="size-4" />
                </Button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text..."
                className="min-h-[200px]"
            />
            <Textarea
                readOnly
                value={convertedText}
                placeholder="Converted text..."
                className="min-h-[200px] bg-muted"
            />
        </div>
    </div>
  );
}
