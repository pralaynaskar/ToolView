
"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { HistoryEntry } from '@/types';
import { calculateBmi } from '@/lib/converters';
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';

type WeightUnit = 'kg' | 'lb';
type HeightUnit = 'cm' | 'm' | 'ft+in';

export default function BmiConverter() {
  const [weight, setWeight] = useState<string>("70");
  const [height, setHeight] = useState<string>("175");
  const [heightFt, setHeightFt] = useState<string>("5");
  const [heightIn, setHeightIn] = useState<string>("9");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [bmi, setBmi] = useState<string>("");
  const [bmiCategory, setBmiCategory] = useState<string>("");
  const [bmiCategoryColor, setBmiCategoryColor] = useState<string>('text-primary');
  const [, setHistory] = useLocalStorage<HistoryEntry[]>("calc-history", []);

  const getBmiPosition = (bmiValue: number) => {
    const minBmi = 15;
    const maxBmi = 40;
    const position = ((bmiValue - minBmi) / (maxBmi - minBmi)) * 100;
    return Math.max(0, Math.min(100, position));
  };
  
  useEffect(() => {
    const w = parseFloat(weight);
    let h: number;
    let hForCalcUnit: 'cm' | 'm' | 'in' | 'ft';
    let hDisplay: string;

    if (heightUnit === 'ft+in') {
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      h = (ft * 12) + inch;
      hForCalcUnit = 'in'; // Use 'in' for the calculation logic
      hDisplay = `${ft}ft ${inch}in`;
    } else {
      h = parseFloat(height);
      hForCalcUnit = heightUnit as 'cm' | 'm';
      hDisplay = `${h} ${heightUnit}`;
    }


    if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
      const result = calculateBmi(w, h, weightUnit, hForCalcUnit);
      const formattedResult = Number(result.toFixed(2)).toString();
      setBmi(formattedResult);
      
      let category = '';
      let colorClass = '';

      if (result < 18.5) {
        category = "Underweight";
        colorClass = 'text-muted-foreground';
      } else if (result < 25) {
        category = "Normal weight";
        colorClass = 'text-accent';
      } else if (result < 30) {
        category = "Overweight";
        colorClass = 'text-primary';
      } else {
        category = "Obesity";
        colorClass = 'text-destructive';
      }
      setBmiCategory(category);
      setBmiCategoryColor(colorClass);
      
      const newEntry: HistoryEntry = {
        id: new Date().toISOString(),
        type: 'BMI Calculator',
        calculation: `BMI: ${formattedResult} (W: ${w} ${weightUnit}, H: ${hDisplay})`,
        timestamp: new Date().toISOString(),
      };
      setHistory(prev => [newEntry, ...prev.slice(0, 49)]);

    } else {
      setBmi("");
      setBmiCategory("");
      setBmiCategoryColor('text-primary');
    }
  }, [weight, height, heightFt, heightIn, weightUnit, heightUnit, setHistory]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Weight</label>
          <div className="flex gap-2">
            <Input 
              type="number" 
              value={weight} 
              onChange={(e) => setWeight(e.target.value)}
              className="text-lg"
            />
            <Select value={weightUnit} onValueChange={(v) => setWeightUnit(v as WeightUnit)}>
              <SelectTrigger className="w-[80px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">kg</SelectItem>
                <SelectItem value="lb">lb</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Height</label>
          <div className="flex gap-2">
            {heightUnit === 'ft+in' ? (
                <div className="flex w-full gap-2">
                    <Input
                        type="number"
                        value={heightFt}
                        onChange={(e) => setHeightFt(e.target.value)}
                        className="text-lg"
                        placeholder="ft"
                    />
                    <Input
                        type="number"
                        value={heightIn}
                        onChange={(e) => setHeightIn(e.target.value)}
                        className="text-lg"
                        placeholder="in"
                    />
                </div>
            ) : (
                <Input 
                  type="number" 
                  value={height} 
                  onChange={(e) => setHeight(e.target.value)}
                  className="text-lg"
                />
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
      
      {bmi && (
        <Card className="bg-muted overflow-hidden">
          <CardContent className="p-6 text-center">
            <p className="text-lg text-muted-foreground">Your BMI is</p>
            <p className={cn("text-5xl font-bold", bmiCategoryColor)}>{bmi}</p>
            <p className={cn("text-xl font-semibold mt-2", bmiCategoryColor)}>{bmiCategory}</p>
          </CardContent>
          <div className="px-6 pb-6">
            <div className="relative h-2 w-full rounded-full bg-gradient-to-r from-muted via-accent to-destructive">
                <div 
                    className="absolute top-1/2 h-4 w-4 rounded-full bg-white border-2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                    style={{ 
                        left: `${getBmiPosition(parseFloat(bmi))}%`,
                        borderColor: 'hsl(var(--' + bmiCategoryColor.replace('text-', '') + '))'
                    }}
                ></div>
            </div>
             <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
