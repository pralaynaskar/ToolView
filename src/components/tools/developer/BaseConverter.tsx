'use client';
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { convertBase } from '@/lib/converters';
import { Label } from '@/components/ui/label';

const bases = Array.from({ length: 35 }, (_, i) => i + 2); // 2 to 36

export default function BaseConverter() {
  const [inputValue, setInputValue] = useState<string>("1010");
  const [outputValue, setOutputValue] = useState<string>("");
  const [fromBase, setFromBase] = useState<number>(2);
  const [toBase, setToBase] = useState<number>(10);

  useEffect(() => {
    const result = convertBase(inputValue, fromBase, toBase);
    setOutputValue(result);
  }, [inputValue, fromBase, toBase]);
  
  const handleSwap = () => {
    const currentInput = inputValue;
    const currentFrom = fromBase;
    setFromBase(toBase);
    setToBase(currentFrom);
    setInputValue(outputValue);
    setOutputValue(currentInput);
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-end gap-4">
        <div className="space-y-2">
          <Label>From</Label>
          <div className="flex gap-2">
            <Select value={String(fromBase)} onValueChange={(v) => setFromBase(Number(v))}>
              <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {bases.map(b => <SelectItem key={`from-${b}`} value={String(b)}>Base {b}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input 
              type="text" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value.toUpperCase())}
              className="text-lg font-mono"
            />
          </div>
        </div>
        
        <Button variant="ghost" size="icon" onClick={handleSwap} className="hidden md:flex">
          <ArrowRightLeft className="w-5 h-5" />
        </Button>
        <Button variant="outline" onClick={handleSwap} className="flex md:hidden items-center gap-2">
          <ArrowRightLeft className="w-4 h-4" />
          <span>Swap</span>
        </Button>

        <div className="space-y-2">
           <Label>To</Label>
           <div className="flex gap-2">
            <Select value={String(toBase)} onValueChange={(v) => setToBase(Number(v))}>
              <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {bases.map(b => <SelectItem key={`to-${b}`} value={String(b)}>Base {b}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input 
              type="text" 
              readOnly 
              value={outputValue} 
              className="text-lg font-semibold font-mono bg-muted" 
            />
           </div>
        </div>
      </div>
    </div>
  );
}
