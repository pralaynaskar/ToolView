
"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateSphereSegment } from '@/lib/converters'

export default function SphereSegmentCalculator() {
  const [radius1, setRadius1] = useState('8');
  const [radius2, setRadius2] = useState('6');
  const [height, setHeight] = useState('4');

  const { volume } = useMemo(() => {
    return calculateSphereSegment(parseFloat(radius1), parseFloat(radius2), parseFloat(height));
  }, [radius1, radius2, height]);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <p className="text-sm text-muted-foreground text-center">Calculates the volume of a spherical segment with two bases (frustum).</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
            <Label htmlFor="radius1">Top Radius (r1)</Label>
            <Input id="radius1" type="number" value={radius1} onChange={(e) => setRadius1(e.target.value)} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="radius2">Bottom Radius (r2)</Label>
            <Input id="radius2" type="number" value={radius2} onChange={(e) => setRadius2(e.target.value)} />
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
