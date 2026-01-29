import { Hono } from "hono";
import { config } from "dotenv";
import { useState, useEffect } from "react";

config();

interface WeatherLocation {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

interface CurrentWeather {
  temp_c: number;
  temp_f: number;
  condition: {
    text: string;
    icon: string;
  };
  humidity: number;
  wind_kph: number;
  wind_mph: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  last_updated: string;
}

interface ForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    avgtemp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    maxwind_kph: number;
    totalprecip_mm: number;
    daily_chance_of_rain: number;
    uv: number;
  };
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [Location, setLocation] = useState('New York');

  const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
  const WEATHER_API_BASE = "http://api.weatherapi.com/v1";




  useEffect(() => {
    async function makeWeatherAPIRequest(
      endpoint: string,
      params: Record<string, string>
    ) {
      try {
        const url = new URL(`${WEATHER_API_BASE}/${endpoint}`);
        url.searchParams.set("key", WEATHER_API_KEY);

        for (const [key, value] of Object.entries(params)) {
          url.searchParams.set(key, value);
        }

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error(
            `WeatherAPI error: ${response.status} ${response.statusText}`
          );
        }

        return await response.json();
      } catch (error) {
        console.error("WeatherAPI request failed:", error);
        throw error;
      }
    }

    async function fetchWeather() {
      setLoading(true);
      try {
        const data = await makeWeatherAPIRequest("current.json", {
          q: Location,
        });
        setWeatherData(data);
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [Location, WEATHER_API_KEY, WEATHER_API_BASE, makeWeatherAPIRequest]);

  return (
    <div>

    </div>
  );
}
