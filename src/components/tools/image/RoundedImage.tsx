'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function RoundedImage() {
  const [image, setImage] = useState<string | null>(null);
  const [radius, setRadius] = useState(50);
  const [roundedImage, setRoundedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgSrc = event.target?.result as string;
        setImage(imgSrc);
        applyRounding(imgSrc, radius);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleRadiusChange = (newRadius: number) => {
      setRadius(newRadius);
      if (image) {
          applyRounding(image, newRadius);
      }
  }

  const applyRounding = (imgSrc: string, currentRadius: number) => {
    if (!canvasRef.current) return;
    
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      canvas.width = img.width;
      canvas.height = img.height;
      
      const maxRadius = Math.min(img.width, img.height) / 2;
      const r = Math.min(currentRadius, maxRadius);
      
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(img.width - r, 0);
      ctx.quadraticCurveTo(img.width, 0, img.width, r);
      ctx.lineTo(img.width, img.height - r);
      ctx.quadraticCurveTo(img.width, img.height, img.width - r, img.height);
      ctx.lineTo(r, img.height);
      ctx.quadraticCurveTo(0, img.height, 0, img.height - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.clip();
      
      ctx.drawImage(img, 0, 0);
      setRoundedImage(canvas.toDataURL());
    };
  };
  
  const handleDownload = () => {
    if (!roundedImage) return;
    const link = document.createElement('a');
    link.download = 'rounded-image.png';
    link.href = roundedImage;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="w-full">
        <Label htmlFor="image-upload" className="block text-sm font-medium mb-2">Upload Image</Label>
        <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
      
      {image && (
        <>
          <div className="space-y-2">
            <Label htmlFor="radius">Corner Radius: {radius}px</Label>
            <Slider
              id="radius"
              min={0}
              max={200}
              step={1}
              value={[radius]}
              onValueChange={(val) => handleRadiusChange(val[0])}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="text-center space-y-2">
              <h4 className="font-semibold">Original</h4>
              <img src={image} alt="Original" className="max-w-full h-auto mx-auto rounded-md shadow-md" data-ai-hint="original image" />
            </div>
             <div className="text-center space-y-2">
              <h4 className="font-semibold">Rounded</h4>
              {roundedImage ? (
                <img src={roundedImage} alt="Rounded" className="max-w-full h-auto mx-auto rounded-md shadow-md" data-ai-hint="rounded image" />
              ) : (
                <div className="h-64 flex items-center justify-center bg-muted/50 rounded-md text-muted-foreground">
                    Result will appear here
                </div>
              )}
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />

          <div className="text-center">
             <Button onClick={handleDownload} disabled={!roundedImage}><Download className="mr-2"/> Download Rounded Image</Button>
          </div>
        </>
      )}
    </div>
  );
}
