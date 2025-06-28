
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { fetchFiveDayForecast, fetchWeather, fetchAirPollution, fetchGeoSuggestions } from '@/lib/weather';
import { getIcon, type AirPollutionData, type FiveDayForecastData, type WeatherData, type GeoSuggestion } from '@/lib/weather';
import { Search, MapPin, Wind, Droplets, Gauge, Eye, Sunrise, Sunset, Cloud, Umbrella, Calendar as CalendarIcon, SunDim, Thermometer, Info, Loader2 } from 'lucide-react';
import { fromUnixTime, format, isSameDay, startOfDay, startOfToday, isBefore, subDays, parseISO } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const API_KEY_OWM = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

// #region Sub-components

const AirPollution = ({ data }: { data: AirPollutionData }) => {
    const getAirQualityText = (aqi: number) => {
        if (aqi === 1) return { text: "Good", color: "text-green-500" };
        if (aqi === 2) return { text: "Fair", color: "text-yellow-500" };
        if (aqi === 3) return { text: "Moderate", color: "text-orange-500" };
        if (aqi === 4) return { text: "Poor", color: "text-red-500" };
        if (aqi === 5) return { text: "Very Poor", color: "text-purple-500" };
        return { text: "Unknown", color: "text-muted-foreground" };
    }
    const quality = getAirQualityText(data.list[0].main.aqi);

    return (
        <Card className="h-full">
            <CardHeader><CardTitle className="text-base">Air Pollution</CardTitle></CardHeader>
            <CardContent>
                <p className={`text-2xl font-bold ${quality.color}`}>{quality.text}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                    <div><span className="font-semibold">CO:</span> {data.list[0].components.co.toFixed(2)}</div>
                    <div><span className="font-semibold">NO₂:</span> {data.list[0].components.no2.toFixed(2)}</div>
                    <div><span className="font-semibold">O₃:</span> {data.list[0].components.o3.toFixed(2)}</div>
                    <div><span className="font-semibold">PM2.5:</span> {data.list[0].components.pm2_5.toFixed(2)}</div>
                </div>
            </CardContent>
        </Card>
    );
};

