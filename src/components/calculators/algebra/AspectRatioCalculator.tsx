
"use client"

import React, { useState, useMemo, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateAspectRatio } from '@/lib/converters'
import { Lock, LockOpen } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

export default function AspectRatioCalculator() {
  const [w1, setW1] = useState('1920');
  const [h1, setH1] = useState('1080');
  const [w2, setW2] = useState('1280');
  const [h2, setH2] = useState('720');
  const [isLocked, setIsLocked] = useState(true);
  const [lastChanged, setLastChanged] = useState<'w2' | 'h2'>('w2');

  const { width, height } = useMemo(() => {
    if (!isLocked) {
      return { width: parseFloat(w2), height: parseFloat(h2) };
    }
    if (lastChanged === 'w2') {
      return calculateAspectRatio(parseFloat(w1), parseFloat(h1), parseFloat(w2), null);
    } else {
      return calculateAspectRatio(parseFloat(w1), parseFloat(h1), null, parseFloat(h2));
    }
  }, [w1, h1, w2, h2, isLocked, lastChanged]);
  
  useEffect(() => {
    setW2(Number(width.toFixed(0)).toString());
    setH2(Number(height.toFixed(0)).toString());
  }, [width, height]);


  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Original Size</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="w1">Width</Label>
            <Input id="w1" type="number" value={w1} onChange={(e) => setW1(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="h1">Height</Label>
            <Input id="h1" type="number" value={h1} onChange={(e) => setH1(e.target.value)} />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center items-center gap-2 text-muted-foreground">
        <LockOpen className="size-4" />
        <Switch checked={isLocked} onCheckedChange={setIsLocked} id="lock-aspect-ratio" />
        <Lock className="size-4" />
        <Label htmlFor="lock-aspect-ratio" className="text-sm">Lock Aspect Ratio</Label>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Size</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="w2">Width</Label>
            <Input id="w2" type="number" value={w2} onChange={(e) => {setW2(e.target.value); setLastChanged('w2')}} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="h2">Height</Label>
            <Input id="h2" type="number" value={h2} onChange={(e) => {setH2(e.target.value); setLastChanged('h2')}} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
