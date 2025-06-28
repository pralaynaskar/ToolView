'use client';

import React, { useState, useRef, MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pipette, Upload, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

export default function ImageColorPicker() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [pickedColor, setPickedColor] = useState<{ hex: string; rgb: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (ctx) {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
            }
          }
        };
        setImageSrc(event.target?.result as string);
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCanvasClick = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const rgb = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
      const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
      setPickedColor({ hex, rgb });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `Copied "${text}" to clipboard!` });
  };

  return (
    <div className="space-y-6">
      <div className="w-full">
        <Label htmlFor="image-upload" className="block text-sm font-medium mb-2">Upload Image</Label>
        <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="relative border rounded-lg overflow-hidden cursor-crosshair">
          {imageSrc ? (
            <canvas ref={canvasRef} onClick={handleCanvasClick} className="w-full h-auto" />
          ) : (
            <div className="flex flex-col items-center justify-center h-80 bg-muted/50 text-muted-foreground">
              <Upload className="w-12 h-12 mb-4" />
              <p>Upload an image to start</p>
            </div>
          )}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pipette className="w-5 h-5"/>
              Picked Color
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pickedColor ? (
              <>
                <div className="w-full h-24 rounded-md border" style={{ backgroundColor: pickedColor.hex }} />
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-muted p-2 rounded-md">
                      <span className="font-mono text-sm">HEX</span>
                      <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold">{pickedColor.hex}</span>
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(pickedColor.hex)}>
                              <Copy className="h-4 w-4" />
                          </Button>
                      </div>
                  </div>
                  <div className="flex justify-between items-center bg-muted p-2 rounded-md">
                      <span className="font-mono text-sm">RGB</span>
                      <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold">{pickedColor.rgb}</span>
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(pickedColor.rgb)}>
                              <Copy className="h-4 w-4" />
                          </Button>
                      </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-10">Click on the image to pick a color.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
