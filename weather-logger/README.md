# Weather Logger (JavaScript/Hono)

A modern web-based weather application built with Hono, Bun, and WeatherAPI.com.

## Features

- 🌤️ Real-time weather data
- 📅 3-day weather forecast
- 🕐 Timezone information
- 🚨 Weather alerts
- 🌬️ Air quality data (optional)
- 🌍 Multi-language support
- 📱 Responsive web interface

## Tech Stack

- **Framework**: Hono (lightweight web framework)
- **Runtime**: Bun
- **Language**: TypeScript
- **Styling**: Tailwind CSS (via CDN)
- **API**: WeatherAPI.com

## Installation

1. Clone or navigate to the project directory
2. Install dependencies:

   ```bash
   bun install
   ```

3. Get your API key from [WeatherAPI.com](https://www.weatherapi.com/)
4. Update the `.env` file with your API key:
   ```
   WEATHER_API_KEY=your_api_key_here
   ```

## Usage

### Development

```bash
bun run dev
```

### Production

```bash
bun run start
```

The application will be available at `http://localhost:3000`

## API Endpoints

- `GET /` - Main web interface
- `GET /api/weather/current?q={location}` - Current weather
- `GET /api/weather/forecast?q={location}&days=3&aqi=no` - Weather forecast
- `GET /api/weather/timezone?q={location}` - Timezone information
- `GET /api/weather/alerts?q={location}` - Weather alerts
- `GET /api/weather/history?q={location}&dt=2024-01-01` - Historical weather

## Query Parameters

- `q`: Location (city name, coordinates, zip code, etc.)
- `lang`: Language code (default: 'en')
- `days`: Number of forecast days (default: 3)
- `aqi`: Include air quality data ('yes'/'no', default: 'no')
- `dt`: Date for historical data (YYYY-MM-DD format)

## Features

### Web Interface

- Clean, modern UI with gradient backgrounds
- Responsive design for mobile and desktop
- Real-time weather updates
- Interactive location search
- Multi-language support
- Air quality toggle

### API Integration

- Comprehensive error handling
- TypeScript interfaces for type safety
- Environment variable configuration
- CORS support for API access

## Development

The application uses:

- **Hono**: For routing and middleware
- **Bun**: As the JavaScript runtime
- **TypeScript**: For type safety
- **Tailwind CSS**: For styling (via CDN)
- **WeatherAPI.com**: For weather data

## License

This project is for educational purposes.
