
"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { solveQuadratic } from '@/lib/converters'

export default function EquationSolver() {
  const [a, setA] = useState('1')
  const [b, setB] = useState('-3')
  const [c, setC] = useState('2')

  const { roots, description } = useMemo(() => {
    return solveQuadratic(parseFloat(a), parseFloat(b), parseFloat(c))
  }, [a, b, c]);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Quadratic Equation Solver</h3>
        <p className="text-muted-foreground">Solves equations of the form ax² + bx + c = 0</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="coeff-a">Coefficient a</Label>
          <Input id="coeff-a" type="number" value={a} onChange={(e) => setA(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="coeff-b">Coefficient b</Label>
          <Input id="coeff-b" type="number" value={b} onChange={(e) => setB(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="coeff-c">Coefficient c</Label>
          <Input id="coeff-c" type="number" value={c} onChange={(e) => setC(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {roots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              {roots.map((root, i) => (
                <div key={i} className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Root {i + 1}</p>
                  <p className="text-2xl font-bold text-primary">{typeof root === 'number' ? root.toLocaleString() : root}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">{description.includes('complex') ? '' : 'No real roots found.'}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
