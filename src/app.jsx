import React, { useState, useEffect } from 'react';
import CuteCalculator from './components/CuteCalculator.jsx';
import CuteMascot from './components/CuteMascot.jsx';
import CuteBackground from './components/CuteBackground.jsx';
import AudioSettings from './components/AudioSettings.jsx';
import HorrorOverlay from './components/HorrorOverlay.jsx';
import { soundEngine } from './utils/audioEngine.js';

export default function App() {
  const [isHorrorActive, setIsHorrorActive] = useState(false);
  const [triggerExpr, setTriggerExpr] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [horrorCount, setHorrorCount] = useState(0);

  // Check prefers-reduced-motion media query on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setReducedMotion(true);
    }
  }, []);

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundEngine.setEnabled(nextState);
    if (nextState) {
      soundEngine.playCuteClick(1.5);
    }
  };

  const handleToggleReducedMotion = () => {
    setReducedMotion(prev => !prev);
  };

  const handleTriggerHorror = (expression) => {
    setTriggerExpr(expression);
    setIsHorrorActive(true);
    setHorrorCount(prev => prev + 1);
  };

  const handleCloseHorror = () => {
    setIsHorrorActive(false);
    setTriggerExpr('');
  };

  return (
    <div className={`relative min-h-screen flex flex-col justify-between text-gray-800 ${
      reducedMotion ? 'reduced-motion-active' : ''
    }`}>
      {/* Background with floating pastel particles */}
      <CuteBackground reducedMotion={reducedMotion} />

      {/* Top Navigation Bar */}
      <header className="relative z-20 w-full max-w-5xl mx-auto px-4 py-4 sm:py-6 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl animate-bounce">💖</span>
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            CuteCalc
          </span>
          <span className="text-xs bg-pink-100 text-pink-600 font-bold px-2 py-0.5 rounded-full border border-pink-200">
            Aesthetic 🌸
          </span>
        </div>

        {/* Audio and Accessibility Controls */}
        <AudioSettings
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          reducedMotion={reducedMotion}
          onToggleReducedMotion={handleToggleReducedMotion}
        />
      </header>

      {/* Main Hero & Calculator Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-8 max-w-4xl mx-auto w-full">
        {/* Cute Headings Required by User Prompt */}
        <div className="text-center mb-6 sm:mb-8 space-y-2">
          <div className="inline-block bg-white/70 backdrop-blur-sm border border-pink-200 text-pink-600 font-medium text-xs px-3.5 py-1 rounded-full shadow-sm mb-1">
            ✨ CuteCalc 👻 — Love at First Calculation, Fear at First Result
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-800 tracking-tight">
            💕 Welcome to CuteCalc 💕
          </h1>
          <p className="text-sm sm:text-base font-medium text-pink-600/90 max-w-md mx-auto">
            Your little calculator with a <span className="font-bold underline decoration-pink-300">BIG</span> personality.
          </p>
        </div>

        {/* Content Layout: Mascot on left/top, Calculator on right/center */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-10">
          {/* Animated Cute Mascot */}
          <CuteMascot />

          {/* Calculator Card */}
          <CuteCalculator
            onTriggerHorror={handleTriggerHorror}
            soundEnabled={soundEnabled}
            reducedMotion={reducedMotion}
          />
        </div>

        {/* Playful secret hint cards */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500">
          <span className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full border border-pink-200/60">
            🌸 Innocent tip: 12 + 5 = 17 works fine!
          </span>
          <span className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full border border-pink-200/60">
            🤫 Shh: What happens with 3 or more digits?
          </span>
          {horrorCount > 0 && (
            <span className="bg-red-50 text-red-600 font-bold px-3 py-1 rounded-full border border-red-200">
              👻 Nightmares survived: {horrorCount}
            </span>
          )}
        </div>
      </main>

      {/* Footer with Required Tagline */}
      <footer className="relative z-10 w-full py-4 text-center border-t border-pink-200/40 bg-white/30 backdrop-blur-sm">
        <p className="text-xs sm:text-sm font-semibold text-pink-600">
          “Cute on the outside. Haunted on the inside. 💖👻”
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5">
          CuteCalc is a fun, cinematic interactive project. Fictional horror only — no real ghosts harmed in calculations.
        </p>
      </footer>

      {/* Full-Screen Ghost Jumpscare & Horror Overlay */}
      {isHorrorActive && (
        <HorrorOverlay
          triggerExpression={triggerExpr}
          onClose={handleCloseHorror}
          reducedMotion={reducedMotion}
        />
      )}
    </div>
  );
}
