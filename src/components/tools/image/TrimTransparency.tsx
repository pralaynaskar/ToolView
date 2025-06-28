'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Scissors, Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';

export default function TrimTransparency() {
  const [image, setImage] = useState<string | null>(null);
  const [trimmedImage, setTrimmedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setTrimmedImage(null);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const trim = () => {
    if (!image || !canvasRef.current || !resultCanvasRef.current) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let minX = canvas.width, minY = canvas.height, maxX = -1, maxY = -1;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const alpha = data[(y * canvas.width + x) * 4 + 3];
          if (alpha > 0) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }

      if (maxX === -1) { // Fully transparent image
          setTrimmedImage(null);
          return;
      }

      const trimmedWidth = maxX - minX + 1;
      const trimmedHeight = maxY - minY + 1;
      
      const resultCanvas = resultCanvasRef.current!;
      resultCanvas.width = trimmedWidth;
      resultCanvas.height = trimmedHeight;
      const resultCtx = resultCanvas.getContext('2d')!;

      resultCtx.drawImage(
        canvas,
        minX, minY, trimmedWidth, trimmedHeight,
        0, 0, trimmedWidth, trimmedHeight
      );

      setTrimmedImage(resultCanvas.toDataURL());
    };
  };

  const handleDownload = () => {
    if (!trimmedImage) return;
    const link = document.createElement('a');
    link.download = 'trimmed-image.png';
    link.href = trimmedImage;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="w-full">
        <Label htmlFor="image-upload" className="block text-sm font-medium mb-2">Upload Image (PNG with transparency)</Label>
        <Input id="image-upload" type="file" accept="image/png" onChange={handleImageUpload} />
      </div>
      
      {image && (
        <>
          <Button onClick={trim}><Scissors className="mr-2"/> Trim Transparency</Button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="text-center space-y-2">
              <h4 className="font-semibold">Original</h4>
              <img src={image} alt="Original" className="max-w-full h-auto mx-auto bg-slate-200 dark:bg-slate-700 p-2 rounded-md shadow-md" data-ai-hint="original image" />
            </div>
            <div className="text-center space-y-2">
              <h4 className="font-semibold">Trimmed</h4>
              {trimmedImage ? (
                <img src={trimmedImage} alt="Trimmed" className="max-w-full h-auto mx-auto rounded-md shadow-md" data-ai-hint="trimmed image" />
              ) : (
                <div className="h-64 flex items-center justify-center bg-muted/50 rounded-md text-muted-foreground">
                    Result will appear here
                </div>
              )}
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />
          <canvas ref={resultCanvasRef} className="hidden" />

          {trimmedImage && (
            <div className="text-center">
             <Button onClick={handleDownload}><Download className="mr-2"/> Download Trimmed Image</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
