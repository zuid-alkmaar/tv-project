import React, { useState, useEffect } from 'react';
import WeatherScreen from './screens/WeatherScreen';
import BusTimesScreen from './screens/BusTimesScreen';
import ClockScreen from './screens/ClockScreen';

const screens = [
  { id: 'clock', component: ClockScreen },
  { id: 'weather', component: WeatherScreen },
  { id: 'bus', component: BusTimesScreen },
];

const SLIDE_DURATION = 15000; // 15 seconds

const Slideshow: React.FC = () => {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out
      setIsVisible(false);
      
      // After fade out completes, change screen and fade in
      setTimeout(() => {
        setCurrentScreenIndex((prev) => (prev + 1) % screens.length);
        setIsVisible(true);
      }, 500); // Match the fade duration
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, []);

  const CurrentScreen = screens[currentScreenIndex].component;

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 overflow-hidden">
      <div
        className={`w-full h-full transition-opacity duration-500 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <CurrentScreen />
      </div>
    </div>
  );
};

export default Slideshow;
