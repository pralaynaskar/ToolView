
"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { calculateProportion } from '@/lib/converters'
import { ArrowDown, ArrowRight } from 'lucide-react'

export default function ProportionalCalculator() {
  const [a, setA] = useState('1')
  const [b, setB] = useState('2')
  const [c, setC] = useState('3')

  const { d } = useMemo(() => {
    return calculateProportion(parseFloat(a), parseFloat(b), parseFloat(c))
  }, [a, b, c]);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-center gap-4 text-center text-lg">
        <div className="space-y-1">
          <Input value={a} onChange={(e) => setA(e.target.value)} className="text-center text-xl h-14" />
          <Label>A</Label>
        </div>
        <ArrowRight className="w-6 h-6 text-muted-foreground" />
        <div className="space-y-1">
          <Input value={b} onChange={(e) => setB(e.target.value)} className="text-center text-xl h-14" />
          <Label>B</Label>
        </div>
      </div>
      <div className="flex justify-center">
        <ArrowDown className="w-6 h-6 text-muted-foreground" />
      </div>
      <div className="flex items-center justify-center gap-4 text-center text-lg">
        <div className="space-y-1">
          <Input value={c} onChange={(e) => setC(e.target.value)} className="text-center text-xl h-14" />
          <Label>C</Label>
        </div>
        <ArrowRight className="w-6 h-6 text-muted-foreground" />
        <div className="space-y-1">
          <Card className="flex items-center justify-center h-14 w-full min-w-24 bg-muted">
            <span className="text-xl font-bold text-primary">{d.toLocaleString()}</span>
          </Card>
          <Label>D (Result)</Label>
        </div>
      </div>
    </div>
  )
}
