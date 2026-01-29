import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import {
  Combobox,
  ComboboxTrigger,
  ComboboxInput,
  ComboboxContent,
  ComboboxItem,
} from "@/components/ui/combobox";
import { useState } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCelsius, setIsCelsius] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Commit 6: current weather fetch and basic card display
  const [cities, setCities] = useState<string[]>(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("weatherCities");
        if (raw) return JSON.parse(raw);
      }
    } catch (e) {
      // ignore
    }
    return ["London", "New York", "Tokyo"];
  });
  const [inputValue, setInputValue] = useState("");
  const [weatherData, setWeatherData] = useState<Record<string, any> | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  // Commit 15: add current-location lookup
  async function handleAddCurrentLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation not supported in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const key = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
          const url = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${latitude},${longitude}`;
          const res = await fetch(url);
          const data = await res.json();
          const city = data?.location?.name;
          if (city && !cities.includes(city)) setCities((s) => [...s, city]);
        } catch (e: any) {
          setError(e.message || String(e));
        }
      },
      (err) => setError(err.message || String(err)),
    );
  }

  useEffect(() => {
    async function fetchForCity(city: string) {
      try {
        const key = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${encodeURIComponent(city)}&days=3`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch ${city}`);
        return await res.json();
      } catch (e: any) {
        console.error(e);
        setError(e.message || String(e));
        return null;
      }
    }

    if (cities.length === 0) return;
    setLoading(true);
    setError(null);
    Promise.all(cities.map(fetchForCity)).then((results) => {
      const map: Record<string, any> = {};
      results.forEach((r, i) => {
        if (r && r.location && r.current) map[cities[i]] = r;
      });
      setWeatherData(map);
      setLoading(false);
      setLastUpdated(new Date());
    });
  }, [cities]);

  // Commit 14: persist cities to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("weatherCities", JSON.stringify(cities));
    } catch (e) {
      // ignore storage errors
    }
  }, [cities]);

  // Commit 12: dark mode effect
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <header className="w-full py-6 bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Weather Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Track multiple cities at a glance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge>v1</Badge>
            <div className="flex items-center gap-2">
              <span className="text-sm">°F</span>
              <Switch checked={isCelsius} onCheckedChange={setIsCelsius} />
              <span className="text-sm">°C</span>
            </div>
            {lastUpdated && (
              <Badge variant="secondary">Updated: {lastUpdated.toLocaleTimeString()}</Badge>
            )}
            <Button variant="outline" onClick={() => setCities([...cities])}>
              Refresh
            </Button>
            <Button variant="ghost" onClick={() => setDarkMode(!darkMode)}>
              Toggle Theme
            </Button>
          </div>
        </div>
      </header>

      <main className="flex min-h-screen items-start justify-center p-6 bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Add cities to begin monitoring current weather and a short
                forecast.
              </p>
            </div>
            <form
              className="flex gap-2 mb-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <Combobox>
                <ComboboxTrigger className="flex-1">
                  <ComboboxInput placeholder="Search city or select" />
                </ComboboxTrigger>
                <ComboboxContent>
                  <ComboboxItem value="London">London</ComboboxItem>
                  <ComboboxItem value="New York">New York</ComboboxItem>
                  <ComboboxItem value="Tokyo">Tokyo</ComboboxItem>
                </ComboboxContent>
              </Combobox>
              <Input placeholder="Or type new city" className="w-64" />
            </form>

            <div className="flex gap-2 mb-6">
              <Button
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => setLoading(false), 800);
                }}
                aria-label="Search city"
              >
                Search
              </Button>
              <Button
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => setLoading(false), 800);
                }}
                aria-label="Add city"
              >
                Add City
              </Button>
              <Button onClick={handleAddCurrentLocation} aria-label="Add current location">
                Use My Location
              </Button>
            </div>
            {error && (
              <div className="mb-4">
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}

            <div>
              <p className="text-sm mb-2">Example loading state:</p>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-12 w-full" />
                  </Card>
                  <Card className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-12 w-full" />
                  </Card>
                  <Card className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-12 w-full" />
                  </Card>
                </div>
              ) : weatherData ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cities.map((c) => {
                    const d = weatherData[c];
                    if (!d)
                      return (
                        <Card key={c} className="p-4">
                          <div className="font-semibold">{c}</div>
                          <div className="text-sm text-muted-foreground">
                            No data
                          </div>
                        </Card>
                      );
                    return (
                      <Card key={c} className="p-4 relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setCities(cities.filter((x) => x !== c))}
                          aria-label={`Remove ${c}`}
                        >
                          Remove
                        </Button>
                        <div className="font-semibold">{d.location.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {d.location.country}
                        </div>
                        <div className="text-2xl font-bold mt-2">
                          {isCelsius ? d.current.temp_c : d.current.temp_f}°{isCelsius ? 'C' : 'F'}
                        </div>
                        <div className="mt-3 w-full space-y-2">
                          <div className="text-sm font-medium">
                            3-Day Forecast
                          </div>
                          <div className="flex gap-2 justify-center">
                            {d.forecast?.forecastday?.map((fd: any) => (
                              <div
                                key={fd.date}
                                className="text-center text-xs"
                              >
                                <div>
                                  {new Date(fd.date).toLocaleDateString()}
                                </div>
                                <div className="font-semibold">
                                  {isCelsius ? fd.day.maxtemp_c : fd.day.maxtemp_f}° / {isCelsius ? fd.day.mintemp_c : fd.day.mintemp_f}°
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No loading activity — try Search or Add City.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
