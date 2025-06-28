'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { numberToWords } from '@/lib/converters';
import { Label } from '@/components/ui/label';

export default function NumberToWordConverter() {
  const [number, setNumber] = useState('1234567');

  const words = React.useMemo(() => {
    const num = parseInt(number, 10);
    if (isNaN(num)) return 'Please enter a valid number.';
    return numberToWords(num);
  }, [number]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-2">
        <Label htmlFor="number-input">Enter a number</Label>
        <Input
          id="number-input"
          type="number"
          value={number}
          onChange={e => setNumber(e.target.value)}
          className="text-lg"
          placeholder="e.g., 12345"
        />
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-lg font-semibold text-primary capitalize">
            {words}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
