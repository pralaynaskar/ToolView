"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { calculateSquareFrom } from '@/lib/converters'

type CalculationMode = 'side' | 'perimeter' | 'area' | 'diagonal';

export default function SquareCalculator() {
  const [mode, setMode] = useState<CalculationMode>('side');
  const [value, setValue] = useState('10');

  const { area, perimeter, side, diagonal } = useMemo(() => {
    return calculateSquareFrom(parseFloat(value), mode);
  }, [value, mode]);
  
  const labels: Record<CalculationMode, string> = {
    side: 'Side (a)',
    perimeter: 'Perimeter',
    area: 'Area',
    diagonal: 'Diagonal (p)'
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="space-y-2">
        <Label htmlFor="mode">Calculate from</Label>
        <Select value={mode} onValueChange={(v) => setMode(v as CalculationMode)}>
          <SelectTrigger id="mode"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="side">Side</SelectItem>
            <SelectItem value="perimeter">Perimeter</SelectItem>
            <SelectItem value="area">Area</SelectItem>
            <SelectItem value="diagonal">Diagonal</SelectItem>
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
            <p className="text-lg font-bold text-primary">{side.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Side (a)</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">{perimeter.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Perimeter</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">{area.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Area</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">{diagonal.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Diagonal (p)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
