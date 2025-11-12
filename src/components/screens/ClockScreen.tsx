import React, { useState, useEffect } from 'react';
import { config } from '../../config/config';

const ClockScreen: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('nl-NL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-white">
      <div className="bg-gradient-to-br from-violet-500/20 to-violet-600/20 backdrop-blur-md border border-violet-400/30 rounded-3xl shadow-2xl p-12">
        <div className="text-center">
          <div className="text-8xl md:text-9xl font-bold mb-6 font-mono tracking-wider text-violet-100">
            {formatTime(currentTime)}
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent my-6"></div>
          <div className="text-3xl md:text-4xl font-light text-gray-200 capitalize">
            {formatDate(currentTime)}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-gray-600/30 rounded-2xl shadow-xl p-6">
        <div className="text-2xl font-semibold mb-2 text-violet-200">{config.center.name}</div>
        <div className="text-lg text-gray-300">{config.center.welcomeMessage}</div>
      </div>
    </div>
  );
};

export default ClockScreen;
