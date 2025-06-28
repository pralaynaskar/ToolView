'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Camera, Video, VideoOff, Download } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function CameraApp() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    
    const { toast } = useToast();
    
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
    
    useEffect(() => {
        const getCameraPermission = async () => {
            if (!navigator.mediaDevices?.getUserMedia) {
                console.error('Camera API not supported in this browser.');
                setHasCameraPermission(false);
                toast({
                    variant: 'destructive',
                    title: 'Camera Not Supported',
                    description: 'Your browser does not support the camera API.',
                });
                return;
            }
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                streamRef.current = stream;
                setHasCameraPermission(true);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing camera:', error);
                setHasCameraPermission(false);
                toast({
                    variant: 'destructive',
                    title: 'Camera Access Denied',
                    description: 'Please enable camera and microphone permissions in your browser settings to use this app.',
                });
            }
        };

        getCameraPermission();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        }
    }, []);
    
    const handleStartRecording = () => {
        if (streamRef.current) {
            const stream = streamRef.current;
            try {
                mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
            } catch (e) {
                console.error("Error creating MediaRecorder:", e);
                toast({
                    variant: 'destructive',
                    title: 'Recording Error',
                    description: 'Could not start recording. Your browser might not support the selected format.',
                });
                return;
            }
            
            recordedChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };
            
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                setRecordedVideoUrl(url);
            };
            
            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordedVideoUrl(null);
            toast({ title: 'Recording started!' });
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            toast({ title: 'Recording stopped!', description: 'Your video is ready for download.' });
        }
    };
    
    const handleTakePhoto = () => {
        if (videoRef.current && videoRef.current.readyState >= 2) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/png');
            
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `photo-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast({ title: 'Photo saved!' });
        } else {
            toast({ variant: 'destructive', title: 'Camera not ready', description: 'Please wait for the video feed to start.' });
        }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Camera className="size-6" />
                    Camera App
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative aspect-video bg-black rounded-md overflow-hidden">
                    <video ref={videoRef} className="w-full h-full" autoPlay muted playsInline />
                     {hasCameraPermission === false && (
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                           <Alert variant="destructive" className="max-w-md">
                              <AlertTitle>Camera Access Required</AlertTitle>
                              <AlertDescription>
                                Please allow camera and microphone access to use this feature. Check your browser settings if you don't see a prompt.
                              </AlertDescription>
                            </Alert>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex gap-2">
                    <Button onClick={handleTakePhoto} disabled={!hasCameraPermission || isRecording}>
                        <Camera className="mr-2" />
                        Take Photo
                    </Button>
                    {isRecording ? (
                        <Button onClick={handleStopRecording} variant="destructive">
                            <VideoOff className="mr-2" />
                            Stop Recording
                        </Button>
                    ) : (
                        <Button onClick={handleStartRecording} disabled={!hasCameraPermission}>
                            <Video className="mr-2" />
                            Start Recording
                        </Button>
                    )}
                </div>
                {recordedVideoUrl && (
                    <Button asChild>
                        <a href={recordedVideoUrl} download={`recording-${Date.now()}.webm`}>
                            <Download className="mr-2" />
                            Download Video
                        </a>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
