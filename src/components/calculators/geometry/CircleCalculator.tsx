"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { calculateCircleFrom } from '@/lib/converters'

type CalculationMode = 'radius' | 'diameter' | 'circumference' | 'area';

export default function CircleCalculator() {
  const [mode, setMode] = useState<CalculationMode>('radius');
  const [value, setValue] = useState('10');

  const { area, circumference, diameter, radius } = useMemo(() => {
    return calculateCircleFrom(parseFloat(value), mode);
  }, [value, mode]);
  
  const labels: Record<CalculationMode, string> = {
    radius: 'Radius (r)',
    diameter: 'Diameter (d)',
    circumference: 'Circumference (c)',
    area: 'Area (A)'
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="space-y-2">
        <Label htmlFor="mode">Calculate from</Label>
        <Select value={mode} onValueChange={(v) => setMode(v as CalculationMode)}>
          <SelectTrigger id="mode"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="radius">Radius</SelectItem>
            <SelectItem value="diameter">Diameter</SelectItem>
            <SelectItem value="circumference">Circumference</SelectItem>
            <SelectItem value="area">Area</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="value">{labels[mode]}</Label>
        <Input id="value" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-primary">{radius.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Radius (r)</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">{diameter.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Diameter (d)</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">{circumference.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Circumference (c)</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">{area.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Area (A)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
