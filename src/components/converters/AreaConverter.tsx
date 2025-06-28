
"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { HistoryEntry } from '@/types';
import { convertUnit } from '@/lib/converters';
import { ArrowRightLeft } from 'lucide-react';
import { Button } from '../ui/button';

const units = [
  { value: "m2", label: "m² (Square Meter)" },
  { value: "km2", label: "km² (Square Kilometer)" },
  { value: "cm2", label: "cm² (Square Centimeter)" },
  { value: "mm2", label: "mm² (Square Millimeter)" },
  { value: "ha", label: "ha (Hectare)" },
  { value: "acre", label: "acre (Acre)" },
  { value: "ft2", label: "ft² (Square Foot)" },
  { value: "in2", label: "in² (Square Inch)" },
];

export default function AreaConverter() {
  const [inputValue, setInputValue] = useState<string>("1");
  const [outputValue, setOutputValue] = useState<string>("");
  const [fromUnit, setFromUnit] = useState("m2");
  const [toUnit, setToUnit] = useState("ft2");
  const [, setHistory] = useLocalStorage<HistoryEntry[]>("calc-history", []);

  useEffect(() => {
    const num = parseFloat(inputValue);
    if (!isNaN(num)) {
      const result = convertUnit(num, 'area', fromUnit, toUnit);
      const formattedResult = Number(result.toPrecision(6)).toString();
      setOutputValue(formattedResult);

      const newEntry: HistoryEntry = {
        id: new Date().toISOString(),
        type: 'Area',
        calculation: `${num} ${fromUnit} → ${formattedResult} ${toUnit}`,
        timestamp: new Date().toISOString(),
      };
      setHistory(prev => [newEntry, ...prev.slice(0, 49)]);
    } else {
      setOutputValue("");
    }
  }, [inputValue, fromUnit, toUnit, setHistory]);
  
  const handleSwap = () => {
    const currentInput = inputValue;
    const currentFrom = fromUnit;
    setFromUnit(toUnit);
    setToUnit(currentFrom);
    setInputValue(outputValue);
    setOutputValue(currentInput);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="space-y-2">
          <Select value={fromUnit} onValueChange={setFromUnit}>
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
          <Select value={toUnit} onValueChange={setToUnit}>
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
  );
}
