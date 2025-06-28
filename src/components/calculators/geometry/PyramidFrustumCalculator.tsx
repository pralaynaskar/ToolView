
"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculatePyramidFrustum } from '@/lib/converters'

export default function PyramidFrustumCalculator() {
  const [baseSide1, setBaseSide1] = useState('10');
  const [baseSide2, setBaseSide2] = useState('6');
  const [height, setHeight] = useState('8');

  const { volume } = useMemo(() => {
    return calculatePyramidFrustum(parseFloat(baseSide1), parseFloat(baseSide2), parseFloat(height));
  }, [baseSide1, baseSide2, height]);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <p className="text-sm text-muted-foreground text-center">Calculates the volume of a frustum of a right square pyramid.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
            <Label htmlFor="baseSide1">Top Base Side (a)</Label>
            <Input id="baseSide1" type="number" value={baseSide1} onChange={(e) => setBaseSide1(e.target.value)} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="baseSide2">Bottom Base Side (b)</Label>
            <Input id="baseSide2" type="number" value={baseSide2} onChange={(e) => setBaseSide2(e.target.value)} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="height">Height (h)</Label>
            <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Result</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div>
            <p className="text-lg font-bold text-primary">{volume.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Volume</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
