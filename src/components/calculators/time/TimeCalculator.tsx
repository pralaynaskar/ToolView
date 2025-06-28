
"use client"

import React, { useState, useMemo } from 'react'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { calculateTime } from '@/lib/converters'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Operation = 'add' | 'subtract';

const hours = Array.from({ length: 24 }, (_, i) => String(i));
const minutesAndSeconds = Array.from({ length: 60 }, (_, i) => String(i));

export default function TimeCalculator() {
  const [h1, setH1] = useState('10');
  const [m1, setM1] = useState('30');
  const [s1, setS1] = useState('0');
  const [h2, setH2] = useState('3');
  const [m2, setM2] = useState('45');
  const [s2, setS2] = useState('15');
  const [operation, setOperation] = useState<Operation>('add');

  const result = useMemo(() => {
    return calculateTime(
      parseInt(h1), parseInt(m1), parseInt(s1),
      parseInt(h2), parseInt(m2), parseInt(s2),
      operation
    );
  }, [h1, m1, s1, h2, m2, s2, operation]);

  const TimeInput = ({ h, m, s, setH, setM, setS }: { h: string, m: string, s: string, setH: (v: string) => void, setM: (v: string) => void, setS: (v: string) => void }) => (
    <div className="grid grid-cols-3 gap-2">
      <div>
        <Select value={h} onValueChange={setH}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {hours.map(hour => <SelectItem key={`h-${hour}`} value={hour}>{hour.padStart(2, '0')}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Select value={m} onValueChange={setM}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {minutesAndSeconds.map(min => <SelectItem key={`m-${min}`} value={min}>{min.padStart(2, '0')}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Select value={s} onValueChange={setS}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {minutesAndSeconds.map(sec => <SelectItem key={`s-${sec}`} value={sec}>{sec.padStart(2, '0')}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="space-y-2">
        <Label>Time 1 (H:M:S)</Label>
        <TimeInput h={h1} m={m1} s={s1} setH={setH1} setM={setM1} setS={setS1} />
      </div>
      
      <div className="flex justify-center">
        <RadioGroup value={operation} onValueChange={(v) => setOperation(v as Operation)} className="flex items-center space-x-2 border p-1 rounded-full">
            <Label htmlFor="add" className={cn("p-2 rounded-full cursor-pointer", operation === 'add' && "bg-primary text-primary-foreground")}>
                <Plus className="size-5" />
            </Label>
            <RadioGroupItem value="add" id="add" className="sr-only" />
            <Label htmlFor="subtract" className={cn("p-2 rounded-full cursor-pointer", operation === 'subtract' && "bg-primary text-primary-foreground")}>
                <Minus className="size-5" />
            </Label>
            <RadioGroupItem value="subtract" id="subtract" className="sr-only" />
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label>Time 2 (H:M:S)</Label>
        <TimeInput h={h2} m={m2} s={s2} setH={setH2} setM={setM2} setS={setS2} />
      </div>
      
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-lg text-muted-foreground">Result</p>
          <p className="text-4xl font-bold text-primary">{result.h}h {result.m}m {result.s}s</p>
        </CardContent>
      </Card>
    </div>
  )
}
