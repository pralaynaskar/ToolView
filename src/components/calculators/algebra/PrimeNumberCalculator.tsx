
"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { isPrime } from '@/lib/converters'

export default function PrimeNumberCalculator() {
  const [number, setNumber] = useState('17')

  const result = useMemo(() => {
    const num = parseInt(number, 10);
    if (isNaN(num)) return 'Invalid';
    return isPrime(num) ? 'Prime' : 'Not Prime';
  }, [number]);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="space-y-2">
        <Label htmlFor="number-input">Enter an integer</Label>
        <Input
          id="number-input"
          type="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="text-lg"
        />
      </div>

      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-lg text-muted-foreground">Result</p>
          <p className="text-5xl font-bold text-primary">{result}</p>
        </CardContent>
      </Card>
    </div>
  )
}
