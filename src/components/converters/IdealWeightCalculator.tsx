
"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { HistoryEntry } from '@/types';
import { calculateIdealWeight } from '@/lib/converters';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

type Gender = 'male' | 'female';
type HeightUnit = 'cm' | 'm' | 'ft+in';

export default function IdealWeightCalculator() {
  const [gender, setGender] = useState<Gender>('male');
  const [height, setHeight] = useState<string>("175");
  const [heightFt, setHeightFt] = useState<string>("5");
  const [heightIn, setHeightIn] = useState<string>("9");
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [result, setResult] = useState<string | null>(null);
  const [, setHistory] = useLocalStorage<HistoryEntry[]>("calc-history", []);

  useEffect(() => {
    let h: number;
    let hForCalcUnit: 'cm' | 'in' | 'm';
    let hDisplay: string;

    if (heightUnit === 'ft+in') {
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      h = (ft * 12) + inch;
      hForCalcUnit = 'in';
      hDisplay = `${ft}ft ${inch}in`;
    } else {
      h = parseFloat(height);
      hForCalcUnit = heightUnit as 'cm' | 'm';
      hDisplay = `${h} ${heightUnit}`;
    }

    if (!isNaN(h) && h > 0) {
      const { idealWeightKg } = calculateIdealWeight(h, hForCalcUnit, gender);
      const formattedResult = idealWeightKg > 0 ? idealWeightKg.toFixed(1) : "N/A";
      setResult(formattedResult);

      if (idealWeightKg > 0) {
        const newEntry: HistoryEntry = {
          id: new Date().toISOString(),
          type: 'Ideal Weight Calculator',
          calculation: `Ideal weight for ${gender}, ${hDisplay}: ${formattedResult} kg`,
          timestamp: new Date().toISOString(),
        };
        setHistory(prev => [newEntry, ...prev.slice(0, 49)]);
      }
    } else {
      setResult(null);
    }
  }, [gender, height, heightFt, heightIn, heightUnit, setHistory]);

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
          <Label>Height</Label>
          <div className="flex gap-2">
            {heightUnit === 'ft+in' ? (
                <div className="flex w-full gap-2">
                    <Input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} placeholder="ft" />
                    <Input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} placeholder="in" />
                </div>
            ) : (
                <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
            )}
             <Select value={heightUnit} onValueChange={(v) => setHeightUnit(v as HeightUnit)}>
              <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cm">cm</SelectItem>
                <SelectItem value="m">m</SelectItem>
                <SelectItem value="ft+in">ft + in</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {result !== null && (
        <Card className="bg-muted">
          <CardContent className="p-6 text-center">
            <p className="text-lg text-muted-foreground">Estimated Ideal Weight (Robinson Formula)</p>
            <p className="text-5xl font-bold text-primary">{result} <span className="text-3xl text-muted-foreground">{result !== 'N/A' ? 'kg' : ''}</span></p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
