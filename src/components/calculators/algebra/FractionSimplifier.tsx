
"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { simplifyFraction } from '@/lib/converters'

export default function FractionSimplifier() {
  const [numerator, setNumerator] = useState('12')
  const [denominator, setDenominator] = useState('30')

  const { n, d } = useMemo(() => {
    return simplifyFraction(parseInt(numerator), parseInt(denominator));
  }, [numerator, denominator]);

  return (
    <div className="max-w-md mx-auto space-y-6">
       <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numerator">Numerator</Label>
          <Input id="numerator" type="number" value={numerator} onChange={(e) => setNumerator(e.target.value)} />
        </div>
        <hr/>
        <div className="space-y-2">
          <Label htmlFor="denominator">Denominator</Label>
          <Input id="denominator" type="number" value={denominator} onChange={(e) => setDenominator(e.target.value)} />
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-lg text-muted-foreground">Simplified Fraction</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-5xl font-bold text-primary">{n}</span>
            <span className="text-3xl font-bold text-muted-foreground">/</span>
            <span className="text-5xl font-bold text-primary">{d}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
