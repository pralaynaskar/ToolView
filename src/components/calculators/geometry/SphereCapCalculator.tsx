
"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateSphereCap } from '@/lib/converters'

export default function SphereCapCalculator() {
  const [sphereRadius, setSphereRadius] = useState('10');
  const [capHeight, setCapHeight] = useState('4');

  const { volume, surfaceArea } = useMemo(() => {
    return calculateSphereCap(parseFloat(sphereRadius), parseFloat(capHeight));
  }, [sphereRadius, capHeight]);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="sphereRadius">Sphere Radius (R)</Label>
            <Input id="sphereRadius" type="number" value={sphereRadius} onChange={(e) => setSphereRadius(e.target.value)} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="capHeight">Cap Height (h)</Label>
            <Input id="capHeight" type="number" value={capHeight} onChange={(e) => setCapHeight(e.target.value)} />
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
            <p className="text-xs text-muted-foreground">Cap Surface Area</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
