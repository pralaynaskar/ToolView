
import type { WeatherData, AirPollutionData, FiveDayForecastData, GeoSuggestion } from './weather';

const API_KEY = process.env.NEXT_PUBLIC_ACCUWEATHER_API_KEY;
const BASE_URL = 'https://dataservice.accuweather.com';

// #region AccuWeather Specific Interfaces
interface AccuWeatherLocation {
    Key: string;
    LocalizedName: string;
    Country: { ID: string };
    AdministrativeArea: { ID: string };
}

interface AccuWeatherCurrent {
    WeatherText: string;
    WeatherIcon: number;
    Temperature: { Metric: { Value: number } };
    RealFeelTemperature: { Metric: { Value: number } };
    RelativeHumidity: number;
    Wind: { Speed: { Metric: { Value: number } } }; // km/h
    Pressure: { Metric: { Value: number } }; // mb
    Visibility: { Metric: { Value: number } }; // km
    CloudCover: number;
}

interface AccuWeather5Day {
    DailyForecasts: {
        Date: string;
        EpochDate: number;
        Sun: { EpochRise: number; EpochSet: number };
        Temperature: {
            Minimum: { Value: number };
            Maximum: { Value: number };
        };
        Day: {
            Icon: number;
            IconPhrase: string;
            PrecipitationProbability: number;
        };
        AirAndPollen: {
            Name: string; // "AirQuality" or "O3" etc.
            Value: number; // This is the AQI
            Category: string;
        }[];
    }[];
}
// #endregion


// #region Helper Functions
/**
 * Maps AccuWeather icon codes to approximate OpenWeatherMap icon codes.
 * This allows reusing the existing getIcon component.
 */
function mapAccuWeatherIconToOwm(icon: number): string {
    // Mapping based on AccuWeather API documentation for icons
    if ([1, 2, 3, 33, 34].includes(icon)) return "01d"; // Sunny / Mostly Sunny / Clear
    if ([4, 5, 6, 35, 36].includes(icon)) return "02d"; // Partly Sunny / Hazy / Partly Cloudy
    if ([7, 8, 38].includes(icon)) return "03d"; // Cloudy / Mostly Cloudy
    if ([11, 37].includes(icon)) return "50d"; // Fog / Hazy Moonlight
    if ([12, 13, 14, 39, 40].includes(icon)) return "09d"; // Showers / Partly Sunny with Showers
    if ([18].includes(icon)) return "10d"; // Rain
    if ([15, 16, 17, 41, 42].includes(icon)) return "11d"; // T-Storms
    if ([19, 20, 21, 22, 23, 43, 44].includes(icon)) return "13d"; // Snow / Flurries
    if ([24, 25, 26, 29].includes(icon)) return "09d"; // Sleet / Freezing Rain
    return "01d"; // Default to sunny
}

/**
 * Adapts AccuWeather API responses to the app's standard format.
 */
function adaptAccuWeatherData(
    location: AccuWeatherLocation,
    current: AccuWeatherCurrent,
    forecast: AccuWeather5Day
): { weather: WeatherData; forecast: FiveDayForecastData; airPollution: AirPollutionData } {
    
    // Adapt current weather
    const weather: WeatherData = {
        name: location.LocalizedName,
        main: {
            temp: current.Temperature.Metric.Value,
            feels_like: current.RealFeelTemperature.Metric.Value,
            humidity: current.RelativeHumidity,
            pressure: current.Pressure.Metric.Value,
        },
        weather: [{
            main: current.WeatherText,
            description: current.WeatherText,
            icon: mapAccuWeatherIconToOwm(current.WeatherIcon),
        }],
        wind: {
            speed: current.Wind.Speed.Metric.Value * 1000 / 3600, // km/h to m/s
        },
        sys: {
            country: location.Country.ID,
            sunrise: forecast.DailyForecasts[0].Sun.EpochRise,
            sunset: forecast.DailyForecasts[0].Sun.EpochSet,
        },
        visibility: current.Visibility.Metric.Value * 1000, // km to m
        clouds: {
            all: current.CloudCover,
        },
    };

    // Adapt forecast
    const forecastList: FiveDayForecastData['list'] = forecast.DailyForecasts.map(day => ({
        dt: day.EpochDate,
        dt_txt: day.Date,
        main: {
            temp: day.Temperature.Maximum.Value,
            humidity: 0, // Not available in daily forecast from AccuWeather
        },
        weather: [{
            description: day.Day.IconPhrase,
            icon: mapAccuWeatherIconToOwm(day.Day.Icon),
        }],
        clouds: { all: 0 },
        wind: { speed: 0, gust: 0 },
        pop: day.Day.PrecipitationProbability / 100,
    }));

    // Adapt air pollution from forecast data
    const airQualityForecast = forecast.DailyForecasts[0].AirAndPollen;
    const aqiEntry = airQualityForecast.find(p => p.Name === 'AirQuality');
    const o3Entry = airQualityForecast.find(p => p.Name === 'O3');
    const pm25Entry = airQualityForecast.find(p => p.Name === 'PM2.5');

    const airPollution: AirPollutionData = {
        list: [{
            main: { aqi: aqiEntry ? Math.ceil(aqiEntry.Value / 50) : 1 }, // Convert AQI to 1-5 scale
            components: {
                co: 0,
                no: 0,
                no2: 0,
                o3: o3Entry?.Value || 0,
                so2: 0,
                pm2_5: pm25Entry?.Value || 0,
            }
        }]
    };
    
    return { weather, forecast: { list: forecastList }, airPollution };
}
// #endregion


