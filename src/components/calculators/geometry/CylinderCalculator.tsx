"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateCylinder } from '@/lib/converters'

export default function CylinderCalculator() {
  const [radius, setRadius] = useState('5');
  const [height, setHeight] = useState('10');

  const { volume, surfaceArea } = useMemo(() => {
    return calculateCylinder(parseFloat(radius), parseFloat(height));
  }, [radius, height]);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="radius">Radius (r)</Label>
            <Input id="radius" type="number" value={radius} onChange={(e) => setRadius(e.target.value)} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="height">Height (h)</Label>
            <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
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
            <p className="text-xs text-muted-foreground">Surface Area</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
