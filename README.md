# 📺 Community TV Display

A modern, beautiful TV display application for community centers, built with React, TypeScript, Vite, and **Tailwind CSS**.

![Built with React](https://img.shields.io/badge/React-19.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-violet)

## ✨ Features

- 🕐 **Clock Screen** - Large, easy-to-read time and date display
- 🌤️ **Weather Screen** - Current conditions and 5-day forecast for Alkmaar
- 🚌 **Bus Times Screen** - Real-time bus departure information
- 🎨 **Modern UI** - Beautiful gray and violet color scheme with glassmorphism effects
- 🔄 **Auto-rotating** - Cycles through screens every 15 seconds
- 📱 **Responsive** - Optimized for TV displays
- ⚡ **Lightweight** - Pure Tailwind CSS, no component library overhead

## 🎨 Design System

This project uses a custom **gray and violet** color scheme with Tailwind CSS:

- 🟣 **Violet accents** - Primary highlights and interactive elements
- ⚫ **Gray tones** - Backgrounds and secondary elements
- ✨ **Glassmorphism** - Modern frosted glass effects with backdrop blur
- 🎭 **Smooth transitions** - Hover effects and animations throughout

## 🚀 Quick Start

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd tv-project

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
tv-project/
├── src/
│   ├── components/
│   │   ├── screens/               # Screen components
│   │   │   ├── ClockScreen.tsx
│   │   │   ├── WeatherScreen.tsx
│   │   │   └── BusTimesScreen.tsx
│   │   └── Slideshow.tsx          # Main slideshow component
│   ├── config/
│   │   └── config.ts              # App configuration
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
└── package.json
```

## ⚙️ Configuration

Edit `src/config/config.ts` to customize:

```typescript
export const config = {
  weather: {
    apiKey: '',                    // OpenWeatherMap API key
    location: {
      lat: 52.6317,                // Alkmaar coordinates
      lon: 4.7481,
      name: 'Alkmaar',
    },
    updateInterval: 10 * 60 * 1000, // 10 minutes
  },
  transport: {
    apiUrl: 'https://v0.ovapi.nl/stopareacode/amrasl/',
    stopName: 'Asselijnstraat',
    allowedDestinations: ['Oud Overdie', 'Alkmaar Station'],
    updateInterval: 30 * 1000,      // 30 seconds
  },
  slideshow: {
    slideDuration: 15 * 1000,       // 15 seconds
    fadeDuration: 500,              // 0.5 seconds
  },
  center: {
    name: 'Buurthuis Overdie Ontmoet',
    welcomeMessage: 'Welkom • Welcome • مرحباً',
  },
};
```

## 🎨 Customizing the Theme

The color scheme uses Tailwind's built-in colors. To customize, edit the component files:

**Violet shades used:**
- `violet-100` - Light text
- `violet-200` - Headings
- `violet-400` - Borders and dividers
- `violet-500` - Interactive elements
- `violet-600` - Primary buttons/badges
- `violet-900` - Background gradient

**Gray shades used:**
- `gray-200` - Light text
- `gray-300` - Secondary text
- `gray-400` - Muted text
- `gray-600` - Borders
- `gray-700` - Card backgrounds
- `gray-800` - Dark backgrounds
- `gray-900` - Darkest backgrounds

## 🛠️ Tech Stack

- **React 19.1** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 7.1** - Build tool
- **Tailwind CSS 3.4** - Utility-first CSS framework

## 🌐 APIs Used

- **OVapi** - Dutch public transport real-time data
- **OpenWeatherMap** - Weather data (optional, uses mock data by default)

## 📱 Screens

### 1. Clock Screen
- Large time display with seconds in violet tones
- Full date in Dutch format
- Community center welcome message
- Glassmorphism card with violet gradient

### 2. Weather Screen
- Current temperature and conditions
- Humidity and wind speed in gray badges
- 5-day forecast with hover effects
- Smooth loading animations

### 3. Bus Times Screen
- Real-time departure information
- Violet badges for bus line numbers
- Color-coded status (green for on-time, red for delays)
- Platform information in gray badges
- Auto-refresh every 30 seconds

## 🎯 Features in Detail

### Glassmorphism Design
Cards use modern frosted glass effects with violet/gray gradients:
```tsx
className="bg-gradient-to-br from-violet-500/20 to-violet-600/20 backdrop-blur-md border border-violet-400/30"
```

### Loading States
Smooth pulse animations while data loads:
```tsx
<div className="text-4xl animate-pulse text-violet-200">Loading...</div>
```

### Color-Coded Elements
- **Violet** - Primary elements, headings, bus line numbers
- **Red** - Delays and warnings
- **Green** - On-time departures
- **Gray** - Secondary information, platforms

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

Quick deploy:
```bash
npm run build
# Upload dist/ folder to your web server
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [OVapi](https://ovapi.nl) - Dutch public transport API
- [OpenWeatherMap](https://openweathermap.org) - Weather API

---

**Made with ❤️ for community centers**
