'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dices, Copy } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function MultipleNumbersGenerator() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(10);
  const [result, setResult] = useState<string>('');
  const { toast } = useToast();

  const handleGenerate = () => {
    const minVal = Math.ceil(min);
    const maxVal = Math.floor(max);
    if (minVal > maxVal || count <= 0) {
      setResult('');
      return;
    }
    const numbers = Array.from({ length: count }, () => 
      Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal
    );
    setResult(numbers.join(', '));
  };
  
  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast({ title: 'Copied numbers to clipboard!' });
  };
  
  React.useEffect(() => {
    handleGenerate();
  }, []);

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
                <Label htmlFor="min-val">Min</Label>
                <Input id="min-val" type="number" value={min} onChange={e => setMin(parseInt(e.target.value, 10) || 0)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="max-val">Max</Label>
                <Input id="max-val" type="number" value={max} onChange={e => setMax(parseInt(e.target.value, 10) || 0)} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="count">Count</Label>
                <Input id="count" type="number" value={count} onChange={e => setCount(Math.max(1, parseInt(e.target.value, 10)))} />
            </div>
        </div>
        <div className="flex gap-2">
            <Button onClick={handleGenerate}>
                <Dices className="mr-2 h-5 w-5" />
                Generate Numbers
            </Button>
             <Button onClick={handleCopy} variant="outline" disabled={!result}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
            </Button>
        </div>
      
        <Textarea
            readOnly
            value={result}
            placeholder="Generated numbers will appear here..."
            className="min-h-[200px] bg-muted"
        />
    </div>
  );
}
