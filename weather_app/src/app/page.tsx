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

  // Commit 6: current weather fetch and basic card display
  const [cities, setCities] = useState<string[]>(["London", "New York", "Tokyo"]);
  const [inputValue, setInputValue] = useState("");
  const [weatherData, setWeatherData] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchForCity(city: string) {
      try {
        const key = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
        const url = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${encodeURIComponent(city)}`;
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
    });
  }, [cities]);

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
            </div>
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
