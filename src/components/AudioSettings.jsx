import React from 'react';

export default function AudioSettings({ 
  soundEnabled, 
  onToggleSound, 
  reducedMotion, 
  onToggleReducedMotion 
}) {
  return (
    <div className="flex items-center gap-2.5 bg-white/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-pink-200/80 shadow-sm">
      {/* Sound Toggle Button */}
      <button
        id="sound-toggle-btn"
        onClick={onToggleSound}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
          soundEnabled 
            ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm shadow-pink-300' 
            : 'bg-white/80 text-gray-500 hover:text-pink-600'
        }`}
        title={soundEnabled ? 'Sound is Enabled (Click to mute)' : 'Sound is Muted (Click to enable audio)'}
      >
        <span>{soundEnabled ? '🔊' : '🔇'}</span>
        <span className="hidden sm:inline">
          {soundEnabled ? 'Sound On' : 'Muted'}
        </span>
        {soundEnabled && (
          <span className="flex items-center gap-0.5 ml-1">
            <span className="w-0.5 h-2 bg-white animate-pulse" />
            <span className="w-0.5 h-3 bg-white animate-pulse delay-75" />
            <span className="w-0.5 h-1.5 bg-white animate-pulse delay-150" />
          </span>
        )}
      </button>

      <span className="text-pink-200">|</span>

      {/* Reduced Motion Toggle Button */}
      <button
        id="reduced-motion-btn"
        onClick={onToggleReducedMotion}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
          reducedMotion 
            ? 'bg-purple-600 text-white shadow-sm' 
            : 'bg-white/80 text-gray-500 hover:text-purple-600'
        }`}
        title="Toggle reduced motion accessibility mode"
      >
        <span>{reducedMotion ? '🛡️' : '✨'}</span>
        <span className="hidden sm:inline">
          {reducedMotion ? 'Reduced Motion' : 'Animations On'}
        </span>
      </button>
    </div>
  );
}
