'use client';

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Trash2, ClipboardPaste, Undo, Redo } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHistory } from '@/hooks/use-history';

function formatXml(xml: string, indentSize: number) {
    let formatted = '';
    let indent = '';
    const tab = ' '.repeat(indentSize);
    
    // Remove newlines and collapse whitespace between tags
    const singleLineXml = xml.replace(/>\s*</g, '><').trim();

    singleLineXml.split(/>\s*</).forEach(function(node) {
        if (node.match( /^\/\w/ )) indent = indent.substring(tab.length); // End tag decreases indent
        const padding = indent + '<' + node + '>\r\n';
        formatted += padding;
        if (node.match( /^<?\w[^>]*[^\/]$/ )) indent += tab; // Start tag increases indent
    });
    return formatted.substring(1, formatted.length - 3);
}

export default function BeautifyXml() {
  const { state: inputXml, set: setInputXml, undo, redo, reset, canUndo, canRedo } = useHistory('');
  const [indentSize, setIndentSize] = useState('2');
  const { toast } = useToast();

  const handleBeautify = () => {
    if (!inputXml.trim()) return;
    try {
      const beautified = formatXml(inputXml, parseInt(indentSize, 10));
      setInputXml(beautified);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Invalid XML',
        description: 'The input string could not be beautified. Please ensure it is well-formed.',
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputXml);
    toast({ title: 'Copied to clipboard!' });
  };
  
  const handlePaste = async () => {
    const pasteText = await navigator.clipboard.readText();
    setInputXml(pasteText);
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
            <Button variant="outline" size="icon" onClick={handleCopy} disabled={!inputXml}>
                <Copy className="size-4" />
            </Button>
            <Button variant="destructive" size="icon" onClick={handleClear} disabled={!inputXml}>
                <Trash2 className="size-4" />
            </Button>
        </div>
      </div>
      <Textarea
        value={inputXml}
        onChange={(e) => setInputXml(e.target.value)}
        placeholder="Paste your XML here..."
        className="min-h-[400px] font-mono text-sm"
      />
    </div>
  );
}
