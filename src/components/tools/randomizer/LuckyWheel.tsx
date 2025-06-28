'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const defaultColors = ['#FFC107', '#FF9800', '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39'];

export default function LuckyWheel() {
  const [segments, setSegments] = useState([
    { text: 'Prize 1' }, { text: 'Prize 2' }, { text: 'Prize 3' }, { text: 'Prize 4' }, { text: 'Try Again' }, { text: 'Bonus' }
  ]);
  const [newSegment, setNewSegment] = useState('');
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const numSegments = segments.length;
    if (numSegments === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    };

    const anglePerSegment = (2 * Math.PI) / numSegments;
    const radius = canvas.width / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    segments.forEach((segment, i) => {
      const angle = i * anglePerSegment;
      ctx.beginPath();
      ctx.fillStyle = defaultColors[i % defaultColors.length];
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius - 5, angle, angle + anglePerSegment);
      ctx.lineTo(radius, radius);
      ctx.fill();
      
      ctx.save();
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.translate(radius, radius);
      ctx.rotate(angle + anglePerSegment / 2);
      ctx.textAlign = 'right';
      const text = segment.text.length > 12 ? segment.text.substring(0, 10) + '...' : segment.text;
      ctx.fillText(text, radius - 15, 5);
      ctx.restore();
    });
  };

  useEffect(() => {
    drawWheel();
  }, [segments]);

  const handleAddSegment = () => {
    if (newSegment.trim() && segments.length < 14) {
      setSegments([...segments, { text: newSegment.trim() }]);
      setNewSegment('');
    }
  };

  const handleRemoveSegment = (index: number) => {
    if(segments.length > 2) {
      setSegments(segments.filter((_, i) => i !== index));
    }
  };

  const spin = () => {
    if (isSpinning || segments.length < 2) return;
    setIsSpinning(true);
    setWinner(null);
    const newRotation = rotation + 360 * 5 + Math.random() * 360;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const degrees = newRotation % 360;
      const arc = 360 / segments.length;
      // Adjust for the pointer being at the top (pointing down at 90 degrees)
      const winningIndex = Math.floor((360 - degrees + 270) % 360 / arc);
      setWinner(segments[winningIndex].text);
    }, 4000); // match transition duration
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 flex flex-col items-center justify-center space-y-4">
        <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
          <div 
            className="w-full h-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 4s ease-out' : 'none'
            }}
          >
            <canvas ref={canvasRef} width="400" height="400" className="w-full h-full" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-[16px] border-t-card transform -translate-y-[190px] md:-translate-y-[240px] rotate-180" />
        </div>
        <Button onClick={spin} disabled={isSpinning} size="lg">
          {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
        </Button>
        {winner && !isSpinning && <div className="text-2xl font-bold mt-4 p-4 bg-secondary rounded-lg">Winner: {winner}</div>}
      </div>

      <div className="space-y-4">
        <Card>
            <CardHeader><CardTitle>Customize Wheel</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="new-segment">New Option</Label>
                    <div className="flex gap-2">
                        <Input id="new-segment" value={newSegment} onChange={e => setNewSegment(e.target.value)} placeholder="e.g., Pizza Night" />
                        <Button onClick={handleAddSegment} disabled={segments.length >= 14}>Add</Button>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Options ({segments.length}/14)</Label>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {segments.map((s, i) => (
                            <div key={i} className="flex items-center justify-between bg-muted p-2 rounded-md">
                                <span>{s.text}</span>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveSegment(i)} disabled={segments.length <= 2}>
                                    <X className="w-4 h-4"/>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
