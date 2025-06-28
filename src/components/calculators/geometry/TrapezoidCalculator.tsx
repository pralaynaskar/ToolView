"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateTrapezoid } from '@/lib/converters'

export default function TrapezoidCalculator() {
  const [base1, setBase1] = useState('10')
  const [base2, setBase2] = useState('15')
  const [height, setHeight] = useState('8')

  const { area } = useMemo(() => {
    return calculateTrapezoid(parseFloat(base1), parseFloat(base2), parseFloat(height));
  }, [base1, base2, height]);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="base1">Base 1 (a)</Label>
          <Input id="base1" type="number" value={base1} onChange={(e) => setBase1(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="base2">Base 2 (b)</Label>
          <Input id="base2" type="number" value={base2} onChange={(e) => setBase2(e.target.value)} />
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
        <CardContent className="grid grid-cols-1 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{area.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Area</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
