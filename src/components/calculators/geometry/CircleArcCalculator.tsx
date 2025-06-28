
"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateCircleArc } from '@/lib/converters'

export default function CircleArcCalculator() {
  const [radius, setRadius] = useState('10');
  const [angle, setAngle] = useState('90');

  const { arcLength, sectorArea, chordLength } = useMemo(() => {
    return calculateCircleArc(parseFloat(radius), parseFloat(angle));
  }, [radius, angle]);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="radius">Radius (r)</Label>
            <Input id="radius" type="number" value={radius} onChange={(e) => setRadius(e.target.value)} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="angle">Angle (θ) in degrees</Label>
            <Input id="angle" type="number" value={angle} onChange={(e) => setAngle(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-primary">{arcLength.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Arc Length</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">{sectorArea.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Sector Area</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">{chordLength.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Chord Length</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
