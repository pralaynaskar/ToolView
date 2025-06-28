'use client';

import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Using the W3C luminance algorithm
function isColorLight(hexColor: string): boolean {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return false;
  
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
  return luminance > 128;
}

export default function IsColorDarkened() {
  const [color, setColor] = useState('#4f46e5'); // A nice default indigo

  const isLight = useMemo(() => isColorLight(color), [color]);
  const textColor = isLight ? 'black' : 'white';

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="space-y-2">
        <Label htmlFor="color-input">Choose a color</Label>
        <div className="flex items-center gap-2">
          <Input
            id="color-input"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="p-1 h-12 w-24"
          />
           <Input value={color} onChange={e => setColor(e.target.value)} className="font-mono text-lg"/>
        </div>
      </div>
      
      <Card>
          <CardHeader>
              <CardTitle>Analysis</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="text-center text-2xl font-bold">
                  This color is considered <span className={isLight ? "text-primary" : "text-accent-foreground"}>{isLight ? 'Light' : 'Dark'}</span>
              </div>
          </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contrast Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="p-6 rounded-lg text-center"
            style={{ backgroundColor: color, color: textColor }}
          >
            <p className="text-lg font-semibold">This is the recommended text color for the best contrast.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
