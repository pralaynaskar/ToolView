"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { calculateCubeFrom } from '@/lib/converters'

type CalculationMode = 'side' | 'volume' | 'surfaceArea' | 'spaceDiagonal';

export default function CubeCalculator() {
  const [mode, setMode] = useState<CalculationMode>('side');
  const [value, setValue] = useState('10');

  const { volume, surfaceArea, spaceDiagonal, side } = useMemo(() => {
    return calculateCubeFrom(parseFloat(value), mode);
  }, [value, mode]);

  const labels: Record<CalculationMode, string> = {
    side: 'Side (a)',
    volume: 'Volume',
    surfaceArea: 'Surface Area',
    spaceDiagonal: 'Space Diagonal'
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="space-y-2">
        <Label htmlFor="mode">Calculate from</Label>
        <Select value={mode} onValueChange={(v) => setMode(v as CalculationMode)}>
          <SelectTrigger id="mode"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="side">Side</SelectItem>
            <SelectItem value="volume">Volume</SelectItem>
            <SelectItem value="surfaceArea">Surface Area</SelectItem>
            <SelectItem value="spaceDiagonal">Space Diagonal</SelectItem>
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
            <p className="text-lg font-bold text-primary">{volume.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Volume</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">{surfaceArea.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Surface Area</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">{spaceDiagonal.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Space Diagonal</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
