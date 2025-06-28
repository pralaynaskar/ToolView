
"use client"

import React, { useState, useEffect } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Gift } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { HistoryEntry } from "@/types"
import { calculateAge } from "@/lib/converters"

type AgeResultType = {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  nextBirthday: {
    months: number;
    days: number;
  };
};

export default function AgeConverter() {
  const [birthDate, setBirthDate] = useState<Date | undefined>(new Date(2000, 0, 1))
  const [ageResult, setAgeResult] = useState<AgeResultType | null>(null)
  const [, setHistory] = useLocalStorage<HistoryEntry[]>("calc-history", [])

  // Effect for live calculation, runs every second
  useEffect(() => {
    if (birthDate) {
      // Initial calculation
      setAgeResult(calculateAge(birthDate, new Date()));
      
      const timer = setInterval(() => {
        setAgeResult(calculateAge(birthDate, new Date()));
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setAgeResult(null);
    }
  }, [birthDate]);

  // Effect for history, runs only when birthDate changes
  useEffect(() => {
    if (birthDate) {
      // Use a static date for the history entry to avoid constant updates
      const resultForHistory = calculateAge(birthDate, new Date());
      const newEntry: HistoryEntry = {
        id: new Date().toISOString(),
        type: 'Age Calculator',
        calculation: `Age from ${format(birthDate, "PPP")}: ${resultForHistory.years}y ${resultForHistory.months}m ${resultForHistory.days}d`,
        timestamp: new Date().toISOString(),
      }
      setHistory(prev => [newEntry, ...prev.slice(0, 49)]);
    }
  }, [birthDate, setHistory]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Your Date of Birth</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !birthDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {birthDate ? format(birthDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={birthDate}
              onSelect={setBirthDate}
              initialFocus
              captionLayout="dropdown-buttons"
              fromYear={1900}
              toYear={new Date().getFullYear()}
            />
          </PopoverContent>
        </Popover>
      </div>

      {ageResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl text-primary">Your Age</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center">
                        <span className="text-5xl font-bold text-primary">{ageResult.years}</span>
                        <span className="text-2xl text-muted-foreground"> years</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-semibold">{ageResult.months}</p>
                            <p className="text-sm text-muted-foreground">Months</p>
                        </div>
                        <div>
                            <p className="text-2xl font-semibold">{ageResult.days}</p>
                            <p className="text-sm text-muted-foreground">Days</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-primary">
                        <Gift className="size-5" />
                        Next Birthday
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-center pt-5">
                        <div>
                            <p className="text-5xl font-bold text-primary">{ageResult.nextBirthday.months}</p>
                            <p className="text-sm text-muted-foreground mt-1">Months</p>
                        </div>
                        <div>
                            <p className="text-5xl font-bold text-primary">{ageResult.nextBirthday.days}</p>
                            <p className="text-sm text-muted-foreground mt-1">Days</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl text-primary">Total Time Lived</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold">{ageResult.totalDays.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Days</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{ageResult.totalHours.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Hours</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{ageResult.totalMinutes.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Minutes</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{ageResult.totalSeconds.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Seconds</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      )}
    </div>
  )
}
