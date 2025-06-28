"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { calculateRegularPolygonFrom } from '@/lib/converters'

type CalculationMode = 'side' | 'perimeter' | 'area';

export default function PentagonCalculator() {
  const [mode, setMode] = useState<CalculationMode>('side');
  const [value, setValue] = useState('10');

  const { area, perimeter, sideLength } = useMemo(() => {
    return calculateRegularPolygonFrom(5, parseFloat(value), mode);
  }, [value, mode]);

  const labels: Record<CalculationMode, string> = {
    side: 'Side Length',
    perimeter: 'Perimeter',
    area: 'Area'
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="space-y-2">
        <Label htmlFor="mode">Calculate from</Label>
        <Select value={mode} onValueChange={(v) => setMode(v as CalculationMode)}>
          <SelectTrigger id="mode"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="side">Side Length</SelectItem>
            <SelectItem value="perimeter">Perimeter</SelectItem>
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
          <CardTitle>Results (Regular Pentagon)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-primary">{sideLength.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Side Length</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">{perimeter.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Perimeter</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">{area.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Area</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
