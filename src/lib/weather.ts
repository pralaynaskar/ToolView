
import { Sun, CloudSun, Cloud, CloudRain, CloudDrizzle, CloudLightning, CloudSnow, CloudFog, Moon, CloudMoon } from 'lucide-react';
import React from 'react';

export interface WeatherData {
    name: string;
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
        pressure: number;
    };
    weather: {
        main: string;
        description: string;
        icon: string;
    }[];
    wind: {
        speed: number;
        gust?: number;
    };
    sys: {
        country: string;
        sunrise: number;
        sunset: number;
    };
    visibility: number;
    clouds: {
        all: number;
    };
}

export interface HourlyForecast {
    dt: number;
    dt_txt: string;
    main: {
        temp: number;
        humidity: number;
    };
    weather: {
        description: string;
        icon: string;
    }[];
    clouds: {
        all: number;
    };
    wind: {
        speed: number;
        gust: number;
    };
    pop: number; // Probability of precipitation
}

export interface FiveDayForecastData {
    list: HourlyForecast[];
}

export interface AirPollutionData {
    list: {
        main: {
            aqi: number;
        };
        components: {
            co: number;
            no: number;
            no2: number;
            o3: number;
            so2: number;
            pm2_5: number;
        };
    }[];
}

export interface GeoSuggestion {
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
}

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData> => {
    if (!API_KEY) throw new Error("OpenWeatherMap API key not configured.");
    const res = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
    if (!res.ok) {
        throw new Error("Failed to fetch weather data. Is your API key correct?");
    }
    return res.json();
};

export const fetchFiveDayForecast = async (lat: number, lon: number): Promise<FiveDayForecastData> => {
    if (!API_KEY) throw new Error("OpenWeatherMap API key not configured.");
    const res = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
    if (!res.ok) {
        throw new Error("Failed to fetch forecast data.");
    }
    return res.json();
};

export const fetchAirPollution = async (lat: number, lon: number): Promise<AirPollutionData> => {
    if (!API_KEY) throw new Error("OpenWeatherMap API key not configured.");
    const res = await fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    if (!res.ok) {
        throw new Error("Failed to fetch air pollution data.");
    }
    return res.json();
};

export const fetchGeoSuggestions = async (query: string): Promise<GeoSuggestion[]> => {
    if (!query || !API_KEY) return [];
    try {
        const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`);
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        return [];
    }
};

export const getIcon = (iconCode: string, className?: string) => {
    switch (iconCode) {
        case "01d": return React.createElement(Sun, { className });
        case "01n": return React.createElement(Moon, { className });
        case "02d": return React.createElement(CloudSun, { className });
        case "02n": return React.createElement(CloudMoon, { className });
        case "03d":
        case "03n":
        case "04d":
        case "04n":
            return React.createElement(Cloud, { className });
        case "09d":
        case "09n":
            return React.createElement(CloudRain, { className });
        case "10d":
        case "10n":
            return React.createElement(CloudDrizzle, { className });
        case "11d":
        case "11n":
            return React.createElement(CloudLightning, { className });
        case "13d":
        case "13n":
            return React.createElement(CloudSnow, { className });
        case "50d":
        case "50n":
            return React.createElement(CloudFog, { className });
        default:
            return React.createElement(Sun, { className });
    }
};
