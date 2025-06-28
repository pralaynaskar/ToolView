"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateTriangle, calculateTriangleFromBaseHeight } from '@/lib/converters'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type CalculationMode = 'three_sides' | 'base_height';

export default function TriangleCalculator() {
  const [mode, setMode] = useState<CalculationMode>('three_sides');
  const [a, setA] = useState('5');
  const [b, setB] = useState('6');
  const [c, setC] = useState('7');

  const { area, perimeter, type } = useMemo(() => {
      if (mode === 'three_sides') {
        return calculateTriangle(parseFloat(a), parseFloat(b), parseFloat(c));
      }
      // base_height
      const { area: areaFromBase, perimeter: perimFromBase, type: typeFromBase } = calculateTriangleFromBaseHeight(parseFloat(a), parseFloat(b));
      return { area: areaFromBase, perimeter: perimFromBase, type: typeFromBase };
  }, [a, b, c, mode]);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="space-y-2">
          <Label htmlFor="mode">Calculate from</Label>
          <Select value={mode} onValueChange={(v) => setMode(v as CalculationMode)}>
              <SelectTrigger id="mode"><SelectValue /></SelectTrigger>
              <SelectContent>
                  <SelectItem value="three_sides">Three Sides (SSS)</SelectItem>
                  <SelectItem value="base_height">Base & Height</SelectItem>
              </SelectContent>
          </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="a">{mode === 'three_sides' ? 'Side a' : 'Base'}</Label>
          <Input id="a" type="number" value={a} onChange={(e) => setA(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="b">{mode === 'three_sides' ? 'Side b' : 'Height'}</Label>
          <Input id="b" type="number" value={b} onChange={(e) => setB(e.target.value)} />
        </div>
        {mode === 'three_sides' && (
          <div className="space-y-2">
              <Label htmlFor="c">Side c</Label>
              <Input id="c" type="number" value={c} onChange={(e) => setC(e.target.value)} />
          </div>
        )}
      </div>

      {type === 'Invalid' && (
          <Alert variant="destructive">
              <AlertDescription>
                  These side lengths do not form a valid triangle. The sum of any two sides must be greater than the third side.
              </AlertDescription>
          </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Results</span>
            {type !== 'Invalid' && <Badge variant="secondary">{type}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{area.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Area</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">{perimeter > 0 ? perimeter.toLocaleString() : "N/A"}</p>
            <p className="text-sm text-muted-foreground">Perimeter</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
