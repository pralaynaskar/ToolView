
"use client"

import React, { useState, useMemo, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from "date-fns"
import { Calendar as CalendarIcon, PartyPopper } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { calculateDaysUntil } from '@/lib/converters'
import { Skeleton } from '@/components/ui/skeleton'

export default function DaysUntilCalculator() {
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the initial render,
    // to prevent hydration errors.
    setTargetDate(new Date(new Date().getFullYear(), 11, 25)); // Default to Christmas
    setIsClient(true);
  }, []);


  const result = useMemo(() => {
    if (!isClient || !targetDate) return '';
    return calculateDaysUntil(targetDate);
  }, [targetDate, isClient]);

  const newYearsResult = useMemo(() => {
    if (!isClient) return ''; // Don't calculate on server
    const nextYear = new Date().getFullYear() + 1;
    const newYearsDate = new Date(nextYear, 0, 1);
    return calculateDaysUntil(newYearsDate);
  }, [isClient]);

  if (!isClient) {
    return (
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <Label>Calculate days until a custom date:</Label>
            <Skeleton className="h-10 w-full" />
          </div>
          <Card>
            <CardContent className="p-6 text-center">
                <Skeleton className="h-8 w-3/4 mx-auto" />
            </CardContent>
          </Card>
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Common Dates</span></div>
          </div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">Next New Year</CardTitle>
              <PartyPopper className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-2">
              <Skeleton className="h-8 w-3/4 mx-auto" />
            </CardContent>
          </Card>
        </div>
    )
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="space-y-2">
        <Label>Calculate days until a custom date:</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("w-full justify-start text-left font-normal", !targetDate && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {targetDate ? format(targetDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={targetDate} onSelect={setTargetDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>
      
      <Card>
        <CardContent className="p-6 text-center">
            <p className="text-2xl font-bold text-primary">{result}</p>
        </CardContent>
      </Card>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
                Common Dates
            </span>
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">Next New Year</CardTitle>
          <PartyPopper className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-2">
            <p className="text-center text-2xl font-bold text-primary">{newYearsResult}</p>
        </CardContent>
      </Card>
    </div>
  )
}
