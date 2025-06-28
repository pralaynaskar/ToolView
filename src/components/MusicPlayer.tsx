
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, Repeat1, ListMusic, Upload
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const defaultPlaylist = [
  {
    title: 'Lofi Chill',
    artist: 'Chosic',
    src: 'https://www.chosic.com/wp-content/uploads/2022/01/Lofi-Chill-medium-version.mp3',
    artwork: 'https://placehold.co/400x400.png',
  },
  {
    title: 'Morning Garden',
    artist: 'Chosic',
    src: 'https://www.chosic.com/wp-content/uploads/2024/01/Morning-Garden-chosic.com_.mp3',
    artwork: 'https://placehold.co/400x400.png',
  },
  {
    title: 'Happy Upbeat',
    artist: 'Crush',
    src: 'https://www.chosic.com/wp-content/uploads/2021/04/And-So-It-Begins-Inspired-By-Crush-Creative-Commons.mp3',
    artwork: 'https://placehold.co/400x400.png',
  },
];

type Track = {
  title: string;
  artist: string;
  src: string;
  artwork: string;
}

type RepeatMode = 'off' | 'one' | 'all';

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [playlist, setPlaylist] = useState<Track[]>(defaultPlaylist);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledPlaylist, setShuffledPlaylist] = useState<number[]>([]);
  const [isPlaylistVisible, setIsPlaylistVisible] = useState(false);
  const { toast } = useToast();

  const currentTrack = playlist[isShuffled ? shuffledPlaylist[currentTrackIndex] : currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    // Generate shuffled playlist when shuffle is turned on or playlist changes
    if (isShuffled) {
      const indices = Array.from(playlist.keys());
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      setShuffledPlaylist(indices);
    }
  }, [isShuffled, playlist]);

  const handlePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => toast({ variant: 'destructive', title: 'Playback error', description: `${e}` }));
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('audio/')) {
        if (file) toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please upload an audio file.' });
        return;
    }

    const trackUrl = URL.createObjectURL(file);

    const newTrack: Track = {
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: 'Local File',
        src: trackUrl,
        artwork: 'https://placehold.co/400x400.png',
    };

    setPlaylist(prev => {
        const newPlaylist = [...prev, newTrack];
        setCurrentTrackIndex(newPlaylist.length - 1);
        return newPlaylist;
    });
    setIsPlaying(true);
    toast({ title: 'Song Added!', description: `${newTrack.title} has been added to the playlist.` });
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value[0];
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const playNext = useCallback(() => {
    setCurrentTrackIndex(prev => (prev + 1) % playlist.length);
  }, [playlist.length]);

  const playPrev = useCallback(() => {
    setCurrentTrackIndex(prev => (prev - 1 + playlist.length) % playlist.length);
  }, [playlist.length]);

  const handleEnded = useCallback(() => {
    if (repeatMode === 'one') {
      audioRef.current?.play();
    } else if (repeatMode === 'all' || currentTrackIndex < playlist.length - 1) {
      playNext();
    } else {
      setIsPlaying(false);
    }
  }, [repeatMode, playNext, currentTrackIndex, playlist.length]);

  const toggleRepeat = () => {
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const nextIndex = (modes.indexOf(repeatMode) + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };
  
  const toggleMute = () => setIsMuted(m => !m);
  
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => {
        setIsPlaying(false);
        toast({ variant: 'destructive', title: 'Playback error', description: `Could not play track. ${e}` });
      });
    }
  }, [currentTrack, isPlaying, toast]);

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl overflow-hidden bg-card/80 backdrop-blur-sm">
        <CardHeader className="p-0">
          <div className="relative aspect-square">
            {currentTrack ? (
                <Image
                  src={currentTrack.artwork}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                />
            ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <p className="text-muted-foreground">No song selected</p>
                </div>
            )}
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
             {currentTrack && (
                <div className="absolute bottom-4 left-6 text-white">
                    <h2 className="text-2xl font-bold">{currentTrack.title}</h2>
                    <p className="text-sm opacity-80">{currentTrack.artist}</p>
                </div>
             )}
          </div>
        </CardHeader>
      <CardContent className="p-6 space-y-4">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          onValueChange={handleSeek}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-center gap-4">
            <Button variant="ghost" size="icon" onClick={playPrev} className="text-muted-foreground" disabled={!currentTrack}>
                <SkipBack className="size-5" />
            </Button>
            <Button size="lg" className="rounded-full w-16 h-16" onClick={handlePlayPause} disabled={!currentTrack}>
                {isPlaying ? <Pause className="size-8" /> : <Play className="size-8" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={playNext} className="text-muted-foreground" disabled={!currentTrack}>
                <SkipForward className="size-5" />
            </Button>
        </div>
        
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted ? <VolumeX /> : <Volume2 />}
            </Button>
            <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={(v) => { setVolume(v[0]); setIsMuted(false); }}
                className="flex-1"
            />
            <Button variant="ghost" size="icon" className={cn(isShuffled && 'text-primary')} onClick={() => setIsShuffled(s => !s)}>
                <Shuffle />
            </Button>
             <Button variant="ghost" size="icon" className={cn(repeatMode !== 'off' && 'text-primary')} onClick={toggleRepeat}>
                {repeatMode === 'one' ? <Repeat1 /> : <Repeat />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsPlaylistVisible(p => !p)}><ListMusic /></Button>
        </div>
        
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*" className="hidden" />
        <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2" /> Upload Song
        </Button>

        {isPlaylistVisible && (
          <div className="border-t pt-4 mt-4 max-h-48 overflow-y-auto">
            <h3 className="font-semibold mb-2">Playlist</h3>
            <ul className="space-y-2">
              {playlist.map((track, index) => (
                <li
                  key={index}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-secondary",
                    (isShuffled ? shuffledPlaylist[currentTrackIndex] : currentTrackIndex) === index && "bg-secondary"
                  )}
                  onClick={() => {
                    setCurrentTrackIndex(isShuffled ? shuffledPlaylist.indexOf(index) : index);
                    setIsPlaying(true);
                  }}
                >
                  <Avatar>
                    <AvatarImage src={track.artwork} alt={track.title} />
                    <AvatarFallback>{track.title[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{track.title}</p>
                    <p className="text-xs text-muted-foreground">{track.artist}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onError={(e) => toast({ variant: 'destructive', title: "Audio Error", description: "Could not load track."})}
          key={currentTrack.src} // Force re-render when src changes
        />
      )}
    </Card>
  );
}
