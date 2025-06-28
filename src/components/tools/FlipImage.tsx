'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FlipHorizontal, FlipVertical, Upload, Download } from 'lucide-react';
import { Label } from '../ui/label';

export default function FlipImage() {
  const [image, setImage] = useState<string | null>(null);
  const [flippedImage, setFlippedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setFlippedImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const flip = (direction: 'horizontal' | 'vertical') => {
    if (!image || !canvasRef.current) return;
    
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (direction === 'horizontal') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      } else {
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
      }
      
      ctx.drawImage(img, 0, 0);
      setFlippedImage(canvas.toDataURL());

      // Reset transform for next operation
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    };
  };
  
  const handleDownload = () => {
    if (!flippedImage) return;
    const link = document.createElement('a');
    link.download = 'flipped-image.png';
    link.href = flippedImage;
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
          <div className="flex justify-center gap-4">
            <Button onClick={() => flip('horizontal')}><FlipHorizontal className="mr-2"/> Flip Horizontal</Button>
            <Button onClick={() => flip('vertical')}><FlipVertical className="mr-2"/> Flip Vertical</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="text-center space-y-2">
              <h4 className="font-semibold">Original</h4>
              <img src={image} alt="Original" className="max-w-full h-auto mx-auto rounded-md shadow-md" data-ai-hint="original image" />
            </div>
             <div className="text-center space-y-2">
              <h4 className="font-semibold">Flipped</h4>
              <img src={flippedImage || ''} alt="Flipped" className="max-w-full h-auto mx-auto rounded-md shadow-md" data-ai-hint="flipped image" />
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />

          <div className="text-center">
             <Button onClick={handleDownload} disabled={!flippedImage}><Download className="mr-2"/> Download Flipped Image</Button>
          </div>
        </>
      )}
    </div>
  );
}
