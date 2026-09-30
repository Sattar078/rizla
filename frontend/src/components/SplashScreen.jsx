import React, { useState, useEffect } from 'react';

const SplashScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start fade out at 4.5 seconds
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 4500);

    // Completely remove the splash screen at 5 seconds
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete(); // Tell the app to show the main content
    }, 5000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-9999 bg-gray-950 flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center justify-center animate-pulse-slow">
        {/* Coat Hanger Icon */}
        <svg
          className="w-20 h-20 text-white mb-6 animate-bounce"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v4M12 6c-3 0-5.5 2-6.5 4.5l-4 9.5h21l-4-9.5C17.5 8 15 6 12 6z"/>
          <path d="M12 6a2 2 0 100-4 2 2 0 000 4z"/>
        </svg>

        {/* Brand Name */}
        <h1 className="text-6xl md:text-8xl font-black tracking-[0.2em] text-white uppercase text-center ml-4">
          Rizla
        </h1>

        {/* Subtitle */}
        <p className="mt-8 text-sm md:text-base tracking-[0.5em] text-gray-400 font-medium uppercase text-center">
          Boutique
        </p>

        {/* Loading Bar */}
        <div className="absolute -bottom-24 w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full animate-loading-bar"></div>
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { width: 0%; }
          10% { width: 10%; }
          50% { width: 60%; }
          100% { width: 100%; }
        }
        .animate-loading-bar {
          animation: loading-bar 4.5s ease-in-out forwards;
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
