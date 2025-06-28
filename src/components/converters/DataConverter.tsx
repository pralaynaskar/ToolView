
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
    { value: "b", label: "b (bit)" },
    { value: "kb", label: "kb (kilobit)" },
    { value: "Mb", label: "Mb (Megabit)" },
    { value: "Gb", label: "Gb (Gigabit)" },
    { value: "Tb", label: "Tb (Terabit)" },
    { value: "kib", label: "kib (kibibit)" },
    { value: "Mib", label: "Mib (mebibit)" },
    { value: "Gib", label: "Gib (gibibit)" },
    { value: "Tib", label: "Tib (tebibit)" },
    { value: "B", label: "B (Byte)" },
    { value: "KB", label: "KB (Kilobyte)" },
    { value: "MB", label: "MB (Megabyte)" },
    { value: "GB", label: "GB (Gigabyte)" },
    { value: "TB", label: "TB (Terabyte)" },
    { value: "KiB", label: "KiB (Kibibyte)" },
    { value: "MiB", label: "MiB (Mebibyte)" },
    { value: "GiB", label: "GiB (Gibibyte)" },
    { value: "TiB", label: "TiB (Tebibyte)" },
];

export default function DataConverter() {
  const [inputValue, setInputValue] = useState<string>("1024");
  const [outputValue, setOutputValue] = useState<string>("");
  const [fromUnit, setFromUnit] = useState("MB");
  const [toUnit, setToUnit] = useState("MiB");
  const [, setHistory] = useLocalStorage<HistoryEntry[]>("calc-history", []);

  useEffect(() => {
    const num = parseFloat(inputValue);
    if (!isNaN(num)) {
      const result = convertUnit(num, 'data', fromUnit, toUnit);
      const formattedResult = Number(result.toPrecision(6)).toString();
      setOutputValue(formattedResult);

      const newEntry: HistoryEntry = {
        id: new Date().toISOString(),
        type: 'Data',
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
