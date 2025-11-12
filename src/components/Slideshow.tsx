import React, { useState, useEffect } from 'react';
// import WeatherScreen from './screens/WeatherScreen';
import BusTimesScreen from './screens/BusTimesScreen';
import ClockScreen from './screens/ClockScreen';

const screens = [
  { id: 'clock', component: ClockScreen },
  // { id: 'weather', component: WeatherScreen },
  { id: 'bus', component: BusTimesScreen },
];

const SLIDE_DURATION = 9000; // 9 seconds

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
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-violet-900 to-gray-900 overflow-hidden">
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
