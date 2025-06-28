"use client"

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { calculatePercentage } from '@/lib/converters'

export default function PercentageCalculator() {
  const [mode, setMode] = useState('p_of_n');
  const [val1, setVal1] = useState('10');
  const [val2, setVal2] = useState('50');
  const [result, setResult] = useState<string | null>(null);

  const labels = {
    p_of_n: { l1: 'Percentage (%)', l2: 'Value' },
    n_is_p_of: { l1: 'Value 1', l2: 'Value 2' },
    increase: { l1: 'Initial Value', l2: 'Final Value' },
    decrease: { l1: 'Initial Value', l2: 'Final Value' },
  }

  useEffect(() => {
    const num1 = parseFloat(val1);
    const num2 = parseFloat(val2);
    const res = calculatePercentage(mode, num1, num2);

    if (res !== null && isFinite(res)) {
      setResult(Number(res.toFixed(4)).toString());
    } else {
      setResult(null);
    }
  }, [mode, val1, val2]);

  const resultLabel = {
    p_of_n: 'Result',
    n_is_p_of: 'Percentage (%)',
    increase: 'Increase (%)',
    decrease: 'Decrease (%)',
  }[mode]

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Calculation Mode</label>
        <Select value={mode} onValueChange={setMode}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="p_of_n">What is X% of Y?</SelectItem>
            <SelectItem value="n_is_p_of">X is what % of Y?</SelectItem>
            <SelectItem value="increase">Percentage Increase</SelectItem>
            <SelectItem value="decrease">Percentage Decrease</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{labels[mode as keyof typeof labels].l1}</label>
          <Input type="number" value={val1} onChange={e => setVal1(e.target.value)} className="text-lg" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">{labels[mode as keyof typeof labels].l2}</label>
          <Input type="number" value={val2} onChange={e => setVal2(e.target.value)} className="text-lg" />
        </div>
      </div>

      {result !== null && (
        <Card className="bg-muted">
          <CardContent className="p-6 text-center">
            <p className="text-lg text-muted-foreground">{resultLabel}</p>
            <p className="text-5xl font-bold text-primary">{result}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