const FiveDayForecast = ({ data, onDayClick }: { data: FiveDayForecastData, onDayClick: (date: Date) => void }) => {
    const dailyData = data.list.filter((reading, index) => {
        return reading.dt_txt.includes("12:00:00");
    }).slice(0, 5);

    return (
        <Card className="col-span-1 md:col-span-2">
            <CardHeader><CardTitle className="text-base">5-Day Forecast</CardTitle></CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {dailyData.map((day) => (
                        <button key={day.dt} onClick={() => onDayClick(fromUnixTime(day.dt))} className="flex flex-col items-center text-center space-y-1 p-2 rounded-lg hover:bg-secondary transition-colors">
                            <p className="font-semibold">{format(fromUnixTime(day.dt), 'E')}</p>
                            {getIcon(day.weather[0].icon, "size-8")}
                            <p className="text-lg font-bold">{Math.round(day.main.temp)}°</p>
                            <p className="text-xs text-muted-foreground capitalize">{day.weather[0].description}</p>
                        </button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const SunTimes = ({ weather }: { weather: WeatherData }) => (
    <Card>
        <CardHeader><CardTitle className="text-base">Sun Times</CardTitle></CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
                <Sunrise className="size-8 text-yellow-500" />
                <div>
                    <p className="text-xs">Sunrise</p>
                    <p className="font-bold">{format(fromUnixTime(weather.sys.sunrise), 'p')}</p>
                </div>
            </div>
             <div className="flex items-center gap-4">
                <Sunset className="size-8 text-orange-500" />
                <div>
                    <p className="text-xs">Sunset</p>
                    <p className="font-bold">{format(fromUnixTime(weather.sys.sunset), 'p')}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);

const Details = ({ weather }: { weather: WeatherData }) => (
    <Card>
        <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2"><Wind className="size-4" /> Wind</div>
                <span className="font-semibold">{weather.wind.speed.toFixed(1)} m/s</span>
            </div>
             <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2"><Droplets className="size-4" /> Humidity</div>
                <span className="font-semibold">{weather.main.humidity}%</span>
            </div>
             <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2"><Gauge className="size-4" /> Pressure</div>
                <span className="font-semibold">{weather.main.pressure} hPa</span>
            </div>
             <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2"><Eye className="size-4" /> Visibility</div>
                <span className="font-semibold">{(weather.visibility / 1000).toFixed(1)} km</span>
            </div>
        </CardContent>
    </Card>
);

const OverviewTab = ({ weather, forecast, airPollution, onDayClick }: { weather: WeatherData, forecast: FiveDayForecastData, airPollution: AirPollutionData, onDayClick: (date: Date) => void }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="md:col-span-2 lg:col-span-4 flex justify-between items-center bg-secondary/30 p-4 rounded-lg">
            <div>
                <h2 className="text-3xl font-bold">{weather.name}, {weather.sys.country}</h2>
                <p className="text-muted-foreground capitalize">{weather.weather[0].description}</p>
            </div>
            <div className="text-right">
                <p className="text-5xl font-bold">{Math.round(weather.main.temp)}°</p>
                <p className="text-sm">Feels like {Math.round(weather.main.feels_like)}°</p>
            </div>
        </Card>
        
        <AirPollution data={airPollution} />
        <SunTimes weather={weather} />
        <FiveDayForecast data={forecast} onDayClick={onDayClick} />
        <Details weather={weather} />
    </div>
);

const AdvancedTab = ({ forecast, initialDate }: { forecast: FiveDayForecastData, initialDate: Date }) => {
    const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
    
    useEffect(() => {
        setSelectedDate(initialDate);
    }, [initialDate]);
    
    const isHistoric = isBefore(selectedDate, startOfToday());
    
    const hourlyDataForSelectedDay = useMemo(() => {
        return forecast.list.filter(item => isSameDay(fromUnixTime(item.dt), selectedDate));
    }, [forecast, selectedDate]);
    
    const chartData = hourlyDataForSelectedDay.map(item => ({
        time: format(fromUnixTime(item.dt), 'ha'),
        temp: Math.round(item.main.temp),
    }));
    
    const dailyDetails = useMemo(() => {
        const entry = forecast.list.find(item => isSameDay(fromUnixTime(item.dt), selectedDate));
        return entry;
    }, [forecast, selectedDate]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(day) => day && setSelectedDate(day)}
                      initialFocus
                      disabled={{ after: new Date(new Date().setDate(new Date().getDate() + 4)), before: subDays(new Date(), 30) }}
                    />
                  </PopoverContent>
                </Popover>

                { isHistoric ? (
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Historical Data</AlertTitle>
                        <AlertDescription>
                            Historical weather data is not available on this plan.
                        </AlertDescription>
                    </Alert>
                ) : dailyDetails ? (
                    <Card>
                        <CardHeader><CardTitle className="text-base">Details for {format(selectedDate, 'PPP')}</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                                <Umbrella className="size-6 text-blue-500" />
                                <span className="font-bold">{(dailyDetails.pop * 100).toFixed(0)}%</span>
                                <span className="text-xs text-muted-foreground">Precipitation</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <Cloud className="size-6 text-gray-500" />
                                <span className="font-bold">{dailyDetails.clouds.all}%</span>
                                <span className="text-xs text-muted-foreground">Cloud Cover</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <Wind className="size-6 text-cyan-500" />
                                <span className="font-bold">{dailyDetails.wind.speed.toFixed(1)} m/s</span>
                                <span className="text-xs text-muted-foreground">Wind Speed</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <Droplets className="size-6 text-indigo-500" />
                                <span className="font-bold">{dailyDetails.main.humidity}%</span>
                                <span className="text-xs text-muted-foreground">Humidity</span>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="p-4 text-center text-muted-foreground">No forecast data available for this day.</CardContent>
                    </Card>
                )}
            </div>
            <div className="lg:col-span-2 space-y-4">
              {!isHistoric && hourlyDataForSelectedDay.length > 0 && (
                <Card>
                    <CardHeader><CardTitle className="text-base">Temperature Trend (Hourly)</CardTitle></CardHeader>
                    <CardContent className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} unit="°" />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                                <Line type="monotone" dataKey="temp" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
              )}
            </div>
        </div>
    );
}

// #endregion

export default function WeatherPage() {
  const [city, setCity] = useLocalStorage('weather-city', 'London');
  const [searchTerm, setSearchTerm] = useState('London');
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [airPollution, setAirPollution] = useState<AirPollutionData | null>(null);
  const [forecast, setForecast] = useState<FiveDayForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedAdvancedDate, setSelectedAdvancedDate] = useState(startOfDay(new Date()));
  const { toast } = useToast();
  
  const hasApiKey = !!API_KEY_OWM;

  const fetchData = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    try {
        const [weatherData, forecastData, airPollutionData] = await Promise.all([
            fetchWeather(lat, lon),
            fetchFiveDayForecast(lat, lon),
            fetchAirPollution(lat, lon)
        ]);
        setWeather(weatherData);
        setForecast(forecastData);
        setAirPollution(airPollutionData);
        setSearchTerm(weatherData.name);
        setCity(weatherData.name);
    } catch (err: any) {
        setError(err.message);
        toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
        setIsLoading(false);
    }
  }, [setCity, toast]);
  
  const handleGeoSearch = useCallback(async (query: string) => {
    try {
        const geoRes = await fetchGeoSuggestions(query);
        if (geoRes.length === 0) throw new Error(`Could not find location: ${query}`);
        const { lat, lon } = geoRes[0];
        await fetchData(lat, lon);
        setSuggestions([]);
    } catch (e: any) {
        setError(e.message);
        toast({ variant: 'destructive', title: 'Error', description: e.message });
        setIsLoading(false);
    }
  }, [fetchData, toast]);

  const handleSuggestionClick = useCallback(async (suggestion: GeoSuggestion) => {
    await fetchData(suggestion.lat, suggestion.lon);
    setSuggestions([]);
  }, [fetchData]);
  
  // Effect for initial data load
  useEffect(() => {
    if (!hasApiKey) {
        setError("OpenWeatherMap API key is not configured. Please add NEXT_PUBLIC_OPENWEATHER_API_KEY to your .env file.");
        setIsLoading(false);
        return;
    }

    const getInitialData = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => fetchData(position.coords.latitude, position.coords.longitude),
          () => {
            toast({ title: "Location Access Denied", description: `Showing weather for ${city || 'London'}.` });
            handleGeoSearch(city || 'London');
          }
        );
      } else {
        handleGeoSearch(city || 'London');
      }
    };
    getInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Effect for search term suggestions
  useEffect(() => {
    if (!isTyping || searchTerm.length < 3) {
      setSuggestions([]);
      return;
    }
    const handler = setTimeout(async () => {
      const suggestions = await fetchGeoSuggestions(searchTerm);
      setSuggestions(suggestions);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, isTyping]);


  const handleDayClick = (date: Date) => {
      setSelectedAdvancedDate(startOfDay(date));
      setActiveTab("advanced");
  };

  if (isLoading && !weather) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-12 w-full max-w-md" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48 lg:col-span-2" />
                <Skeleton className="h-48 lg:col-span-2" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
            </div>
        </div>
    )
  }
  
  if (error && !weather) {
    return (
        <div className="space-y-6">
            <div className="relative max-w-md">
                <form onSubmit={(e) => { e.preventDefault(); hasApiKey && handleGeoSearch(searchTerm); }} className="flex gap-2">
                    <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search for a city..."/>
                    <Button type="submit" disabled={!hasApiKey}><Search /></Button>
                </form>
            </div>
            <Alert variant="destructive">
                <AlertTitle>An Error Occurred</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
    );
  }

  return (
    <div className="space-y-6">
        <div className="relative max-w-md">
            <form onSubmit={(e) => { e.preventDefault(); hasApiKey && handleGeoSearch(searchTerm); }} className="flex gap-2">
                <Input
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setIsTyping(true); }}
                    onBlur={() => setTimeout(() => setIsTyping(false), 200)}
                    placeholder="Search for a city..."
                    disabled={!hasApiKey}
                />
                <Button type="submit" disabled={isLoading || !hasApiKey}>{isLoading ? <Loader2 className="animate-spin" /> : <Search />}</Button>
            </form>
            {suggestions.length > 0 && isTyping && (
                <Card className="absolute top-full mt-2 w-full z-10">
                    <CardContent className="p-2">
                        {suggestions.map((s, i) => (
                            <button
                                key={`${s.lat}-${s.lon}-${i}`}
                                onClick={() => handleSuggestionClick(s)}
                                className="block w-full text-left p-2 rounded-md hover:bg-secondary"
                            >
                                {s.name}{s.state ? `, ${s.state}` : ''}, {s.country}
                            </button>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
        
        {weather && forecast && airPollution ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <OverviewTab weather={weather} forecast={forecast} airPollution={airPollution} onDayClick={handleDayClick}/>
            </TabsContent>
            <TabsContent value="advanced" className="mt-4">
              <AdvancedTab forecast={forecast} initialDate={selectedAdvancedDate} />
            </TabsContent>
          </Tabs>
        ) : (
             <Alert variant="destructive">
                <AlertTitle>No Data Available</AlertTitle>
                <AlertDescription>Could not load weather data. Please try searching for a different location.</AlertDescription>
            </Alert>
        )}
    </div>
  )
}
