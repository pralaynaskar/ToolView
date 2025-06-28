'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, FastForward, Rewind, PictureInPicture2, Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        setVideoUrl(url);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
    } else if (file) {
        toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please upload a video file.' });
    }
  };

  const hideControls = useCallback(() => {
    if (isPlaying) {
      setShowControls(false);
    }
  }, [isPlaying]);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(hideControls, 3000);
  }, [hideControls]);
  
  const togglePlayPause = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(e => toast({ variant: 'destructive', title: 'Playback error'}));
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [toast]);
  
  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedData = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };
  
  const handleSeek = (value: number[]) => {
    if (videoRef.current) videoRef.current.currentTime = value[0];
  };

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) videoRef.current.volume = value[0];
    setVolume(value[0]);
  };
  
  const toggleFullScreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const togglePip = async () => {
    if (!videoRef.current) return;
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else if (document.pictureInPictureEnabled) {
      await videoRef.current.requestPictureInPicture();
    }
  }
  
  const handlePlaybackRateChange = (rate: number) => {
    if (videoRef.current) {
        videoRef.current.playbackRate = rate;
        setPlaybackRate(rate);
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00:00";
    return new Date(time * 1000).toISOString().slice(11, 19);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || !videoUrl) return;
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'KeyF':
          toggleFullScreen();
          break;
        case 'KeyM':
          if (videoRef.current) {
            handleVolumeChange([videoRef.current.volume > 0 ? 0 : 1]);
          }
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [togglePlayPause, toggleFullScreen, videoUrl]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto aspect-video bg-black flex items-center justify-center overflow-hidden group rounded-lg shadow-xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {videoUrl ? (
        <>
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            onClick={togglePlayPause}
            onTimeUpdate={handleTimeUpdate}
            onLoadedData={handleLoadedData}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            key={videoUrl}
          />
          <div className={cn(
            'absolute inset-0 transition-opacity duration-300',
            showControls ? 'opacity-100' : 'opacity-0'
          )}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 text-white">
              <Slider value={[currentTime]} max={duration || 1} onValueChange={handleSeek} />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button size="icon" variant="ghost" onClick={togglePlayPause}>
                    {isPlaying ? <Pause /> : <Play />}
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)}><Rewind /></Button>
                    <Button variant="ghost" size="icon" onClick={() => videoRef.current && (videoRef.current.currentTime += 10)}><FastForward /></Button>
                  </div>
                  <div className="flex items-center gap-2">
                      <Button size="icon" variant="ghost" onClick={() => handleVolumeChange([volume > 0 ? 0 : 1])}>
                          {volume > 0 ? <Volume2/> : <VolumeX />}
                      </Button>
                      <Slider value={[volume]} max={1} step={0.1} onValueChange={handleVolumeChange} className="w-24" />
                  </div>
                  <span className="font-mono text-sm">{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[0.5, 1, 1.5, 2].map(rate => (
                      <Button key={rate} size="sm" variant={playbackRate === rate ? 'secondary' : 'ghost'} onClick={() => handlePlaybackRateChange(rate)}>
                        {rate}x
                      </Button>
                    ))}
                  </div>
                  {document.pictureInPictureEnabled && (
                    <Button size="icon" variant="ghost" onClick={togglePip}><PictureInPicture2 /></Button>
                  )}
                  <Button size="icon" variant="ghost" onClick={toggleFullScreen}>
                    {isFullScreen ? <Minimize /> : <Maximize />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-card-foreground p-8 bg-secondary/50 w-full h-full flex flex-col items-center justify-center">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden"/>
            <Upload className="w-16 h-16 text-muted-foreground mb-4"/>
            <h3 className="text-xl font-semibold">Upload a Video</h3>
            <p className="text-muted-foreground mb-4">Click the button to select a local video file to play.</p>
            <Button onClick={() => fileInputRef.current?.click()}>
                Select Video File
            </Button>
        </div>
      )}
    </div>
  );
}
