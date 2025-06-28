
'use client';

import React, { useState, useMemo, useEffect, useCallback, ChangeEvent } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Upload, Trash2, Pencil, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, add, sub, parseISO, isSameDay, set, getHours, getMinutes } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Event = {
  id: string;
  title: string;
  start: string; // ISO string
  end: string;   // ISO string
  allDay: boolean;
  description?: string;
};

type View = 'month' | 'week' | 'day';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  allDay: z.boolean(),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid start date" }),
  startTime: z.string(),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid end date" }),
  endTime: z.string(),
  description: z.string().optional(),
}).refine(data => {
    try {
        const start = set(new Date(data.startDate), { hours: parseInt(data.startTime.split(':')[0]), minutes: parseInt(data.startTime.split(':')[1]) });
        const end = set(new Date(data.endDate), { hours: parseInt(data.endTime.split(':')[0]), minutes: parseInt(data.endTime.split(':')[1]) });
        return end >= start;
    } catch {
        return false;
    }
}, {
    message: 'End date and time must be after start date and time.',
    path: ['endDate'],
});

export default function CalendarApp() {
    const [view, setView] = useState<View>('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useLocalStorage<Event[]>('calendar-events-v2', []);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [importDialogOpen, setImportDialogOpen] = useState(false);

    const { toast } = useToast();

    const form = useForm<z.infer<typeof eventSchema>>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            title: '',
            allDay: false,
            startDate: format(new Date(), 'yyyy-MM-dd'),
            startTime: '09:00',
            endDate: format(new Date(), 'yyyy-MM-dd'),
            endTime: '10:00',
            description: ''
        },
    });

    useEffect(() => {
        if (selectedEvent) {
            form.reset({
                title: selectedEvent.title,
                allDay: selectedEvent.allDay,
                startDate: format(parseISO(selectedEvent.start), 'yyyy-MM-dd'),
                startTime: format(parseISO(selectedEvent.start), 'HH:mm'),
                endDate: format(parseISO(selectedEvent.end), 'yyyy-MM-dd'),
                endTime: format(parseISO(selectedEvent.end), 'HH:mm'),
                description: selectedEvent.description,
            });
        } else {
            const now = new Date();
            const nextHour = add(now, { hours: 1 });
            form.reset({
                title: '',
                allDay: false,
                startDate: format(now, 'yyyy-MM-dd'),
                startTime: format(now, 'HH:mm'),
                endDate: format(nextHour, 'yyyy-MM-dd'),
                endTime: format(nextHour, 'HH:mm'),
                description: '',
            });
        }
    }, [dialogOpen, selectedEvent, form]);


    const handleDateSelect = (date: Date) => {
        const now = new Date();
        const nextHour = add(now, { hours: 1 });
        form.reset({
            title: '',
            allDay: false,
            startDate: format(date, 'yyyy-MM-dd'),
            startTime: format(now, 'HH:mm'),
            endDate: format(date, 'yyyy-MM-dd'),
            endTime: format(nextHour, 'HH:mm'),
            description: '',
        });
        setSelectedEvent(null);
        setDialogOpen(true);
    };
    
    const handleEventSelect = (event: Event) => {
        setSelectedEvent(event);
        setDialogOpen(true);
    };

    const onSubmit = (values: z.infer<typeof eventSchema>) => {
        const start = set(new Date(values.startDate), { hours: parseInt(values.startTime.split(':')[0]), minutes: parseInt(values.startTime.split(':')[1]), seconds: 0, milliseconds: 0 });
        const end = set(new Date(values.endDate), { hours: parseInt(values.endTime.split(':')[0]), minutes: parseInt(values.endTime.split(':')[1]), seconds: 0, milliseconds: 0 });

        const newEvent: Omit<Event, 'id'> = {
            title: values.title,
            description: values.description,
            start: start.toISOString(),
            end: end.toISOString(),
            allDay: values.allDay,
        };

        if (selectedEvent) {
            setEvents(events.map(ev => ev.id === selectedEvent.id ? { ...ev, ...newEvent } : ev));
            toast({ title: 'Event Updated' });
        } else {
            setEvents([...events, { ...newEvent, id: Date.now().toString() }]);
            toast({ title: 'Event Created' });
        }
        setDialogOpen(false);
        setSelectedEvent(null);
    };

    const handleDelete = () => {
        if(selectedEvent) {
            setEvents(events.filter(ev => ev.id !== selectedEvent.id));
            toast({ title: 'Event Deleted', variant: 'destructive'});
            setDialogOpen(false);
            setSelectedEvent(null);
        }
    }

    const handleIcsImport = (importedEvents: Event[]) => {
        const existingIds = new Set(events.map(e => e.id));
        const newEvents = importedEvents.filter(e => !existingIds.has(e.id));
        setEvents(prev => [...prev, ...newEvents]);
        toast({ title: 'Import Successful', description: `Added ${newEvents.length} new events.` });
        setImportDialogOpen(false);
    };
    
    const renderView = () => {
        switch (view) {
            case 'month':
                return <MonthView currentDate={currentDate} events={events} onDateSelect={handleDateSelect} onEventSelect={handleEventSelect} />;
            case 'week':
                return <WeekView currentDate={currentDate} events={events} onEventSelect={handleEventSelect} />;
            case 'day':
                return <DayView currentDate={currentDate} events={events} onEventSelect={handleEventSelect} />;
            default:
                return null;
        }
    }

    return (
        <div className="flex flex-col h-[85vh]">
             {/* Toolbar */}
             <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" onClick={() => setCurrentDate(d => sub(d, { [view]: 1 }))}><ChevronLeft/></Button>
                        <Button variant="outline" onClick={() => setCurrentDate(new Date())}>Today</Button>
                        <Button variant="outline" size="icon" onClick={() => setCurrentDate(d => add(d, { [view]: 1 }))}><ChevronRight/></Button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setSelectedEvent(null)}><Plus className="mr-2"/> Add Event</Button>
                        </DialogTrigger>
                        <EventDialog form={form} onSubmit={onSubmit} selectedEvent={selectedEvent} handleDelete={handleDelete} />
                    </Dialog>
                    <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                        <DialogTrigger asChild><Button variant="outline"><Upload className="mr-2"/> Import</Button></DialogTrigger>
                        <IcsImportDialog onImport={handleIcsImport} onClose={() => setImportDialogOpen(false)} />
                    </Dialog>
                    <Tabs value={view} onValueChange={(v) => setView(v as View)} className="w-[250px]">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="month">Month</TabsTrigger>
                            <TabsTrigger value="week">Week</TabsTrigger>
                            <TabsTrigger value="day">Day</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>
            {/* Calendar View */}
            <div className="flex-1 overflow-auto">
              {renderView()}
            </div>
        </div>
    );
}

