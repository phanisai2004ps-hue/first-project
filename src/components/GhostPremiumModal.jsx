import React, { useState } from 'react';
import { soundEngine } from '../utils/audioEngine.js';

export default function GhostPremiumModal({ onClose, onReplay, triggerExpression }) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('plan'); // 'plan' | 'processing' | 'success'

  const handleStartCheckout = () => {
    soundEngine.playCuteClick(1.2);
    setShowCheckout(true);
    setCheckoutStep('processing');
    setTimeout(() => {
      setCheckoutStep('success');
      soundEngine.playCuteSuccess();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      {!showCheckout ? (
        /* Main Ghost Premium Card */
        <div className="relative w-full max-w-md bg-gradient-to-b from-gray-900 via-purple-950/70 to-black border-2 border-red-500/70 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(255,0,0,0.4)] text-center text-white animate-ghost-jumpscare">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-red-600/30 border border-red-500/60 text-red-300 text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3">
            <span>👻</span>
            <span>PARANORMAL UPGRADE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1">
            GHOST PREMIUM
          </h2>
          <div className="text-xl sm:text-2xl font-black text-red-400 font-mono mb-3">
            ₹99 <span className="text-sm font-normal text-gray-400">/ month</span>
          </div>

          <p className="text-sm text-gray-300 italic mb-5 leading-relaxed">
            “Unlock unlimited calculations. Keep the ghosts guessing.”
          </p>

          {/* Features list */}
          <div className="space-y-2 text-left bg-black/40 border border-gray-800 rounded-2xl p-4 mb-6 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-gray-200">
              <span className="text-red-400 font-bold">✓</span>
              <span>Calculate 3, 4, or 100 digits without demonic summon</span>
            </div>
            <div className="flex items-center gap-2 text-gray-200">
              <span className="text-red-400 font-bold">✓</span>
              <span>Exorcism-grade arithmetic algorithm</span>
            </div>
            <div className="flex items-center gap-2 text-gray-200">
              <span className="text-red-400 font-bold">✓</span>
              <span>Paranormal anti-jumpscare shield</span>
            </div>
            <div className="flex items-center gap-2 text-gray-200">
              <span className="text-red-400 font-bold">✓</span>
              <span>24/7 Spectral customer support</span>
            </div>
          </div>

          {/* Action Buttons Required by User Prompt */}
          <div className="flex flex-col gap-2.5">
            {/* Unlock Ghost Premium */}
            <button
              id="unlock-premium-btn"
              onClick={handleStartCheckout}
              className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-900/60 transition-all flex items-center justify-center gap-2 text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>💎</span>
              <span>Unlock Ghost Premium</span>
            </button>

            {/* Dare to Calculate Again */}
            <button
              id="dare-again-btn"
              onClick={() => {
                soundEngine.stopAll();
                onClose();
              }}
              className="w-full bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 border border-purple-500/50 font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <span>🔄</span>
              <span>Dare to Calculate Again</span>
            </button>

            {/* Escape to Calculator */}
            <button
              id="escape-calculator-btn"
              onClick={() => {
                soundEngine.stopAll();
                onClose();
              }}
              className="w-full bg-gray-800/70 hover:bg-gray-700 text-gray-300 font-medium py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs"
            >
              <span>👻</span>
              <span>Escape to Calculator</span>
            </button>

            {/* Replay Sequence Button */}
            <button
              id="replay-horror-btn"
              onClick={onReplay}
              className="text-[11px] text-gray-500 hover:text-red-400 font-mono underline transition-colors pt-1"
            >
              🎬 Replay Horror Jumpscare Sequence
            </button>
          </div>
        </div>
      ) : (
        /* Demo Checkout Flow Modal */
        <div className="relative w-full max-w-sm bg-gray-900 border border-gray-700 rounded-3xl p-6 text-center text-white shadow-2xl">
          {checkoutStep === 'processing' && (
            <div className="py-8 space-y-4">
              <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <h3 className="text-lg font-bold">Transferring Soul Currency...</h3>
              <p className="text-xs text-gray-400 font-mono">
                Negotiating contract with mathematics phantom...
              </p>
              <div className="text-[10px] text-yellow-500 bg-yellow-950/40 border border-yellow-800/60 px-3 py-1 rounded-full">
                ⚠️ DEMO PAYMENT SIMULATION — NO REAL CHARGES
              </div>
            </div>
          )}

          {checkoutStep === 'success' && (
            <div className="space-y-4 py-4">
              <div className="text-5xl">🎉👻</div>
              <h3 className="text-xl font-bold text-green-400">
                Ghost Premium Demo Activated!
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                You are now protected by the Spectral Shield. This was a harmless humorous demo simulation. No actual payment was taken!
              </p>
              <div className="p-3 bg-gray-800/80 rounded-xl text-left text-xs font-mono text-gray-300 space-y-1">
                <div>Receipt: <span className="text-green-400">#DEMO-GHOST-666</span></div>
                <div>Amount: <span className="text-green-400">₹0.00 (Demo Mode)</span></div>
                <div>Status: <span className="text-green-400">Temporarily Spared</span></div>
              </div>
              <button
                onClick={() => {
                  soundEngine.stopAll();
                  onClose();
                }}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-md text-sm"
              >
                Return to CuteCalc 💕
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
