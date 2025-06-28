'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { HistoryEntry } from '@/types';
import { ArrowRightLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';


const currencyList = [
  { code: 'USD', name: 'United States Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'GBP', name: 'British Pound Sterling' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'BRL', name: 'Brazilian Real' },
  { code: 'RUB', name: 'Russian Ruble' },
  { code: 'KRW', name: 'South Korean Won' },
  { code: 'SGD', name: 'Singapore Dollar' },
  { code: 'MXN', name: 'Mexican Peso' },
];

export default function CurrencyConverter() {
  const [inputValue, setInputValue] = useState<string>("100");
  const [outputValue, setOutputValue] = useState<string>("");
  const [fromUnit, setFromUnit] = useState("USD");
  const [toUnit, setToUnit] = useState("EUR");
  const [isLoading, setIsLoading] = useState(true);
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [, setHistory] = useLocalStorage<HistoryEntry[]>("calc-history", []);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRates = async () => {
      if (fromUnit === toUnit) {
        setRates({ [fromUnit]: 1 });
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`https://api.frankfurter.app/latest?from=${fromUnit}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setRates(data.rates);
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch live exchange rates. Please try again later.",
        });
        setRates(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
  }, [fromUnit, toast]);

  useEffect(() => {
    if (fromUnit === toUnit) {
        setOutputValue(inputValue);
        return;
    }

    if (!rates) {
        setOutputValue("");
        return;
    };
    
    const num = parseFloat(inputValue);
    if (!isNaN(num) && rates[toUnit]) {
      const result = num * rates[toUnit];
      const formattedResult = Number(result.toFixed(2)).toString();
      setOutputValue(formattedResult);

      const newEntry: HistoryEntry = {
        id: new Date().toISOString(),
        type: 'Currency',
        calculation: `${num.toLocaleString()} ${fromUnit} → ${result.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${toUnit}`,
        timestamp: new Date().toISOString(),
      };
      setHistory(prev => [newEntry, ...prev.slice(0, 49)]);
    } else {
      setOutputValue("");
    }
  }, [inputValue, fromUnit, toUnit, rates, setHistory]);

  const handleSwap = () => {
    const currentFrom = fromUnit;
    setFromUnit(toUnit);
    setToUnit(currentFrom);
    // Values will be recalculated by useEffect
  };
  
  if (isLoading) {
      return (
          <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
                  <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                  </div>
              </div>
              <Skeleton className="h-16 w-full" />
          </div>
      )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="space-y-2">
          <Select value={fromUnit} onValueChange={setFromUnit}>
            <SelectTrigger><SelectValue placeholder="From" /></SelectTrigger>
            <SelectContent>
              {currencyList.map(c => <SelectItem key={c.code} value={c.code}>{c.code} - {c.name}</SelectItem>)}
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
            <SelectTrigger><SelectValue placeholder="To" /></SelectTrigger>
            <SelectContent>
              {currencyList.map(c => <SelectItem key={c.code} value={c.code}>{c.code} - {c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input 
            type="number" 
            readOnly 
            value={outputValue} 
            className="text-lg font-semibold bg-muted"
            placeholder="0.00"
          />
        </div>
      </div>
      {rates && rates[toUnit] && fromUnit !== toUnit && (
        <Card className="bg-secondary/50">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Live Exchange Rate
            </p>
            <p className="font-semibold text-primary">
              1 {fromUnit} = {rates[toUnit].toFixed(4)} {toUnit}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
