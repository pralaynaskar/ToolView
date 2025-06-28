
"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { calculateDate } from '@/lib/converters'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

type Operation = 'add' | 'subtract';
type Unit = 'days' | 'weeks' | 'months' | 'years';

export default function DateCalculator() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [value, setValue] = useState('10');
  const [unit, setUnit] = useState<Unit>('days');
  const [operation, setOperation] = useState<Operation>('add');

  const resultDate = useMemo(() => {
    if (!startDate) return null;
    return calculateDate(startDate, parseInt(value, 10), unit, operation);
  }, [startDate, value, unit, operation]);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="space-y-2">
        <Label>Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-end gap-2">
         <RadioGroup value={operation} onValueChange={(v) => setOperation(v as Operation)} className="flex space-x-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="add" id="add" />
              <Label htmlFor="add">Add</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="subtract" id="subtract" />
              <Label htmlFor="subtract">Subtract</Label>
            </div>
          </RadioGroup>
        <Input type="number" value={value} onChange={e => setValue(e.target.value)} className="w-24" />
        <Select value={unit} onValueChange={v => setUnit(v as Unit)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="days">Days</SelectItem>
            <SelectItem value="weeks">Weeks</SelectItem>
            <SelectItem value="months">Months</SelectItem>
            <SelectItem value="years">Years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-lg text-muted-foreground">Resulting Date</p>
          <p className="text-3xl font-bold text-primary">
            {resultDate ? format(resultDate, 'PPP') : 'Invalid Date'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
