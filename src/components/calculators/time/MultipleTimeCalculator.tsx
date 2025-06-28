
"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { sumDurations } from '@/lib/converters'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

type Duration = { id: number; hours: string; minutes: string; seconds: string };

export default function MultipleTimeCalculator() {
  const [durations, setDurations] = useState<Duration[]>([
    { id: 1, hours: '1', minutes: '30', seconds: '0' },
    { id: 2, hours: '2', minutes: '45', seconds: '15' },
  ]);

  const handleAddDuration = () => {
    setDurations([...durations, { id: Date.now(), hours: '', minutes: '', seconds: '' }]);
  };

  const handleRemoveDuration = (id: number) => {
    setDurations(durations.filter(d => d.id !== id));
  };
  
  const handleDurationChange = (id: number, field: 'hours' | 'minutes' | 'seconds', value: string) => {
    setDurations(durations.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const totalTime = useMemo(() => {
    const parsedDurations = durations.map(d => ({
        hours: parseInt(d.hours) || 0,
        minutes: parseInt(d.minutes) || 0,
        seconds: parseInt(d.seconds) || 0,
    }));
    return sumDurations(parsedDurations);
  }, [durations]);


  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="space-y-4">
        {durations.map((duration, index) => (
          <div key={duration.id} className="flex items-end gap-2">
            <div className="grid grid-cols-3 gap-2 flex-grow">
                <div className="space-y-1">
                    {index === 0 && <Label>Hours</Label>}
                    <Input type="number" value={duration.hours} onChange={e => handleDurationChange(duration.id, 'hours', e.target.value)} />
                </div>
                <div className="space-y-1">
                    {index === 0 && <Label>Minutes</Label>}
                    <Input type="number" value={duration.minutes} onChange={e => handleDurationChange(duration.id, 'minutes', e.target.value)} />
                </div>
                <div className="space-y-1">
                    {index === 0 && <Label>Seconds</Label>}
                    <Input type="number" value={duration.seconds} onChange={e => handleDurationChange(duration.id, 'seconds', e.target.value)} />
                </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleRemoveDuration(duration.id)} disabled={durations.length <= 1}>
                <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      <Button onClick={handleAddDuration} variant="outline" className="w-full">
        <Plus className="mr-2" /> Add Duration
      </Button>

      <Card>
        <CardHeader>
            <CardTitle>Total Time</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
            <p className="text-3xl font-bold text-primary">{totalTime.h}h {totalTime.m}m {totalTime.s}s</p>
        </CardContent>
      </Card>
    </div>
  )
}
