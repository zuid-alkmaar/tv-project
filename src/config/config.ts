// Configuration for the Community TV Display

export const config = {
  // Weather API Configuration
  weather: {
    // Get your free API key from: https://openweathermap.org/api
    apiKey: import.meta.env.VITE_WEATHER_API_KEY || '',
    // Coordinates for Alkmaar, Netherlands
    location: {
      lat: 52.6317,
      lon: 4.7481,
      name: 'Alkmaar',
    },
    // Update interval in milliseconds (10 minutes)
    updateInterval: 10 * 60 * 1000,
  },

  // Public Transport Configuration
  transport: {
    // Using OVapi for real-time Dutch public transport data
    // API endpoint for Asselijnstraat bus stop
    apiUrl: 'https://v0.ovapi.nl/stopareacode/amrasl/',
    stopName: 'Asselijnstraat',
    // Filter destinations - only show these destinations
    allowedDestinations: ['Oud Overdie', 'Alkmaar Station'],
    updateInterval: 30 * 1000, // 30 seconds
  },

  // Slideshow Configuration
  slideshow: {
    // Duration each slide is shown (in milliseconds)
    slideDuration: 15 * 1000, // 15 seconds
    // Fade transition duration (in milliseconds)
    fadeDuration: 500, // 0.5 seconds
  },

  // Community Center Information
  center: {
    name: 'Buurthuis Overdie Ontmoet',
    welcomeMessage: 'Welkom • Welcome • مرحباً',
  },
};

// Helper function to check if APIs are configured
export const isWeatherConfigured = () => !!config.weather.apiKey;
export const isTransportConfigured = () => !!config.transport.apiUrl;
