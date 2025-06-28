
"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { HistoryEntry } from '@/types';
import { calculateBmr } from '@/lib/converters';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

type Gender = 'male' | 'female';
type WeightUnit = 'kg' | 'lb';
type HeightUnit = 'cm' | 'm';

export default function BmrCalculator() {
  const [gender, setGender] = useState<Gender>('male');
  const [weight, setWeight] = useState<string>("70");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [height, setHeight] = useState<string>("175");
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [age, setAge] = useState<string>("30");
  const [result, setResult] = useState<string | null>(null);
  const [, setHistory] = useLocalStorage<HistoryEntry[]>("calc-history", []);

  useEffect(() => {
    const numWeight = parseFloat(weight);
    const numHeight = parseFloat(height);
    const numAge = parseInt(age, 10);

    if (!isNaN(numWeight) && numWeight > 0 && !isNaN(numHeight) && numHeight > 0 && !isNaN(numAge) && numAge > 0) {
      const { bmr } = calculateBmr(numWeight, numHeight, numAge, gender, weightUnit, heightUnit);
      const formattedResult = bmr.toFixed(0);
      setResult(formattedResult);

      const newEntry: HistoryEntry = {
        id: new Date().toISOString(),
        type: 'BMR Calculator',
        calculation: `BMR: ${formattedResult} kcal/day`,
        timestamp: new Date().toISOString(),
      };
      setHistory(prev => [newEntry, ...prev.slice(0, 49)]);
    } else {
      setResult(null);
    }
  }, [gender, weight, weightUnit, height, heightUnit, age, setHistory]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
            <Label>Gender</Label>
            <RadioGroup value={gender} onValueChange={(v) => setGender(v as Gender)} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                </div>
            </RadioGroup>
        </div>
        <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Weight</Label>
          <div className="flex gap-2">
            <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
            <Select value={weightUnit} onValueChange={(v) => setWeightUnit(v as WeightUnit)}>
              <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">kg</SelectItem>
                <SelectItem value="lb">lbs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Height</Label>
          <div className="flex gap-2">
            <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
            <Select value={heightUnit} onValueChange={(v) => setHeightUnit(v as HeightUnit)}>
              <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cm">cm</SelectItem>
                <SelectItem value="m">m</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {result !== null && (
        <Card className="bg-muted">
          <CardContent className="p-6 text-center">
            <p className="text-lg text-muted-foreground">Basal Metabolic Rate (Mifflin-St Jeor)</p>
            <p className="text-5xl font-bold text-primary">{result} <span className="text-3xl text-muted-foreground">kcal/day</span></p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
