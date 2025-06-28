
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { fetchAirPollution, fetchFiveDayForecast, fetchWeather, getIcon } from '@/lib/weather';
import type { AirPollutionData, FiveDayForecastData, WeatherData } from '@/lib/weather';
import { Search, MapPin, Wind, Droplets, Gauge, Eye, Sunrise, Sunset } from 'lucide-react';
import { fromUnixTime, format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
        <div className="bg-secondary/50 rounded-lg p-4 h-full">
            <h3 className="text-sm text-muted-foreground mb-2">Air Pollution</h3>
            <p className={`text-2xl font-bold ${quality.color}`}>{quality.text}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                <div><span className="font-semibold">CO:</span> {data.list[0].components.co.toFixed(2)}</div>
                <div><span className="font-semibold">NO:</span> {data.list[0].components.no.toFixed(2)}</div>
                <div><span className="font-semibold">NO₂:</span> {data.list[0].components.no2.toFixed(2)}</div>
                <div><span className="font-semibold">O₃:</span> {data.list[0].components.o3.toFixed(2)}</div>
                <div><span className="font-semibold">SO₂:</span> {data.list[0].components.so2.toFixed(2)}</div>
                <div><span className="font-semibold">PM2.5:</span> {data.list[0].components.pm2_5.toFixed(2)}</div>
            </div>
        </div>
    );
};

const FiveDayForecast = ({ data }: { data: FiveDayForecastData }) => {
    const dailyData = data.list.filter((reading) => reading.dt_txt.includes("12:00:00"));

    return (
        <div className="bg-secondary/50 rounded-lg p-4 col-span-1 md:col-span-2">
            <h3 className="text-sm text-muted-foreground mb-2">5-Day Forecast</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {dailyData.map((day) => (
                    <div key={day.dt} className="flex flex-col items-center text-center space-y-1">
                        <p className="font-semibold">{format(fromUnixTime(day.dt), 'E')}</p>
                        {getIcon(day.weather[0].icon, "size-8")}
                        <p className="text-lg font-bold">{Math.round(day.main.temp)}°</p>
                        <p className="text-xs text-muted-foreground">{day.weather[0].description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function Weather() {
  const [city, setCity] = useLocalStorage('weather-city', 'London');
  const [searchTerm, setSearchTerm] = useState('London');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [airPollution, setAirPollution] = useState<AirPollutionData | null>(null);
  const [forecast, setForecast] = useState<FiveDayForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCity(searchTerm);
  };

  const fetchAllData = async (lat: number, lon: number, cityName: string) => {
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
        setSearchTerm(cityName);
    } catch (err: any) {
        setError(err.message);
        toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY) {
        setError("OpenWeatherMap API key is not configured. Please add NEXT_PUBLIC_OPENWEATHER_API_KEY to your .env file.");
        setIsLoading(false);
        return;
    }

    const getCoordinates = async () => {
        try {
            const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`);
            if(!res.ok) throw new Error("Failed to get coordinates for city.");
            const data = await res.json();
            if (data.length === 0) throw new Error(`City "${city}" not found.`);
            const { lat, lon, name } = data[0];
            await fetchAllData(lat, lon, name);
        } catch (err: any) {
            setError(err.message);
            toast({ variant: 'destructive', title: 'Error', description: err.message });
            setIsLoading(false);
        }
    }
    if (city) {
        getCoordinates();
    } else {
        setIsLoading(false);
    }
  }, [city, toast]);
  
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem('weather-city')) {
        if (!process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY) {
            return; // Don't ask for location if we can't use it
        }
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const res = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`);
                const data = await res.json();
                if(data.length > 0) {
                    setCity(data[0].name);
                }
            },
            () => {
                toast({ title: "Location Access Denied", description: "Showing weather for default location."})
            }
        );
    }
  }, [setCity, toast]);


  if (isLoading) {
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
  
  if (error) {
    return (
        <div className="space-y-6">
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
                <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search for a city..."/>
                <Button type="submit"><Search /></Button>
            </form>
            <Alert variant="destructive">
                <AlertTitle>An Error Occurred</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
    );
  }

  return (
    <div className="space-y-6">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search for a city..."/>
            <Button type="submit"><Search /></Button>
        </form>
        {weather && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="md:col-span-2 lg:col-span-4 flex justify-between items-center bg-secondary/30 p-4 rounded-lg">
                    <div>
                        <h2 className="text-3xl font-bold">{weather.name}, {weather.sys.country}</h2>
                        <p className="text-muted-foreground">{weather.weather[0].description}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-5xl font-bold">{Math.round(weather.main.temp)}°</p>
                        <p className="text-sm">Feels like {Math.round(weather.main.feels_like)}°</p>
                    </div>
                </div>
                
                {airPollution && <AirPollution data={airPollution} />}

                <div className="bg-secondary/50 rounded-lg p-4 space-y-4">
                    <h3 className="text-sm text-muted-foreground">Sun Times</h3>
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
                </div>
                
                {forecast && <FiveDayForecast data={forecast} />}

                <div className="bg-secondary/50 rounded-lg p-4 space-y-4">
                    <h3 className="text-sm text-muted-foreground mb-2">Details</h3>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2"><Wind className="size-4" /> Wind</div>
                        <span className="font-semibold">{weather.wind.speed} m/s</span>
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
                </div>

            </div>
        )}
    </div>
  )
}
