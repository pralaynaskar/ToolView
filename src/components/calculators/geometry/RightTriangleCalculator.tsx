"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateRightTriangleFrom } from '@/lib/converters'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type CalculationMode = 'leg_leg' | 'leg_hypotenuse';

export default function RightTriangleCalculator() {
  const [mode, setMode] = useState<CalculationMode>('leg_leg');
  const [value1, setValue1] = useState('3');
  const [value2, setValue2] = useState('4');

  const { area, perimeter, legA, legB, hypotenuse } = useMemo(() => {
    return calculateRightTriangleFrom(parseFloat(value1), parseFloat(value2), mode);
  }, [value1, value2, mode]);

  const labels: Record<CalculationMode, {l1: string, l2: string}> = {
    leg_leg: { l1: 'Leg a', l2: 'Leg b' },
    leg_hypotenuse: { l1: 'Leg a', l2: 'Hypotenuse (c)' },
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="space-y-2">
          <Label htmlFor="mode">Calculate from</Label>
          <Select value={mode} onValueChange={(v) => setMode(v as CalculationMode)}>
              <SelectTrigger id="mode"><SelectValue /></SelectTrigger>
              <SelectContent>
                  <SelectItem value="leg_leg">Two Legs (a, b)</SelectItem>
                  <SelectItem value="leg_hypotenuse">Leg and Hypotenuse (a, c)</SelectItem>
              </SelectContent>
          </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
              <Label htmlFor="value1">{labels[mode].l1}</Label>
              <Input id="value1" type="number" value={value1} onChange={(e) => setValue1(e.target.value)} />
          </div>
          <div className="space-y-2">
              <Label htmlFor="value2">{labels[mode].l2}</Label>
              <Input id="value2" type="number" value={value2} onChange={(e) => setValue2(e.target.value)} />
          </div>
      </div>

      <Card>
          <CardHeader>
          <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-center">
          <div>
              <p className="text-lg font-bold text-primary">{legA.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Leg a</p>
          </div>
          <div>
              <p className="text-lg font-bold text-primary">{legB.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Leg b</p>
          </div>
          <div>
              <p className="text-lg font-bold text-primary">{hypotenuse.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Hypotenuse (c)</p>
          </div>
          <div>
              <p className="text-lg font-bold text-primary">{perimeter.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Perimeter</p>
          </div>
          <div className="col-span-2">
              <p className="text-lg font-bold text-primary">{area.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Area</p>
          </div>
          </CardContent>
      </Card>
    </div>
  )
}
