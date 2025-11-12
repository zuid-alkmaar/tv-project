import React, { useState, useEffect } from 'react';

interface WeatherData {
  current: {
    temperature: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
  };
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    description: string;
    icon: string;
  }>;
}

const WeatherScreen: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // For demo purposes, using mock data
        // To use real weather data, you would:
        // 1. Get an API key from OpenWeatherMap (free)
        // 2. Replace the mock data with actual API calls
        // 3. Use coordinates for Alkmaar: lat=52.6317, lon=4.7481

        const mockWeatherData: WeatherData = {
          current: {
            temperature: Math.round(15 + Math.random() * 10), // Random temp between 15-25°C
            description: 'Partly Cloudy',
            icon: '⛅',
            humidity: Math.round(50 + Math.random() * 30), // Random humidity 50-80%
            windSpeed: Math.round(5 + Math.random() * 15), // Random wind 5-20 km/h
          },
          forecast: [
            { day: 'Today', high: 20, low: 15, description: 'Partly Cloudy', icon: '⛅' },
            { day: 'Tomorrow', high: 22, low: 16, description: 'Sunny', icon: '☀️' },
            { day: 'Friday', high: 19, low: 14, description: 'Light Rain', icon: '🌦️' },
            { day: 'Saturday', high: 17, low: 12, description: 'Cloudy', icon: '☁️' },
            { day: 'Sunday', high: 21, low: 15, description: 'Sunny', icon: '☀️' },
          ],
        };

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setWeather(mockWeatherData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
        setLoading(false);
      }
    };

    fetchWeatherData();

    // Refresh weather data every 10 minutes
    const interval = setInterval(fetchWeatherData, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        <div className="text-4xl animate-pulse text-violet-200">Het weer in Alkmaar laden...</div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        <div className="text-4xl text-gray-300">Weergegevens onbeschikbaar</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full text-white p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-2 text-violet-100">Het weer in Alkmaar</h1>
        <div className="text-2xl text-gray-300">Huidige weersomstandigheden</div>
      </div>

      {/* Current Weather */}
      <div className="flex items-center justify-center mb-12">
        <div className="bg-gradient-to-br from-violet-500/20 to-violet-600/20 backdrop-blur-md border border-violet-400/30 rounded-3xl shadow-2xl p-8">
          <div className="text-center">
            <div className="text-8xl mb-4">{weather.current.icon}</div>
            <div className="text-7xl font-bold mb-2 text-violet-100">{weather.current.temperature}°C</div>
            <div className="text-3xl text-gray-200 mb-6">{weather.current.description}</div>
            <div className="h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent my-4"></div>
            <div className="flex gap-8 mt-6 text-xl justify-center">
              <div className="bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-2 text-gray-200">
                💧 {weather.current.humidity}%
              </div>
              <div className="bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-2 text-gray-200">
                💨 {weather.current.windSpeed} km/h
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="flex-1">
        <h2 className="text-3xl font-semibold mb-6 text-center text-violet-200">5-Day Forecast</h2>
        <div className="grid grid-cols-5 gap-4">
          {weather.forecast.map((day, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-700/40 to-gray-800/40 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-4 text-center hover:border-violet-400/50 transition-all duration-300">
              <div className="text-xl font-semibold mb-2 text-violet-200">{day.day}</div>
              <div className="text-4xl mb-2">{day.icon}</div>
              <div className="text-lg font-bold text-gray-100">{day.high}°</div>
              <div className="text-sm text-gray-400">{day.low}°</div>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-500/30 to-transparent my-2"></div>
              <div className="text-sm mt-2 text-gray-300">{day.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherScreen;
