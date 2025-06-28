'use client';

import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Trash2, ClipboardPaste, Undo, Redo } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHistory } from '@/hooks/use-history';
import { html_beautify } from 'js-beautify';

export default function BeautifyHtml() {
  const { state: inputHtml, set: setInputHtml, undo, redo, reset, canUndo, canRedo } = useHistory('');
  const [indentSize, setIndentSize] = useState('2');
  const { toast } = useToast();

  const handleBeautify = () => {
    try {
      const beautified = html_beautify(inputHtml, {
        indent_size: parseInt(indentSize, 10),
        indent_char: ' ',
      });
      setInputHtml(beautified);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Invalid HTML',
        description: 'The input string could not be beautified.',
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputHtml);
    toast({ title: 'Copied to clipboard!' });
  };
  
  const handlePaste = async () => {
    const pasteText = await navigator.clipboard.readText();
    setInputHtml(pasteText);
    toast({ title: 'Pasted from clipboard!' });
  };
  
  const handleClear = () => {
    reset('');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Indent Size:</label>
          <Select value={indentSize} onValueChange={setIndentSize}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 Spaces</SelectItem>
              <SelectItem value="4">4 Spaces</SelectItem>
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
            <Button variant="outline" size="icon" onClick={handleCopy} disabled={!inputHtml}>
                <Copy className="size-4" />
            </Button>
            <Button variant="destructive" size="icon" onClick={handleClear} disabled={!inputHtml}>
                <Trash2 className="size-4" />
            </Button>
        </div>
      </div>
      <Textarea
        value={inputHtml}
        onChange={(e) => setInputHtml(e.target.value)}
        placeholder="Paste your HTML here..."
        className="min-h-[400px] font-mono text-sm"
      />
    </div>
  );
}
