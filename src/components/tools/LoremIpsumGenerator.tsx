'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Dices } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const loremIpsumText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const words = loremIpsumText.split(' ');

function generateLoremIpsum(count: number, type: 'words' | 'sentences' | 'paragraphs') {
    let result = '';
    if (type === 'words') {
        result = Array.from({ length: count }, (_, i) => words[i % words.length]).join(' ');
    } else if (type === 'sentences') {
        const sentences = loremIpsumText.split('. ');
        result = Array.from({ length: count }, (_, i) => (sentences[i % sentences.length])).join('. ') + '.';
    } else { // paragraphs
        result = Array.from({ length: count }, () => loremIpsumText).join('\n\n');
    }
    return result;
}


export default function LoremIpsumGenerator() {
  const [generatedText, setGeneratedText] = useState('');
  const [count, setCount] = useState(5);
  const [type, setType] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs');
  const { toast } = useToast();

  const handleGenerate = () => {
    setGeneratedText(generateLoremIpsum(count, type));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    toast({ title: 'Copied to clipboard!' });
  };
  
  React.useEffect(() => {
    handleGenerate();
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="count">Count</Label>
          <Input id="count" type="number" value={count} onChange={e => setCount(Math.max(1, parseInt(e.target.value, 10)))} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={type} onValueChange={v => setType(v as any)}>
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="words">Words</SelectItem>
              <SelectItem value="sentences">Sentences</SelectItem>
              <SelectItem value="paragraphs">Paragraphs</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 col-span-2">
            <Button onClick={handleGenerate} className="w-full">
              <Dices className="mr-2" /> Generate
            </Button>
            <Button onClick={handleCopy} variant="outline" className="w-full" disabled={!generatedText}>
              <Copy className="mr-2" /> Copy
            </Button>
        </div>
      </div>
      <Textarea
        readOnly
        value={generatedText}
        placeholder="Generated Lorem Ipsum will appear here..."
        className="min-h-[300px] text-base"
      />
    </div>
  );
}
