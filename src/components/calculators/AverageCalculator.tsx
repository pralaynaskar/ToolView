"use client"

import React, { useState, useMemo } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { calculateAverage } from '@/lib/converters'

export default function AverageCalculator() {
  const [text, setText] = useState('1, 2, 3, 4, 5')

  const stats = useMemo(() => {
    const numbers = text.split(/[\s,]+/).filter(Boolean).map(Number).filter(n => !isNaN(n));
    return calculateAverage(numbers);
  }, [text]);

  return (
    <div className="space-y-4">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter numbers separated by spaces or commas..."
        className="min-h-[150px] text-base"
      />
      <Card>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{stats.average.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Average</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">{stats.sum.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Sum</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">{stats.count.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Count</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
