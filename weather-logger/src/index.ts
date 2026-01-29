import { Hono } from "hono";
import { config } from "dotenv";

// Load environment variables
config();

const app = new Hono();

// Configuration
const WEATHER_API_BASE = "http://api.weatherapi.com/v1";
const WEATHER_API_KEY =
  process.env.WEATHER_API_KEY || "d4ac7af8dcbd4c8ea56232156252512";

// Types
interface WeatherLocation {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
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

// Utility functions
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

// API Routes
app.get("/api/weather/current", async (c) => {
  try {
    const location = c.req.query("q");
    if (!location) {
      return c.json({ error: "Location parameter (q) is required" }, 400);
    }

    const lang = c.req.query("lang") || "en";
    const data = await makeWeatherAPIRequest("current.json", {
      q: location,
      lang,
    });

    return c.json({
      location: data.location,
      current: data.current,
    });
  } catch (error) {
    return c.json({ error: "Failed to fetch current weather" }, 500);
  }
});

app.get("/api/weather/forecast", async (c) => {
  try {
    const location = c.req.query("q");
    const days = c.req.query("days") || "3";
    const aqi = c.req.query("aqi") || "no";
    const alerts = c.req.query("alerts") || "yes";
    const lang = c.req.query("lang") || "en";

    if (!location) {
      return c.json({ error: "Location parameter (q) is required" }, 400);
    }

    const data = await makeWeatherAPIRequest("forecast.json", {
      q: location,
      days,
      aqi,
      alerts,
      lang,
    });

    return c.json({
      location: data.location,
      forecast: data.forecast,
      alerts: data.alerts,
    });
  } catch (error) {
    return c.json({ error: "Failed to fetch forecast" }, 500);
  }
});

app.get("/api/weather/timezone", async (c) => {
  try {
    const location = c.req.query("q");
    if (!location) {
      return c.json({ error: "Location parameter (q) is required" }, 400);
    }

    const data = await makeWeatherAPIRequest("timezone.json", { q: location });
    return c.json(data);
  } catch (error) {
    return c.json({ error: "Failed to fetch timezone" }, 500);
  }
});

app.get("/api/weather/alerts", async (c) => {
  try {
    const location = c.req.query("q");
    if (!location) {
      return c.json({ error: "Location parameter (q) is required" }, 400);
    }

    const data = await makeWeatherAPIRequest("alerts.json", { q: location });
    return c.json(data);
  } catch (error) {
    return c.json({ error: "Failed to fetch alerts" }, 500);
  }
});

app.get("/api/weather/history", async (c) => {
  try {
    const location = c.req.query("q");
    const date = c.req.query("dt");

    if (!location) {
      return c.json({ error: "Location parameter (q) is required" }, 400);
    }
    if (!date) {
      return c.json({ error: "Date parameter (dt) is required" }, 400);
    }

    const data = await makeWeatherAPIRequest("history.json", {
      q: location,
      dt: date,
    });
    return c.json(data);
  } catch (error) {
    return c.json({ error: "Failed to fetch historical weather" }, 500);
  }
});

// Frontend route
app.get("/", (c) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weather Logger</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .weather-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 1rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .forecast-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
    </style>
</head>
<body class="bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-white mb-2">🌤️ Weather Logger</h1>
            <p class="text-white/80">Powered by WeatherAPI.com</p>
        </div>

        <div class="max-w-2xl mx-auto mb-8">
            <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <div class="flex gap-4 mb-4">
                    <input
                        type="text"
                        id="location"
                        placeholder="Enter city name..."
                        class="flex-1 px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    >
                    <button
                        id="searchBtn"
                        class="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                    >
                        🔍 Search
                    </button>
                </div>
                <div class="flex gap-2">
                    <label class="flex items-center text-white/80">
                        <input type="checkbox" id="aqi" class="mr-2"> Air Quality
                    </label>
                    <select id="lang" class="px-3 py-1 rounded border border-white/20 bg-white/10 text-white">
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                    </select>
                </div>
            </div>
        </div>

        <div id="loading" class="hidden text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p class="text-white mt-2">Loading weather data...</p>
        </div>

        <div id="error" class="hidden max-w-2xl mx-auto mb-8">
            <div class="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <p id="errorText" class="text-red-200"></p>
            </div>
        </div>

        <div id="weather" class="hidden">
            <!-- Current Weather -->
            <div class="weather-card p-6 mb-6">
                <div class="text-center text-white">
                    <h2 id="locationName" class="text-2xl font-bold mb-2"></h2>
                    <div class="flex items-center justify-center mb-4">
                        <img id="weatherIcon" class="w-16 h-16 mr-4" alt="Weather icon">
                        <div>
                            <div id="temperature" class="text-4xl font-bold"></div>
                            <div id="condition" class="text-lg"></div>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>💧 <span id="humidity"></span>% Humidity</div>
                        <div>💨 <span id="wind"></span> km/h</div>
                        <div>👁️ <span id="visibility"></span> km</div>
                        <div>☀️ UV <span id="uv"></span></div>
                    </div>
                </div>
            </div>

            <!-- Forecast -->
            <div id="forecast" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <!-- Forecast cards will be inserted here -->
            </div>

            <!-- Additional Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="forecast-card p-4 rounded-lg">
                    <h3 class="text-white font-bold mb-2">🕐 Timezone</h3>
                    <p id="timezone" class="text-white/80"></p>
                </div>
                <div class="forecast-card p-4 rounded-lg">
                    <h3 class="text-white font-bold mb-2">🚨 Alerts</h3>
                    <div id="alerts" class="text-white/80"></div>
                </div>
            </div>
        </div>
    </div>

    <script>
        const locationInput = document.getElementById('location')
        const searchBtn = document.getElementById('searchBtn')
        const aqiCheckbox = document.getElementById('aqi')
        const langSelect = document.getElementById('lang')
        const loading = document.getElementById('loading')
        const error = document.getElementById('error')
        const errorText = document.getElementById('errorText')
        const weather = document.getElementById('weather')

        async function fetchWeather(location) {
            try {
                loading.classList.remove('hidden')
                error.classList.add('hidden')
                weather.classList.add('hidden')

                const aqi = aqiCheckbox.checked ? 'yes' : 'no'
                const lang = langSelect.value

                // Fetch current weather
                const currentResponse = await fetch(\`/api/weather/current?q=\${encodeURIComponent(location)}&lang=\${lang}\`)
                if (!currentResponse.ok) throw new Error('Failed to fetch current weather')
                const currentData = await currentResponse.json()

                // Fetch forecast
                const forecastResponse = await fetch(\`/api/weather/forecast?q=\${encodeURIComponent(location)}&days=3&aqi=\${aqi}&lang=\${lang}\`)
                if (!forecastResponse.ok) throw new Error('Failed to fetch forecast')
                const forecastData = await forecastResponse.json()

                // Fetch timezone
                const timezoneResponse = await fetch(\`/api/weather/timezone?q=\${encodeURIComponent(location)}\`)
                const timezoneData = await timezoneResponse.json()

                displayWeather(currentData, forecastData, timezoneData)

            } catch (err) {
                errorText.textContent = err.message
                error.classList.remove('hidden')
            } finally {
                loading.classList.add('hidden')
            }
        }

        function displayWeather(current, forecast, timezone) {
            // Current weather
            document.getElementById('locationName').textContent =
                \`\${current.location.name}, \${current.location.region}, \${current.location.country}\`
            document.getElementById('weatherIcon').src = 'https:' + current.current.condition.icon
            document.getElementById('temperature').textContent = \`\${current.current.temp_c}°C\`
            document.getElementById('condition').textContent = current.current.condition.text
            document.getElementById('humidity').textContent = current.current.humidity
            document.getElementById('wind').textContent = current.current.wind_kph
            document.getElementById('visibility').textContent = current.current.vis_km
            document.getElementById('uv').textContent = current.current.uv

            // Forecast
            const forecastContainer = document.getElementById('forecast')
            forecastContainer.innerHTML = ''

            forecast.forecast.forecastday.forEach(day => {
                const date = new Date(day.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                })

                const card = document.createElement('div')
                card.className = 'forecast-card p-4 rounded-lg text-center'
                card.innerHTML = \`
                    <h4 class="text-white font-bold mb-2">\${date}</h4>
                    <img src="https:\${day.day.condition.icon}" class="w-12 h-12 mx-auto mb-2" alt="Weather">
                    <p class="text-white/80 text-sm">\${day.day.condition.text}</p>
                    <p class="text-white font-bold">\${day.day.mintemp_c}° - \${day.day.maxtemp_c}°C</p>
                    <p class="text-white/60 text-xs">\${day.day.daily_chance_of_rain}% rain</p>
                \`
                forecastContainer.appendChild(card)
            })

            // Timezone
            document.getElementById('timezone').textContent =
                \`\${timezone.location.tz_id} (\${timezone.location.localtime})\`

            // Alerts
            const alertsContainer = document.getElementById('alerts')
            const alerts = forecast.alerts?.alert || []
            if (alerts.length > 0) {
                alertsContainer.innerHTML = alerts.map(alert =>
                    \`<div class="mb-2 p-2 bg-red-500/20 rounded">🚨 \${alert.headline}</div>\`
                ).join('')
            } else {
                alertsContainer.textContent = 'No active alerts'
            }

            weather.classList.remove('hidden')
        }

        searchBtn.addEventListener('click', () => {
            const location = locationInput.value.trim()
            if (location) {
                fetchWeather(location)
            }
        })

        locationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchBtn.click()
            }
        })

        // Load default location on page load
        window.addEventListener('load', () => {
            locationInput.value = 'London'
            fetchWeather('London')
        })
    </script>
</body>
</html>
  `;
  return c.html(html);
});

export default app;
