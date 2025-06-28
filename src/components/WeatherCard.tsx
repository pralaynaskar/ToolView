
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchWeather, getIcon } from '@/lib/weather';
import type { WeatherData } from '@/lib/weather';
import { useLocalStorage } from '@/hooks/use-local-storage';

const API_KEY_OWM = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

export default function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [city] = useLocalStorage('weather-city', '');
  
  const hasApiKey = !!API_KEY_OWM;

  useEffect(() => {
    if (!hasApiKey) {
      setIsLoading(false);
      return;
    }

    const fetchWeatherData = async (lat: number, lon: number) => {
      try {
        const data = await fetchWeather(lat, lon);
        setWeather(data);
      } catch (error) {
        console.error("Failed to fetch weather for card:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const getInitialLocation = async () => {
        setIsLoading(true);
        if (city && API_KEY_OWM) {
            try {
                // Use a geo API to get lat/lon for the city name
                const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY_OWM}`);
                const data = await res.json();
                if (data.length > 0) {
                    await fetchWeatherData(data[0].lat, data[0].lon);
                } else {
                    setIsLoading(false);
                }
            } catch {
                setIsLoading(false);
            }
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeatherData(position.coords.latitude, position.coords.longitude);
            },
            () => {
                setIsLoading(false); // Can't get location, stop loading
            }
            );
        } else {
            setIsLoading(false);
        }
    }

    getInitialLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  if (isLoading) {
    return (
      <div className="w-full max-w-sm mx-auto">
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!weather || !hasApiKey) {
    return null; // Don't render anything if there's no weather data or API key
  }

  return (
    <Link href="/weather" className="block w-full max-w-sm mx-auto">
      <Card className="hover:bg-accent transition-colors">
        <CardContent className="p-2 flex items-center justify-center gap-3">
          {getIcon(weather.weather[0].icon, 'size-6')}
          <span className="font-semibold">{Math.round(weather.main.temp)}°</span>
          <span className="text-sm text-muted-foreground">{weather.name}</span>
          <span className="text-sm text-muted-foreground capitalize"> - {weather.weather[0].description}</span>
        </CardContent>
      </Card>
    </Link>
  );
}
