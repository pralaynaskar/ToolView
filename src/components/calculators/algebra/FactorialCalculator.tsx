
"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { calculateFactorial } from '@/lib/converters'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function FactorialCalculator() {
  const [number, setNumber] = useState('10')

  const result = useMemo(() => {
    return calculateFactorial(parseInt(number, 10))
  }, [number]);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="space-y-2">
        <Label htmlFor="number">Number (n)</Label>
        <Input id="number" type="number" value={number} onChange={(e) => setNumber(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-lg text-muted-foreground">Factorial (n!)</p>
          <p className="text-4xl font-bold text-primary break-all">{isNaN(result) ? 'Invalid' : result.toLocaleString()}</p>
        </CardContent>
      </Card>

      {parseInt(number) > 170 && (
         <Alert variant="destructive">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
                Factorials of numbers greater than 170 are too large to be represented accurately and will result in Infinity.
            </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
