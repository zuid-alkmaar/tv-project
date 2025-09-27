import React, { useState, useEffect } from 'react';

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
      <div className="text-center">
        <div className="text-8xl md:text-9xl font-bold mb-4 font-mono tracking-wider">
          {formatTime(currentTime)}
        </div>
        <div className="text-3xl md:text-4xl font-light opacity-90 capitalize">
          {formatDate(currentTime)}
        </div>
      </div>
      
      <div className="absolute bottom-8 left-8">
        <div className="text-2xl font-semibold">Community Center Zuid-Alkmaar</div>
        <div className="text-lg opacity-75">Welkom • Welcome • Bienvenido</div>
      </div>
    </div>
  );
};

export default ClockScreen;
