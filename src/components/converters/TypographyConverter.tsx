
"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { convertTypography } from '@/lib/converters';
import { ArrowRightLeft } from 'lucide-react';
import { Button } from '../ui/button';

type TypoUnit = 'px' | 'pt' | 'em' | 'rem';
const units: { value: TypoUnit; label: string }[] = [
  { value: "px", label: "px (Pixels)" },
  { value: "pt", label: "pt (Points)" },
  { value: "em", label: "em (Em)" },
  { value: "rem", label: "rem (Rem)" },
];

export default function TypographyConverter() {
  const [inputValue, setInputValue] = useState<string>("16");
  const [outputValue, setOutputValue] = useState<string>("");
  const [fromUnit, setFromUnit] = useState<TypoUnit>("px");
  const [toUnit, setToUnit] = useState<TypoUnit>("rem");
  const [baseSize, setBaseSize] = useState<string>("16");

  useEffect(() => {
    const num = parseFloat(inputValue);
    const base = parseFloat(baseSize);
    if (!isNaN(num) && !isNaN(base) && base > 0) {
      const result = convertTypography(num, fromUnit, toUnit, base);
      const formattedResult = Number(result.toPrecision(6)).toString();
      setOutputValue(formattedResult);
    } else {
      setOutputValue("");
    }
  }, [inputValue, fromUnit, toUnit, baseSize]);
  
  const handleSwap = () => {
    const currentInput = inputValue;
    const currentFrom = fromUnit;
    setFromUnit(toUnit);
    setToUnit(currentFrom);
    setInputValue(outputValue);
    setOutputValue(currentInput);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 max-w-xs">
        <Label htmlFor="base-size">Base Font Size (px)</Label>
        <Input 
          id="base-size"
          type="number"
          value={baseSize}
          onChange={(e) => setBaseSize(e.target.value)}
        />
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="space-y-2">
            <Select value={fromUnit} onValueChange={(v) => setFromUnit(v as TypoUnit)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {units.map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input 
              type="number" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)}
              className="text-lg"
            />
          </div>
          
          <Button variant="ghost" size="icon" onClick={handleSwap} className="self-end hidden md:flex">
            <ArrowRightLeft className="w-5 h-5" />
          </Button>
          <Button variant="outline" onClick={handleSwap} className="flex md:hidden items-center gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            <span>Swap</span>
          </Button>

          <div className="space-y-2">
            <Select value={toUnit} onValueChange={(v) => setToUnit(v as TypoUnit)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {units.map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input 
              type="number" 
              readOnly 
              value={outputValue} 
              className="text-lg font-semibold bg-muted" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
