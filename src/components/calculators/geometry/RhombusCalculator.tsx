"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateRhombus } from '@/lib/converters'

export default function RhombusCalculator() {
  const [p, setP] = useState('12')
  const [q, setQ] = useState('16')

  const { area, side, perimeter } = useMemo(() => {
    return calculateRhombus(parseFloat(p), parseFloat(q));
  }, [p, q]);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="p">Diagonal p</Label>
          <Input id="p" type="number" value={p} onChange={(e) => setP(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="q">Diagonal q</Label>
          <Input id="q" type="number" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-primary">{area.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Area</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">{side.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Side Length</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">{perimeter.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Perimeter</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
