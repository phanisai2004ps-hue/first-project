import React, { useState } from 'react';
import { getRandomMascotQuote } from '../utils/horrorMessages.js';
import { soundEngine } from '../utils/audioEngine.js';

export default function CuteMascot({ digitCount = 0 }) {
  const [quote, setQuote] = useState("Hi! I'm Calcy! Let's do some sweet math together! 💖");
  const [isWiggling, setIsWiggling] = useState(false);

  const handleMascotClick = () => {
    setIsWiggling(true);
    soundEngine.playCuteClick(1.4);
    setTimeout(() => soundEngine.playCuteClick(1.8), 100);
    setQuote(getRandomMascotQuote());
    setTimeout(() => setIsWiggling(false), 600);
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Speech Bubble */}
      <div className="relative mb-3 max-w-[260px] sm:max-w-[300px]">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border-2 border-pink-200 shadow-md text-center text-xs sm:text-sm font-medium text-pink-700 leading-snug">
          {quote}
        </div>
        {/* Triangle arrow */}
        <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-pink-200 mx-auto" />
      </div>

      {/* Mascot Card */}
      <div 
        onClick={handleMascotClick}
        className={`relative cursor-pointer transition-transform duration-300 ${
          isWiggling ? 'scale-110 rotate-6' : 'hover:scale-105'
        }`}
        title="Click me for cute love!"
      >
        {/* Soft Pink Aura */}
        <div className="absolute -inset-2 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 rounded-3xl blur-md opacity-60 animate-pulse" />

        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-white/90 shadow-xl bg-pink-100 flex items-center justify-center animate-mascot">
          <img 
            src="/assets/cute_calc_mascot.jpg" 
            alt="CuteCalc Mascot" 
            className="w-full h-full object-cover"
          />

          {/* Interactive heart badge */}
          <div className="absolute top-1.5 right-1.5 bg-white/90 text-xs px-1.5 py-0.5 rounded-full shadow-sm text-pink-500 font-bold flex items-center gap-0.5">
            <span>✨</span>
          </div>
        </div>

        {/* Mascot Name Pill */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-md whitespace-nowrap">
          Calcy 💕
        </div>
      </div>
    </div>
  );
}
