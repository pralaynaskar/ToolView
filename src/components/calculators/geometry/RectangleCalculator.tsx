"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { calculateRectangleFrom } from '@/lib/converters'

type CalculationMode = 'width_height' | 'area_width' | 'perimeter_width' | 'diagonal_width';

export default function RectangleCalculator() {
  const [mode, setMode] = useState<CalculationMode>('width_height');
  const [value1, setValue1] = useState('10');
  const [value2, setValue2] = useState('20');

  const { area, perimeter, width, height, diagonal } = useMemo(() => {
    return calculateRectangleFrom(parseFloat(value1), parseFloat(value2), mode);
  }, [value1, value2, mode]);

  const labels: Record<CalculationMode, {l1: string, l2: string}> = {
    width_height: { l1: 'Width (w)', l2: 'Height (h)' },
    area_width: { l1: 'Area (A)', l2: 'Width (w)' },
    perimeter_width: { l1: 'Perimeter (P)', l2: 'Width (w)' },
    diagonal_width: { l1: 'Diagonal (d)', l2: 'Width (w)' },
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="space-y-2">
        <Label htmlFor="mode">Calculate from</Label>
        <Select value={mode} onValueChange={(v) => setMode(v as CalculationMode)}>
          <SelectTrigger id="mode"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="width_height">Width & Height</SelectItem>
            <SelectItem value="area_width">Area & Width</SelectItem>
            <SelectItem value="perimeter_width">Perimeter & Width</SelectItem>
            <SelectItem value="diagonal_width">Diagonal & Width</SelectItem>
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
            <p className="text-lg font-bold text-primary">{width.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Width (w)</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">{height.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Height (h)</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">{area.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Area</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">{perimeter.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Perimeter</p>
          </div>
          <div className="col-span-2">
            <p className="text-lg font-bold text-primary">{diagonal.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Diagonal (d)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
