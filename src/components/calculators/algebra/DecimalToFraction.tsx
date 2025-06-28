
"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { decimalToFraction } from '@/lib/converters'

export default function DecimalToFraction() {
  const [decimal, setDecimal] = useState('0.75')

  const { n, d } = useMemo(() => {
    return decimalToFraction(parseFloat(decimal));
  }, [decimal]);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="space-y-2">
        <Label htmlFor="decimal-input">Decimal Number</Label>
        <Input
          id="decimal-input"
          type="number"
          step="any"
          value={decimal}
          onChange={(e) => setDecimal(e.target.value)}
          className="text-lg"
        />
      </div>

      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-lg text-muted-foreground">Fraction</p>
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
