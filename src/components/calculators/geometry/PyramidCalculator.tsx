"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateSquarePyramid } from '@/lib/converters'

export default function PyramidCalculator() {
  const [baseSide, setBaseSide] = useState('10');
  const [height, setHeight] = useState('12');

  const { volume, slantHeight, surfaceArea } = useMemo(() => {
    return calculateSquarePyramid(parseFloat(baseSide), parseFloat(height));
  }, [baseSide, height]);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="baseSide">Base Side (a)</Label>
            <Input id="baseSide" type="number" value={baseSide} onChange={(e) => setBaseSide(e.target.value)} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="height">Height (h)</Label>
            <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Results (Square Pyramid)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-primary">{volume.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Volume</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">{surfaceArea.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Surface Area</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">{slantHeight.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Slant Height (l)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
