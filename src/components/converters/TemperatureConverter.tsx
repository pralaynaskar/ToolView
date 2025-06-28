"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { HistoryEntry } from '@/types';
import { convertTemperature } from '@/lib/converters';
import { ArrowRightLeft } from 'lucide-react';
import { Button } from '../ui/button';

type TempUnit = 'C' | 'F' | 'K' | 'R' | 'De' | 'N' | 'Re' | 'Ro';
const units: { unit: TempUnit, name: string }[] = [
  { unit: "C", name: "Celsius (°C)" },
  { unit: "F", name: "Fahrenheit (°F)" },
  { unit: "K", name: "Kelvin (K)" },
  { unit: "R", name: "Rankine (°R)" },
  { unit: "De", name: "Delisle (°De)" },
  { unit: "N", name: "Newton (°N)" },
  { unit: "Re", name: "Réaumur (°Ré)" },
  { unit: "Ro", name: "Rømer (°Rø)" },
];


export default function TemperatureConverter() {
  const [inputValue, setInputValue] = useState<string>("0");
  const [outputValue, setOutputValue] = useState<string>("");
  const [fromUnit, setFromUnit] = useState<TempUnit>("C");
  const [toUnit, setToUnit] = useState<TempUnit>("F");
  const [, setHistory] = useLocalStorage<HistoryEntry[]>("calc-history", []);

  const getUnitSymbol = (unit: TempUnit) => {
    const unitInfo = units.find(u => u.unit === unit);
    const name = unitInfo?.name || unit;
    const symbol = name.substring(name.indexOf('('));
    return symbol ? symbol.replace('(', '').replace(')', '') : unit;
  }

  useEffect(() => {
    const num = parseFloat(inputValue);
    if (!isNaN(num)) {
      const result = convertTemperature(num, fromUnit, toUnit);
      const formattedResult = Number(result.toFixed(2)).toString();
      setOutputValue(formattedResult);

      const newEntry: HistoryEntry = {
        id: new Date().toISOString(),
        type: 'Temperature',
        calculation: `${num} ${getUnitSymbol(fromUnit)} → ${formattedResult} ${getUnitSymbol(toUnit)}`,
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
  
  const getCelsiusValue = (): number | null => {
      const num = parseFloat(inputValue);
      if (isNaN(num)) return null;
      return convertTemperature(num, fromUnit, 'C');
  }

  const celsiusValue = getCelsiusValue();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="space-y-2">
          <Select value={fromUnit} onValueChange={(v) => setFromUnit(v as TempUnit)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {units.map(u => <SelectItem key={`from-${u.unit}`} value={u.unit}>{u.name}</SelectItem>)}
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
          <Select value={toUnit} onValueChange={(v) => setToUnit(v as TempUnit)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {units.map(u => <SelectItem key={`to-${u.unit}`} value={u.unit}>{u.name}</SelectItem>)}
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
       <div className="pt-4 space-y-3">
        <div className="relative h-2 w-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 via-yellow-400 to-red-600">
            {celsiusValue !== null && (
                <div 
                    className="absolute top-1/2 h-4 w-4 rounded-full bg-white border-2 border-primary ring-2 ring-white -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                    style={{ left: `${Math.max(0, Math.min(100, (celsiusValue + 40) / 0.8))}%` }} // Maps -40C to 0% and 40C to 100%
                ></div>
            )}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
            <span>-40°C</span>
            <span>0°C</span>
            <span>40°C</span>
        </div>
      </div>
    </div>
  );
}
