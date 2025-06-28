
"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateEllipsoid } from '@/lib/converters'

export default function EllipsoidCalculator() {
  const [a, setA] = useState('10');
  const [b, setB] = useState('8');
  const [c, setC] = useState('6');

  const { volume, surfaceArea } = useMemo(() => {
    return calculateEllipsoid(parseFloat(a), parseFloat(b), parseFloat(c));
  }, [a, b, c]);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
            <Label htmlFor="a">Semi-axis a</Label>
            <Input id="a" type="number" value={a} onChange={(e) => setA(e.target.value)} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="b">Semi-axis b</Label>
            <Input id="b" type="number" value={b} onChange={(e) => setB(e.target.value)} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="c">Semi-axis c</Label>
            <Input id="c" type="number" value={c} onChange={(e) => setC(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-primary">{volume.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Volume</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">{surfaceArea.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Approx. Surface Area</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
