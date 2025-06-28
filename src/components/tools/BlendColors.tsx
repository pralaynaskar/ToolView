'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function blendColors(color1: string, color2: string, percentage: number): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return '#FFFFFF';

  const r = Math.round(rgb1.r * (1 - percentage) + rgb2.r * percentage);
  const g = Math.round(rgb1.g * (1 - percentage) + rgb2.g * percentage);
  const b = Math.round(rgb1.b * (1 - percentage) + rgb2.b * percentage);

  return rgbToHex(r, g, b);
}

export default function BlendColors() {
  const [color1, setColor1] = useState('#FF0000');
  const [color2, setColor2] = useState('#0000FF');
  const [ratio, setRatio] = useState(50);
  const { toast } = useToast();

  const blendedColor = blendColors(color1, color2, ratio / 100);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `Copied "${text}" to clipboard!` });
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="color1">Color 1</Label>
          <div className="flex items-center gap-2">
            <Input id="color1" type="color" value={color1} onChange={e => setColor1(e.target.value)} className="p-1 h-10"/>
            <Input value={color1} onChange={e => setColor1(e.target.value)} className="font-mono"/>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="color2">Color 2</Label>
           <div className="flex items-center gap-2">
            <Input id="color2" type="color" value={color2} onChange={e => setColor2(e.target.value)} className="p-1 h-10"/>
            <Input value={color2} onChange={e => setColor2(e.target.value)} className="font-mono"/>
          </div>
        </div>
      </div>
      
      <div>
        <Label>Blend Ratio: {ratio}%</Label>
        <Slider
          value={[ratio]}
          onValueChange={(value) => setRatio(value[0])}
          max={100}
          step={1}
        />
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
            <div className="w-full h-32 rounded-lg border" style={{ backgroundColor: blendedColor }} />
            <div className="flex justify-between items-center bg-muted p-2 rounded-md">
                <span className="font-mono text-sm">Blended Color (HEX)</span>
                <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold">{blendedColor}</span>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(blendedColor)}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
