// src/utils/weatherUtils.ts

// 1. Type Definitions for the Open-Meteo API response
export interface WeatherData {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
}

// 2. WMO Weather Code Mapping to Description and Emoji
// Reference: https://open-meteo.com/en/docs
const WMO_CODE_MAP: Record<number, { description: string; emoji: string }> = {
  0: { description: "Clear sky", emoji: "☀️" },
  1: { description: "Mainly clear", emoji: "🌤️" },
  2: { description: "Partly cloudy", emoji: "⛅" },
  3: { description: "Overcast", emoji: "☁️" },
  45: { description: "Fog", emoji: "🌫️" },
  48: { description: "Depositing rime fog", emoji: "🌫️" },
  51: { description: "Light drizzle", emoji: "🌦️" },
  53: { description: "Moderate drizzle", emoji: "🌦️" },
  55: { description: "Dense drizzle", emoji: "🌧️" },
  56: { description: "Light freezing drizzle", emoji: "🌧️❄️" },
  57: { description: "Dense freezing drizzle", emoji: "🌧️❄️" },
  61: { description: "Slight rain", emoji: "🌧️" },
  63: { description: "Moderate rain", emoji: "🌧️" },
  65: { description: "Heavy rain", emoji: "🌧️🌧️" },
  66: { description: "Light freezing rain", emoji: "🌧️❄️" },
  67: { description: "Heavy freezing rain", emoji: "🌧️❄️" },
  71: { description: "Slight snow fall", emoji: "🌨️" },
  73: { description: "Moderate snow fall", emoji: "🌨️" },
  75: { description: "Heavy snow fall", emoji: "❄️" },
  77: { description: "Snow grains", emoji: "🌨️" },
  80: { description: "Slight rain showers", emoji: "🌦️" },
  81: { description: "Moderate rain showers", emoji: "🌧️" },
  82: { description: "Violent rain showers", emoji: "⛈️" },
  85: { description: "Slight snow showers", emoji: "🌨️" },
  86: { description: "Heavy snow showers", emoji: "❄️" },
  95: { description: "Thunderstorm", emoji: "⛈️" },
  96: { description: "Thunderstorm with slight hail", emoji: "⛈️" },
  99: { description: "Thunderstorm with heavy hail", emoji: "⛈️" },
};

export const getWeatherInfo = (
  code: number,
): { description: string; emoji: string } => {
  return WMO_CODE_MAP[code] || { description: "Unknown", emoji: "❓" };
};

// 3. Fetch Coordinates using Open-Meteo Geocoding API
// This is used as a fallback because your current API doesn't provide latlng
export const fetchCoordinates = async (
  query: string,
): Promise<{ lat: number; lon: number } | null> => {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Geocoding failed");

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return {
        lat: data.results[0].latitude,
        lon: data.results[0].longitude,
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

// 4. Fetch Weather Data from Open-Meteo
export const fetchWeather = async (
  lat: number,
  lon: number,
): Promise<WeatherData | null> => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&timezone=auto`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    const current = data.current;

    return {
      temperature: Math.round(current.temperature_2m),
      apparentTemperature: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      weatherCode: current.weather_code,
      isDay: current.is_day === 1,
    };
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    return null;
  }
};
