'use client';

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Trash2, ClipboardPaste, Undo, Redo } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHistory } from '@/hooks/use-history';

export default function BeautifyJson() {
  const { state: inputJson, set: setInputJson, undo, redo, reset, canUndo, canRedo } = useHistory('');
  const [spacing, setSpacing] = useState('2');
  const { toast } = useToast();

  const handleBeautify = () => {
    try {
      const parsed = JSON.parse(inputJson);
      const space = spacing === 'tab' ? '\t' : parseInt(spacing, 10);
      const beautified = JSON.stringify(parsed, null, space);
      setInputJson(beautified);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Invalid JSON',
        description: 'The input string could not be parsed as JSON.',
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputJson);
    toast({ title: 'Copied to clipboard!' });
  };
  
  const handlePaste = async () => {
    const pasteText = await navigator.clipboard.readText();
    setInputJson(pasteText);
    toast({ title: 'Pasted from clipboard!' });
  };
  
  const handleClear = () => {
    reset('');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Spacing:</label>
          <Select value={spacing} onValueChange={setSpacing}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 Spaces</SelectItem>
              <SelectItem value="4">4 Spaces</SelectItem>
              <SelectItem value="tab">Tab</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
            <Button onClick={handleBeautify}>Beautify</Button>
            <Button variant="outline" size="icon" onClick={undo} disabled={!canUndo}>
                <Undo className="size-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={redo} disabled={!canRedo}>
                <Redo className="size-4" />
            </Button>
             <Button variant="outline" size="icon" onClick={handlePaste}>
                <ClipboardPaste className="size-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleCopy} disabled={!inputJson}>
                <Copy className="size-4" />
            </Button>
            <Button variant="destructive" size="icon" onClick={handleClear} disabled={!inputJson}>
                <Trash2 className="size-4" />
            </Button>
        </div>
      </div>
      <Textarea
        value={inputJson}
        onChange={(e) => setInputJson(e.target.value)}
        placeholder="Paste your JSON here..."
        className="min-h-[400px] font-mono text-sm"
      />
    </div>
  );
}