// #region API Fetching Functions
export const fetchAccuWeatherLocationKey = async (lat: number, lon: number): Promise<AccuWeatherLocation> => {
    if (!API_KEY) throw new Error("AccuWeather API key not configured.");
    const res = await fetch(`${BASE_URL}/locations/v1/cities/geoposition/search?apikey=${API_KEY}&q=${lat},${lon}`);
    if (!res.ok) throw new Error("Failed to fetch AccuWeather location key.");
    return res.json();
}

export const fetchAccuWeatherCurrentConditions = async (locationKey: string): Promise<AccuWeatherCurrent> => {
    const res = await fetch(`${BASE_URL}/currentconditions/v1/${locationKey}?apikey=${API_KEY}&details=true`);
    if (!res.ok) throw new Error("Failed to fetch AccuWeather current conditions.");
    const data = await res.json();
    return data[0]; // Current conditions endpoint returns an array
}

export const fetchAccuWeather5DayForecast = async (locationKey: string): Promise<AccuWeather5Day> => {
    const res = await fetch(`${BASE_URL}/forecasts/v1/daily/5day/${locationKey}?apikey=${API_KEY}&metric=true&details=true`);
    if (!res.ok) throw new Error("Failed to fetch AccuWeather 5-day forecast.");
    return res.json();
}

export const fetchAccuWeatherGeoSuggestions = async (query: string): Promise<GeoSuggestion[]> => {
    if (!query || !API_KEY) return [];
    try {
        const res = await fetch(`${BASE_URL}/locations/v1/cities/autocomplete?apikey=${API_KEY}&q=${query}`);
        if (!res.ok) return [];
        const data: AccuWeatherLocation[] = await res.json();
        // The geo position is not in this response, so we need to fetch it or return what we have.
        // For simplicity, we return without lat/lon. Another approach would be to make a second call.
        // Let's adapt the GeoSuggestion to handle this. We will fetch lat/lon on click.
        // A better approach for a real app would be to use a different endpoint or chained calls.
        // For this demo, we will use a hacky solution and fetch lat/lon in the main component.
        // Let's just return an empty array because we can't get lat/lon from this endpoint.
        // A better endpoint is needed for proper suggestions.
        // For the purpose of this app, we will use the same direct search logic as in the main fetch.
        const locationRes = await fetch(`https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${API_KEY}&q=${query}`);
        if(!locationRes.ok) return [];
        const locationData = await locationRes.json();

        return locationData.map((loc: any) => ({
            name: loc.LocalizedName,
            lat: loc.GeoPosition.Latitude,
            lon: loc.GeoPosition.Longitude,
            country: loc.Country.ID,
            state: loc.AdministrativeArea.ID,
        }));

    } catch (error) {
        console.error("Failed to fetch AccuWeather suggestions:", error);
        return [];
    }
};

/**
 * Main function to fetch all required data from AccuWeather and adapt it.
 */
export const fetchAllAccuWeatherData = async (lat: number, lon: number) => {
    const location = await fetchAccuWeatherLocationKey(lat, lon);
    const [current, forecast] = await Promise.all([
        fetchAccuWeatherCurrentConditions(location.Key),
        fetchAccuWeather5DayForecast(location.Key)
    ]);
    
    return { ...adaptAccuWeatherData(location, current, forecast), location };
}

// #endregion
