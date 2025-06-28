'use client';
import React, { useState, useEffect } from 'react';
import { Compass as CompassIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Compass() {
  const [heading, setHeading] = useState<number | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      let currentHeading = 0;
      if (event.webkitCompassHeading) { // iOS
        currentHeading = event.webkitCompassHeading;
      } else if (event.alpha !== null) { // Android
        currentHeading = 360 - event.alpha;
      }
      setHeading(currentHeading);
    };
    
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    } else {
      setIsSupported(false);
    }
    
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 text-muted-foreground">
        <CompassIcon className="w-16 h-16" />
        <h3 className="text-lg font-semibold">Compass Not Supported</h3>
        <p>Your browser or device does not support this feature.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-4">
      <Alert>
        <AlertTitle>Device Motion Required</AlertTitle>
        <AlertDescription>
          For this feature to work, you may need to grant this site permission to access your device's motion sensors. This usually appears as a prompt from your browser.
        </AlertDescription>
      </Alert>

      <div className="relative w-64 h-64">
        {/* Compass background */}
        <div className="w-full h-full rounded-full bg-secondary border-4 border-card flex items-center justify-center shadow-inner">
            <span className="absolute top-2 text-2xl font-bold text-primary">N</span>
            <span className="absolute bottom-2 text-2xl font-bold">S</span>
            <span className="absolute left-2 text-2xl font-bold">W</span>
            <span className="absolute right-2 text-2xl font-bold">E</span>
            {/* intermediate markings */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-4 bg-muted-foreground"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-4 bg-muted-foreground"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-px w-4 bg-muted-foreground"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-px w-4 bg-muted-foreground"></div>
        </div>
        {/* Needle */}
        <div
          className="absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-out"
          style={{ transform: `rotate(${-heading || 0}deg)` }}
        >
          <div className="absolute top-1/2 left-1/2 w-0 h-0 border-l-8 border-r-8 border-b-[6rem] border-l-transparent border-r-transparent border-b-red-500 transform -translate-x-1/2 -translate-y-full" style={{borderBottomWidth: '5rem'}}></div>
          <div className="absolute top-1/2 left-1/2 w-0 h-0 border-l-8 border-r-8 border-t-[6rem] border-l-transparent border-r-transparent border-t-muted-foreground transform -translate-x-1/2 translate-y-0" style={{borderTopWidth: '5rem'}}></div>
        </div>
        {/* Center pivot */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-background" />
      </div>
      <div className="text-2xl font-bold text-primary">
        {heading !== null ? `${Math.round(heading)}°` : 'Calibrating...'}
      </div>
    </div>
  );
}
