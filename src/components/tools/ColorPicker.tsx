'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )})`
    : null;
}

function hexToHsl(hex: string) {
    let r = 0, g = 0, b = 0;
    if (hex.length == 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length == 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return `hsl(${h}, ${s}%, ${l}%)`;
}

export default function ColorPicker() {
  const [color, setColor] = useState('#fbbf24'); // A nice default tailwind yellow
  const { toast } = useToast();

  const rgbColor = hexToRgb(color);
  const hslColor = hexToHsl(color);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `Copied "${text}" to clipboard!` });
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-4">
      <div className="relative">
        <div
          className="w-48 h-48 rounded-full border-8 border-card shadow-lg"
          style={{ backgroundColor: color }}
        />
        <Input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 opacity-0 cursor-pointer"
        />
      </div>
      <Card className="w-full max-w-sm p-6 space-y-4">
        <h3 className="text-xl font-semibold text-center">Color Values</h3>
        <div className="space-y-2">
            <div className="flex justify-between items-center bg-muted p-2 rounded-md">
                <span className="font-mono text-sm">HEX</span>
                <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold">{color}</span>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(color)}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            {rgbColor && (
                 <div className="flex justify-between items-center bg-muted p-2 rounded-md">
                    <span className="font-mono text-sm">RGB</span>
                    <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold">{rgbColor}</span>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(rgbColor)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
            {hslColor && (
                 <div className="flex justify-between items-center bg-muted p-2 rounded-md">
                    <span className="font-mono text-sm">HSL</span>
                    <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold">{hslColor}</span>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(hslColor)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
      </Card>
    </div>
  );
}
