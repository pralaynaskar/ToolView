
"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { HistoryEntry } from '@/types';
import { calculateWaterIntake } from '@/lib/converters';
import { Label } from '../ui/label';

type WeightUnit = 'kg' | 'lb';
type ActivityLevel = 'sedentary' | 'moderate' | 'high';

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState<string>("70");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [result, setResult] = useState<string | null>(null);
  const [, setHistory] = useLocalStorage<HistoryEntry[]>("calc-history", []);

  useEffect(() => {
    const numWeight = parseFloat(weight);

    if (!isNaN(numWeight) && numWeight > 0) {
      const intake = calculateWaterIntake(numWeight, weightUnit, activityLevel);
      const formattedResult = intake.toFixed(2);
      setResult(formattedResult);

      const newEntry: HistoryEntry = {
        id: new Date().toISOString(),
        type: 'Water intake Calculator',
        calculation: `Intake for ${numWeight} ${weightUnit}, ${activityLevel} activity: ${formattedResult} L`,
        timestamp: new Date().toISOString(),
      };
      setHistory(prev => [newEntry, ...prev.slice(0, 49)]);
    } else {
      setResult(null);
    }
  }, [weight, weightUnit, activityLevel, setHistory]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Your Weight</Label>
          <div className="flex gap-2">
            <Input 
              type="number" 
              value={weight} 
              onChange={(e) => setWeight(e.target.value)}
              className="text-lg"
            />
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
          <Label>Daily Physical Activity</Label>
          <Select value={activityLevel} onValueChange={(v) => setActivityLevel(v as ActivityLevel)}>
            <SelectTrigger className="text-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
              <SelectItem value="moderate">Moderate (30-60 min of exercise)</SelectItem>
              <SelectItem value="high">High (more than 60 min of exercise)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {result !== null && (
        <Card className="bg-muted">
          <CardContent className="p-6 text-center">
            <p className="text-lg text-muted-foreground">Recommended Daily Water Intake</p>
            <p className="text-5xl font-bold text-primary">{result} <span className="text-3xl text-muted-foreground">Liters</span></p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
