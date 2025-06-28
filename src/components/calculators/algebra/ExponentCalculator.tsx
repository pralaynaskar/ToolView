
"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { calculateExponent } from '@/lib/converters'

export default function ExponentCalculator() {
  const [base, setBase] = useState('2')
  const [exponent, setExponent] = useState('10')

  const result = useMemo(() => {
    return calculateExponent(parseFloat(base), parseFloat(exponent))
  }, [base, exponent]);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="base">Base</Label>
          <Input id="base" type="number" value={base} onChange={(e) => setBase(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="exponent">Exponent</Label>
          <Input id="exponent" type="number" value={exponent} onChange={(e) => setExponent(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-lg text-muted-foreground">Result</p>
          <p className="text-5xl font-bold text-primary">{result.toLocaleString()}</p>
        </CardContent>
      </Card>
    </div>
  )
}
