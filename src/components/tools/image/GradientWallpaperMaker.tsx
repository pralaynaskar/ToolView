'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, RefreshCw, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type GradientType = 'linear' | 'radial';

export default function GradientWallpaperMaker() {
  const [colors, setColors] = useState(['#3F51B5', '#7E57C2']);
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState(90);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const handleColorChange = (index: number, newColor: string) => {
    const newColors = [...colors];
    newColors[index] = newColor;
    setColors(newColors);
  };
  
  const addColor = () => {
    if (colors.length < 8) {
      setColors([...colors, '#E8EAF6']);
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const drawGradient = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = width;
    canvas.height = height;

    let gradient;
    if (gradientType === 'linear') {
      const radians = (angle * Math.PI) / 180;
      const x1 = Math.round(width / 2 + (width / 2) * Math.cos(radians + Math.PI));
      const y1 = Math.round(height / 2 + (height / 2) * Math.sin(radians + Math.PI));
      const x2 = Math.round(width / 2 + (width / 2) * Math.cos(radians));
      const y2 = Math.round(height / 2 + (height / 2) * Math.sin(radians));
      gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    } else {
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.sqrt(width * width + height * height) / 2;
      gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    }

    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  };

  useEffect(drawGradient, [colors, gradientType, angle, width, height]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'gradient-wallpaper.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-4">
        <div className="space-y-2">
            <Label>Colors</Label>
            {colors.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                    <Input type="color" value={color} onChange={e => handleColorChange(index, e.target.value)} className="w-12 h-10 p-1"/>
                    <Input value={color} onChange={e => handleColorChange(index, e.target.value)} className="font-mono"/>
                    {colors.length > 2 && <Button variant="ghost" size="icon" onClick={() => removeColor(index)}><X className="size-4"/></Button>}
                </div>
            ))}
            {colors.length < 8 && <Button onClick={addColor} variant="outline" className="w-full">Add Color</Button>}
        </div>
        <div className="space-y-2">
            <Label>Gradient Type</Label>
            <Select value={gradientType} onValueChange={(v) => setGradientType(v as GradientType)}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="radial">Radial</SelectItem>
                </SelectContent>
            </Select>
        </div>
        {gradientType === 'linear' && (
            <div className="space-y-2">
                <Label>Angle ({angle}°)</Label>
                <Input type="range" min="0" max="360" value={angle} onChange={e => setAngle(Number(e.target.value))} />
            </div>
        )}
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Width (px)</Label>
                <Input type="number" value={width} onChange={e => setWidth(Number(e.target.value) || 1920)} />
            </div>
             <div className="space-y-2">
                <Label>Height (px)</Label>
                <Input type="number" value={height} onChange={e => setHeight(Number(e.target.value) || 1080)} />
            </div>
        </div>
        <div className="flex gap-2">
            <Button onClick={drawGradient} className="w-full"><RefreshCw className="mr-2"/> Redraw</Button>
            <Button onClick={handleDownload} className="w-full"><Download className="mr-2"/> Download</Button>
        </div>
      </div>
      <div className="md:col-span-2">
        <canvas ref={canvasRef} className="w-full h-auto border rounded-lg shadow-md aspect-video" />
      </div>
    </div>
  );
}
