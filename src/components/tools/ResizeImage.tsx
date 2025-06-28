'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download } from 'lucide-react';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';

export default function ResizeImage() {
  const [image, setImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          setImage(img.src);
          setOriginalSize({ width: img.width, height: img.height });
          setWidth(img.width);
          setHeight(img.height);
        };
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleResize = () => {
    if (!image || !canvasRef.current) return;
    
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      setResizedImage(canvas.toDataURL());
    };
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value, 10) || 0;
    setWidth(newWidth);
    if (keepAspectRatio && originalSize.width > 0) {
      const aspectRatio = originalSize.height / originalSize.width;
      setHeight(Math.round(newWidth * aspectRatio));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value, 10) || 0;
    setHeight(newHeight);
    if (keepAspectRatio && originalSize.height > 0) {
      const aspectRatio = originalSize.width / originalSize.height;
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };
  
  const handleDownload = () => {
    if (!resizedImage) return;
    const link = document.createElement('a');
    link.download = 'resized-image.png';
    link.href = resizedImage;
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width (px)</Label>
                <Input id="width" type="number" value={width} onChange={handleWidthChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (px)</Label>
                <Input id="height" type="number" value={height} onChange={handleHeightChange} />
              </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="aspect-ratio" checked={keepAspectRatio} onCheckedChange={setKeepAspectRatio} />
            <Label htmlFor="aspect-ratio">Keep aspect ratio</Label>
          </div>

          <Button onClick={handleResize}>Resize Image</Button>
          
          {resizedImage && (
            <div className="text-center space-y-4">
              <h4 className="font-semibold">Resized Image</h4>
              <img src={resizedImage} alt="Resized" className="max-w-full h-auto mx-auto rounded-md shadow-md" data-ai-hint="resized image" />
              <Button onClick={handleDownload}><Download className="mr-2"/> Download Resized Image</Button>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </>
      )}
    </div>
  );
}
