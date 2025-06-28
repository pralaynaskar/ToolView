'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dices } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function SimpleNumberGenerator() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [result, setResult] = useState<number | null>(null);

  const handleGenerate = () => {
    const minVal = Math.ceil(min);
    const maxVal = Math.floor(max);
    if (minVal > maxVal) {
      setResult(null);
      return;
    }
    const randomNumber = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
    setResult(randomNumber);
  };
  
  React.useEffect(() => {
    handleGenerate();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-4">
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="space-y-2">
                <Label htmlFor="min-val">Min</Label>
                <Input id="min-val" type="number" value={min} onChange={e => setMin(parseInt(e.target.value, 10) || 0)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="max-val">Max</Label>
                <Input id="max-val" type="number" value={max} onChange={e => setMax(parseInt(e.target.value, 10) || 0)} />
            </div>
        </div>
      <Button onClick={handleGenerate} size="lg">
        <Dices className="mr-2 h-5 w-5" />
        Generate Number
      </Button>
      {result !== null && (
        <Card className="w-full max-w-md">
            <CardContent className="p-6">
                 <p className="text-center text-8xl font-bold text-primary">{result}</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
