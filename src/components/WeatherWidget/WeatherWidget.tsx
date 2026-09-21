// src/components/WeatherWidget/WeatherWidget.tsx
import { useEffect, useState } from "react";
import {
  fetchWeather,
  fetchCoordinates,
  getWeatherInfo,
  type WeatherData,
} from "../../utils/weatherUtils";

interface WeatherWidgetProps {
  latitude?: number | null;
  longitude?: number | null;
  capital: string;
  countryName: string;
}

export default function WeatherWidget({
  latitude,
  longitude,
  capital,
  countryName,
}: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadWeather = async () => {
      setIsLoading(true);
      setError(null);

      let lat = latitude;
      let lon = longitude;

      // If coordinates are missing, try to geocode the capital or country name
      if (
        lat === null ||
        lon === null ||
        lat === undefined ||
        lon === undefined
      ) {
        const query = capital !== "N/A" ? capital : countryName;
        const coords = await fetchCoordinates(query);

        if (coords) {
          lat = coords.lat;
          lon = coords.lon;
        }
      }

      // If we still don't have coordinates, show an error
      if (
        lat === null ||
        lon === null ||
        lat === undefined ||
        lon === undefined
      ) {
        if (isMounted) {
          setError("Location data unavailable");
          setIsLoading(false);
        }
        return;
      }

      const data = await fetchWeather(lat, lon);

      if (isMounted) {
        if (data) {
          setWeather(data);
        } else {
          setError("Weather data unavailable");
        }
        setIsLoading(false);
      }
    };

    loadWeather();

    // Refresh weather every 15 minutes
    const interval = setInterval(loadWeather, 15 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [latitude, longitude, capital, countryName]);

  // Loading State
  if (isLoading) {
    return (
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 animate-pulse">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
        <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
    );
  }

  // Error State
  if (error || !weather) {
    return (
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
        <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider mb-1">
          Weather in {capital}
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {error || "Could not load weather data."}
        </span>
      </div>
    );
  }

  // Success State
  const weatherInfo = getWeatherInfo(weather.weatherCode);

  return (
    <div className="p-4 bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl border border-sky-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
          Weather in {capital}
        </span>
        <span
          className="text-2xl"
          role="img"
          aria-label={weatherInfo.description}
        >
          {weatherInfo.emoji}
        </span>
      </div>

      <div className="flex items-end gap-3 mb-4">
        <span className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          {weather.temperature}°
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1.5">
          {weatherInfo.description}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white/60 dark:bg-slate-900/40 rounded-xl p-2">
          <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
            Feels Like
          </span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {weather.apparentTemperature}°
          </span>
        </div>
        <div className="bg-white/60 dark:bg-slate-900/40 rounded-xl p-2">
          <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
            Humidity
          </span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {weather.humidity}%
          </span>
        </div>
        <div className="bg-white/60 dark:bg-slate-900/40 rounded-xl p-2">
          <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
            Wind
          </span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {weather.windSpeed} km/h
          </span>
        </div>
      </div>
    </div>
  );
}
