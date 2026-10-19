import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../utils/audioEngine.js';
import { getRandomHorrorMessage } from '../utils/horrorMessages.js';
import GhostPremiumModal from './GhostPremiumModal.jsx';

export default function HorrorOverlay({ 
  triggerExpression, 
  onClose, 
  reducedMotion = false 
}) {
  // Horror stages: 1 = glitch, 2 = takeover, 3 = climax, 4 = offer
  const [stage, setStage] = useState(1);
  const [randomMessage, setRandomMessage] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showSubscription, setShowSubscription] = useState(false);
  const canvasRef = useRef(null);

  // Initialize random funny message & sounds
  useEffect(() => {
    setRandomMessage(getRandomHorrorMessage());

    // Stage 1: Glitch & static
    soundEngine.playGlitchStatic();

    const timer1 = setTimeout(() => {
      // Stage 2: Screen takeover & haunted drone
      setStage(2);
      soundEngine.startHorrorDrone();
      soundEngine.playCreepyWhisper();
    }, 1200);

    const timer2 = setTimeout(() => {
      // Stage 3: Jumpscare climax sting & violent zoom
      setStage(3);
      soundEngine.playJumpscareSting();
    }, 2800);

    const timer3 = setTimeout(() => {
      // Transition to subscription offer after climax
      setShowSubscription(true);
    }, 6200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      soundEngine.stopAll();
    };
  }, []);

  // Track cursor for demonic glowing eyes in Stage 2 & 3
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    // Calculate normalized offset (-1 to 1)
    const dx = (clientX - centerX) / (window.innerWidth / 2);
    const dy = (clientY - centerY) / (window.innerHeight / 2);
    setMousePos({ x: dx * 14, y: dy * 14 });
  };

  // Keyboard Escape listener
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        soundEngine.stopAll();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Creeping blood fog / particle canvas
  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 80 + 40,
      alpha: Math.random() * 0.25 + 0.05,
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: -Math.random() * 1.2 - 0.3
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < -100) p.y = height + 100;
        if (p.x < -100) p.x = width + 100;
        if (p.x > width + 100) p.x = -100;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `rgba(180, 0, 0, ${p.alpha})`);
        grad.addColorStop(0.6, `rgba(60, 0, 0, ${p.alpha * 0.4})`);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [reducedMotion]);

  // Replay handler
  const handleReplay = () => {
    setShowSubscription(false);
    setStage(1);
    soundEngine.stopAll();
    soundEngine.playGlitchStatic();

    setTimeout(() => {
      setStage(2);
      soundEngine.startHorrorDrone();
      soundEngine.playCreepyWhisper();
    }, 1100);

    setTimeout(() => {
      setStage(3);
      soundEngine.playJumpscareSting();
    }, 2600);

    setTimeout(() => {
      setShowSubscription(true);
    }, 6000);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className={`fixed inset-0 z-[9999] bg-black text-white overflow-hidden flex flex-col items-center justify-center select-none ${
        !reducedMotion && stage === 3 ? 'horror-shake' : ''
      }`}
    >
      {/* CRT Scanline and Static Overlay */}
      <div className="absolute inset-0 crt-scanlines z-30 opacity-70 pointer-events-none" />

      {/* Horror Blood Vignette */}
      <div className="absolute inset-0 horror-vignette z-20 pointer-events-none" />

      {/* Particle Fog Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none opacity-80" />

      {/* Close / Escape Button */}
      <button
        id="escape-horror-btn"
        onClick={() => {
          soundEngine.stopAll();
          onClose();
        }}
        className="absolute top-4 right-4 z-50 bg-red-950/80 hover:bg-red-800 text-red-200 border border-red-600/60 px-4 py-1.5 rounded-full text-xs font-mono tracking-wider flex items-center gap-1.5 backdrop-blur-md transition-all shadow-lg hover:shadow-red-900/50"
        title="Escape to safety (ESC)"
      >
        <span>✕</span>
        <span>ESCAPE (ESC)</span>
      </button>

      {/* ========================================================= */}
      {/* STAGE 1: CUTE SCREEN GLITCH */}
      {/* ========================================================= */}
      {stage === 1 && (
        <div className="relative z-20 text-center px-4 horror-glitch-stage1">
          <div className="text-6xl sm:text-7xl mb-4 animate-bounce">
            👻
          </div>
          <div className="text-2xl sm:text-4xl font-extrabold text-red-500 font-terminal chromatic-text uppercase tracking-widest">
            SYNTAX CORRUPTION DETECTED
          </div>
          <p className="text-sm sm:text-base text-gray-400 font-mono mt-2">
            Input: <span className="text-red-400 font-bold">{triggerExpression}</span> contains forbidden digits...
          </p>
          <div className="mt-6 flex justify-center items-center gap-2">
            <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
            <span className="text-xs text-red-400 font-mono tracking-widest">CONNECTING TO PARANORMAL REALM...</span>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STAGE 2: SCREEN TAKEOVER & CREEPY TRACKING EYES */}
      {/* ========================================================= */}
      {stage === 2 && (
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 w-full max-w-xl">
          {/* Creepy Demonic Eyes Tracking Cursor */}
          <div className="relative flex items-center justify-center gap-16 sm:gap-24 my-6">
            {/* Left Eye */}
            <div className="relative w-16 h-10 sm:w-20 sm:h-12 bg-black rounded-full border-2 border-red-800/80 shadow-[0_0_25px_rgba(255,0,0,0.8)] flex items-center justify-center overflow-hidden">
              <div 
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-600 shadow-[0_0_12px_#ff0000] flex items-center justify-center transition-transform duration-75"
                style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
              >
                <div className="w-2 h-3 bg-black rounded-full" />
              </div>
            </div>

            {/* Right Eye */}
            <div className="relative w-16 h-10 sm:w-20 sm:h-12 bg-black rounded-full border-2 border-red-800/80 shadow-[0_0_25px_rgba(255,0,0,0.8)] flex items-center justify-center overflow-hidden">
              <div 
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-600 shadow-[0_0_12px_#ff0000] flex items-center justify-center transition-transform duration-75"
                style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
              >
                <div className="w-2 h-3 bg-black rounded-full" />
              </div>
            </div>
          </div>

          <div className="text-2xl sm:text-3xl font-horror tracking-wider text-red-500 mb-2">
            IT WATCHES YOUR EVERY INPUT...
          </div>
          <div className="text-xs sm:text-sm font-mono text-gray-400">
            "You dared to calculate 3 digits without a permit..."
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STAGE 3: HORROR CLIMAX & HIGH FIDELITY JUMPSCARE ARTWORK */}
      {/* ========================================================= */}
      {stage >= 3 && (
        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full max-w-4xl px-4 text-center">
          {/* Ghost Artwork Container with Rapid Zoom */}
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[460px] md:h-[460px] rounded-full overflow-hidden border-4 border-red-900/80 demonic-glow animate-ghost-jumpscare">
            <img 
              src="/assets/spooky_ghost_face.jpg" 
              alt="Terrifying Specter"
              className="w-full h-full object-cover filter contrast-125 brightness-110"
            />
            {/* Red spectral flash */}
            <div className="absolute inset-0 bg-red-600/20 mix-blend-color-dodge animate-pulse" />
          </div>

          {/* Climax Shock Messages */}
          <div className="mt-4 sm:mt-6 space-y-2 max-w-2xl">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-horror text-red-600 chromatic-text tracking-wide uppercase leading-tight">
              👻 YOU SHOULD NOT HAVE CALCULATED THAT!
            </h1>

            <div className="text-base sm:text-2xl font-mono font-bold text-gray-200 tracking-wider">
              THE GHOST KNOWS YOUR ANSWER.
            </div>

            {/* Distorted RUN text animation */}
            <div className="text-red-500 font-extrabold text-xl sm:text-3xl font-terminal tracking-[0.3em] animate-pulse">
              RUN... RUN... RUN...
            </div>

            {/* Random funny horror message badge */}
            <div className="inline-block mt-3 bg-red-950/90 border border-red-500/70 px-4 py-2 rounded-xl text-xs sm:text-sm font-mono text-red-300 shadow-lg">
              "{randomMessage}"
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STAGE 4: GHOST PREMIUM SUBSCRIPTION TWIST MODAL */}
      {/* ========================================================= */}
      {showSubscription && (
        <GhostPremiumModal
          onClose={onClose}
          onReplay={handleReplay}
          triggerExpression={triggerExpression}
        />
      )}
    </div>
  );
}
