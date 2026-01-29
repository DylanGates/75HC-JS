import { useQuery } from '@tanstack/react-query';

// Current weather
export const useCurrentWeather = (location: string, lang: string = 'en') => 
  useQuery({
    queryKey: ['weather', 'current', location, lang],
    queryFn: () => 
      fetch(`/api/weather/current?q=${encodeURIComponent(location)}&lang=${lang}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch current weather');
          return res.json();
        }),
    enabled: !!location.trim(),
    staleTime: 5 * 60 * 1000, // 5 mins cache
    retry: 1,
  });

// Forecast
export const useWeatherForecast = (
  location: string, 
  { days = 3, aqi = 'no', alerts = 'yes', lang = 'en' } = {}
) =>
  useQuery({
    queryKey: ['weather', 'forecast', location, days, aqi, alerts, lang],
    queryFn: () => 
      fetch(
        `/api/weather/forecast?${new URLSearchParams({
          q: location,
          days: String(days),
          aqi,
          alerts,
          lang
        })}`
      ).then(res => {
        if (!res.ok) throw new Error('Failed to fetch forecast');
        return res.json();
      }),
    enabled: !!location.trim(),
    staleTime: 10 * 60 * 1000, // 10 mins cache
  });

// Timezone
export const useTimezone = (location: string) =>
  useQuery({
    queryKey: ['weather', 'timezone', location],
    queryFn: () => 
      fetch(`/api/weather/timezone?q=${encodeURIComponent(location)}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch timezone');
          return res.json();
        }),
    enabled: !!location.trim(),
  });