// #region Views
const MonthView = ({ currentDate, events, onDateSelect, onEventSelect }: { currentDate: Date, events: Event[], onDateSelect: (date: Date) => void, onEventSelect: (event: Event) => void }) => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="grid grid-cols-7 grid-rows-[auto_1fr] h-full">
            {daysOfWeek.map(day => (
                <div key={day} className="text-center font-semibold p-2 border-b">{day}</div>
            ))}
            <div className="col-span-7 grid grid-cols-7 grid-rows-5 h-full">
                {days.map((day) => {
                    const dayEvents = events.filter(e => isSameDay(parseISO(e.start), day)).sort((a,b) => getHours(parseISO(a.start)) - getHours(parseISO(b.start)));
                    return (
                        <div key={day.toString()} className={cn("border-r border-b p-1 relative flex flex-col", !isSameMonth(day, currentDate) && "bg-muted/50")}>
                            <button onClick={() => onDateSelect(day)} className={cn("self-end rounded-full h-8 w-8 flex items-center justify-center hover:bg-secondary", isToday(day) && "bg-primary text-primary-foreground")}>
                                {format(day, 'd')}
                            </button>
                            <ScrollArea className="flex-1">
                               <div className="space-y-1 pr-1">
                                {dayEvents.map(event => (
                                    <button key={event.id} onClick={() => onEventSelect(event)} className="w-full text-left text-xs bg-primary/20 p-1 rounded truncate">
                                        {!event.allDay && <span className="font-bold">{format(parseISO(event.start), 'HH:mm')}</span>} {event.title}
                                    </button>
                                ))}
                               </div>
                            </ScrollArea>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const WeekView = ({ currentDate, events, onEventSelect }: { currentDate: Date, events: Event[], onEventSelect: (event: Event) => void }) => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
        <div className="grid grid-cols-7 h-full">
            {days.map((day) => {
                 const dayEvents = events.filter(e => isSameDay(parseISO(e.start), day)).sort((a,b) => getHours(parseISO(a.start)) - getHours(parseISO(b.start)));
                 return (
                    <div key={day.toString()} className="border-r">
                        <div className="text-center p-2 border-b">
                            <p className="text-sm">{format(day, 'EEE')}</p>
                            <p className={cn("text-2xl font-bold", isToday(day) && "text-primary")}>{format(day, 'd')}</p>
                        </div>
                        <ScrollArea className="h-[calc(85vh-140px)]">
                            <div className="p-2 space-y-2">
                                {dayEvents.map(event => (
                                    <button key={event.id} onClick={() => onEventSelect(event)} className="w-full text-left bg-secondary p-2 rounded">
                                        <p className="font-semibold text-sm">{event.title}</p>
                                        {!event.allDay && <p className="text-xs text-muted-foreground">{format(parseISO(event.start), 'HH:mm')} - {format(parseISO(event.end), 'HH:mm')}</p>}
                                        {event.allDay && <p className="text-xs text-muted-foreground">All day</p>}
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                 );
            })}
        </div>
    );
};

const DayView = ({ currentDate, events, onEventSelect }: { currentDate: Date, events: Event[], onEventSelect: (event: Event) => void }) => {
    const dayEvents = events.filter(e => isSameDay(parseISO(e.start), currentDate)).sort((a,b) => getHours(parseISO(a.start)) - getHours(parseISO(b.start)));
    
    return (
        <div>
            <div className="p-4 border-b">
                <h2 className="text-2xl font-bold">{format(currentDate, 'PPPP')}</h2>
            </div>
             <ScrollArea className="h-[calc(85vh-160px)]">
                <div className="p-4 space-y-4">
                    {dayEvents.length > 0 ? dayEvents.map(event => (
                        <button key={event.id} onClick={() => onEventSelect(event)} className="w-full text-left flex items-start gap-4 p-4 bg-secondary rounded-lg">
                           <div className="text-right">
                                {event.allDay ? (
                                    <div className="font-semibold text-sm">All Day</div>
                                ) : (
                                    <>
                                        <div className="font-semibold">{format(parseISO(event.start), 'HH:mm')}</div>
                                        <div className="text-xs text-muted-foreground">to {format(parseISO(event.end), 'HH:mm')}</div>
                                    </>
                                )}
                           </div>
                           <div className="flex-1 border-l pl-4">
                                <p className="font-semibold">{event.title}</p>
                                {event.description && <p className="text-sm text-muted-foreground">{event.description}</p>}
                           </div>
                        </button>
                    )) : (
                        <p className="text-center text-muted-foreground py-16">No events for this day.</p>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};
// #endregion

// #region Dialogs
const EventDialog = ({ form, onSubmit, selectedEvent, handleDelete }: { form: any, onSubmit: (values: any) => void, selectedEvent: Event | null, handleDelete: () => void }) => {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{selectedEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="allDay" render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <div className="space-y-1 leading-none"><FormLabel>All-day event</FormLabel></div>
                        </FormItem>
                    )}/>
                    <div className="grid grid-cols-2 gap-4">
                       <FormField control={form.control} name="startDate" render={({ field }) => (
                            <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        {!form.watch('allDay') && <FormField control={form.control} name="startTime" render={({ field }) => (
                            <FormItem><FormLabel>Start Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>}
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                       <FormField control={form.control} name="endDate" render={({ field }) => (
                            <FormItem><FormLabel>End Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        {!form.watch('allDay') && <FormField control={form.control} name="endTime" render={({ field }) => (
                            <FormItem><FormLabel>End Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>}
                    </div>
                    <DialogFooter>
                        {selectedEvent && <Button type="button" variant="destructive" onClick={handleDelete}><Trash2 className="mr-2"/> Delete</Button>}
                        <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                        <Button type="submit">Save Event</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    );
};

const IcsImportDialog = ({ onImport, onClose }: { onImport: (events: Event[]) => void, onClose: () => void }) => {
    const { toast } = useToast();
    const [url, setUrl] = useState('');
    const [isFetching, setIsFetching] = useState(false);

    const processIcsText = async (text: string): Promise<Event[]> => {
        const ICAL = await import('ical.js');
        const jcalData = ICAL.parse(text);
        const component = new ICAL.Component(jcalData);
        const vevents = component.getAllSubcomponents('vevent');
        
        const importedEvents: Event[] = vevents.map((vevent: any) => {
            const event = new ICAL.Event(vevent);
            return {
                id: event.uid,
                title: event.summary,
                description: event.description || '',
                start: event.startDate.toString(),
                end: event.endDate.toString(),
                allDay: event.startDate.isDate,
            };
        });
        return importedEvents;
    }

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
    
      const text = await file.text();
      try {
        const events = await processIcsText(text);
        onImport(events);
      } catch (err) {
        console.error(err);
        toast({ variant: 'destructive', title: 'Import Failed', description: 'Could not parse the .ics file.' });
      }
    };
  
    const handleUrlImport = async () => {
        let importUrl = url.trim();
        if (!importUrl) {
            toast({ variant: 'destructive', title: 'Invalid URL', description: 'Please enter a URL.' });
            return;
        }
        
        if (!importUrl.startsWith('http://') && !importUrl.startsWith('https://')) {
            importUrl = 'https://' + importUrl;
        }

        setIsFetching(true);
        try {
            const response = await fetch(importUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch calendar. Status: ${response.status}`);
            }
            const text = await response.text();
            const events = await processIcsText(text);
            onImport(events);
        } catch(err) {
            console.error(err);
            let description = 'Could not import from URL.';
            if (err instanceof TypeError) {
                description += " This may be a CORS issue, where the server doesn't allow direct access from other websites.";
            } else if (err instanceof Error) {
                description += ` ${err.message}`;
            }
            toast({ variant: 'destructive', title: 'Import Failed', description: description });
        } finally {
            setIsFetching(false);
        }
    }

    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Calendar</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="file">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="file">From File</TabsTrigger>
                <TabsTrigger value="url">From URL</TabsTrigger>
            </TabsList>
            <TabsContent value="file" className="pt-4">
                <div className="space-y-4">
                  <Label htmlFor="ics-file">Select .ics File</Label>
                  <Input id="ics-file" type="file" accept=".ics,text/calendar" onChange={handleFileChange} />
                  <p className="text-sm text-muted-foreground">
                    Import events from an iCalendar (.ics) file from your device.
                  </p>
                </div>
            </TabsContent>
            <TabsContent value="url" className="pt-4">
                 <div className="space-y-4">
                  <Label htmlFor="ics-url">Public .ics URL</Label>
                  <div className="flex gap-2">
                    <Input id="ics-url" type="url" placeholder="https://example.com/calendar.ics" value={url} onChange={e => setUrl(e.target.value)} />
                    <Button onClick={handleUrlImport} disabled={isFetching}>
                        {isFetching ? <Loader2 className="animate-spin" /> : 'Import'}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Paste a public URL to an iCalendar (.ics) file. The URL must be accessible from your browser. Some servers may block direct requests due to security settings (CORS).
                  </p>
                </div>
            </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    );
  };
// #endregion
