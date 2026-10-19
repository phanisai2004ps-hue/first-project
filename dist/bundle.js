// CuteCalc Application Bundle
// Generated with Babel React preset
const {
  useState,
  useEffect,
  useRef
} = React;

/* --- File: src/utils/calculatorEngine.js --- */
/**
 * Safe Mathematical Calculator Engine & Horror Input Detector
 * Strictly avoids eval() / new Function() for safety and reliability.
 */

const OPERATORS = ['+', '-', '×', '÷', '*', '/'];

/**
 * Counts the total number of numeric digits (0-9) in the input string,
 * ignoring operators, spaces, parentheses, and decimal points.
 * @param {string} input 
 * @returns {number}
 */
function countNumericDigits(input) {
  if (!input || typeof input !== 'string') return 0;
  const digits = input.match(/\d/g);
  return digits ? digits.length : 0;
}

/**
 * Checks if the input expression contains three or more numeric digits.
 * This triggers the horror sequence when '=' is pressed.
 * @param {string} input 
 * @returns {boolean}
 */
function shouldTriggerHorror(input) {
  return countNumericDigits(input) >= 3;
}

/**
 * Tokenizes a mathematical expression string into tokens (numbers and operators)
 * @param {string} expr 
 * @returns {Array<string|number>}
 */
function tokenize(expr) {
  const normalized = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/\s+/g, '');
  const tokens = [];
  let currentNum = '';
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    if (char >= '0' && char <= '9' || char === '.') {
      currentNum += char;
    } else if (['+', '-', '*', '/'].includes(char)) {
      // Check for leading or consecutive minus (unary negative)
      if (char === '-' && (i === 0 || ['+', '-', '*', '/'].includes(normalized[i - 1]))) {
        currentNum += char;
      } else {
        if (currentNum !== '') {
          tokens.push(parseFloat(currentNum));
          currentNum = '';
        }
        tokens.push(char);
      }
    }
  }
  if (currentNum !== '') {
    tokens.push(parseFloat(currentNum));
  }
  return tokens;
}

/**
 * Evaluates mathematical tokens respecting standard operator precedence (BODMAS / PEMDAS).
 * Safe from malicious input.
 * @param {Array<string|number>} tokens 
 * @returns {number}
 */
function evaluateTokens(tokens) {
  if (!tokens || tokens.length === 0) return 0;
  if (tokens.length === 1 && typeof tokens[0] === 'number') return tokens[0];

  // First pass: Handle * and /
  const pass1 = [];
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (token === '*' || token === '/') {
      const prev = pass1.pop();
      const next = tokens[i + 1];
      if (typeof prev !== 'number' || typeof next !== 'number') {
        throw new Error('Invalid expression');
      }
      if (token === '/' && next === 0) {
        throw new Error('Cannot divide by cute 0 🌸');
      }
      const res = token === '*' ? prev * next : prev / next;
      pass1.push(res);
      i += 2;
    } else {
      pass1.push(token);
      i++;
    }
  }

  // Second pass: Handle + and -
  let result = pass1[0];
  if (typeof result !== 'number') {
    throw new Error('Invalid syntax');
  }
  for (let j = 1; j < pass1.length; j += 2) {
    const op = pass1[j];
    const nextVal = pass1[j + 1];
    if (typeof nextVal !== 'number') {
      throw new Error('Invalid expression');
    }
    if (op === '+') {
      result += nextVal;
    } else if (op === '-') {
      result -= nextVal;
    }
  }
  return result;
}

/**
 * Calculates result safely from an expression string
 * @param {string} expression 
 * @returns {{ success: boolean, result?: number | string, error?: string }}
 */
function calculateExpression(expression) {
  try {
    if (!expression || expression.trim() === '') {
      return {
        success: true,
        result: '0'
      };
    }
    const tokens = tokenize(expression);
    if (tokens.length === 0) {
      return {
        success: true,
        result: '0'
      };
    }
    const value = evaluateTokens(tokens);
    if (isNaN(value) || !isFinite(value)) {
      return {
        success: false,
        error: 'Undefined 💫'
      };
    }

    // Format output cleanly (limit floating point inaccuracies)
    let formatted = Math.round(value * 100000000) / 100000000;
    return {
      success: true,
      result: formatted.toString()
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Math Error 💕'
    };
  }
}

/* --- File: src/utils/audioEngine.js --- */
/**
 * Procedural Web Audio Engine for CuteCalc & Horror Nightmare
 * Generates both adorable cute sound effects and hair-raising horror sounds
 * purely via the Web Audio API (zero external assets to download or fail).
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isEnabled = false;
    this.masterGain = null;
    this.activeNodes = new Set();
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
  setEnabled(enabled) {
    this.isEnabled = enabled;
    if (enabled) {
      this.init();
    } else {
      this.stopAll();
    }
  }
  stopAll() {
    this.activeNodes.forEach(node => {
      try {
        if (typeof node.stop === 'function') node.stop();
        if (typeof node.disconnect === 'function') node.disconnect();
      } catch (e) {
        // Ignore already stopped nodes
      }
    });
    this.activeNodes.clear();
  }

  /* -------------------------------------------------------------
     CUTE AUDIO SYNTHESIS
     ------------------------------------------------------------- */

  // Sweet bubble pop on button click
  playCuteClick(pitch = 1) {
    if (!this.isEnabled || !this.ctx) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const startFreq = 480 * pitch;
    const endFreq = 720 * pitch;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  // Sparkling cute chord for successful harmless calculations
  playCuteSuccess() {
    if (!this.isEnabled || !this.ctx) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + idx * 0.06 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.06 + 0.35);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(this.ctx.currentTime + idx * 0.06);
      osc.stop(this.ctx.currentTime + idx * 0.06 + 0.4);
    });
  }

  // Sweet clear / backspace sound
  playCuteClear() {
    if (!this.isEnabled || !this.ctx) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  /* -------------------------------------------------------------
     HORROR AUDIO SYNTHESIS
     ------------------------------------------------------------- */

  // Stage 1: Glitch & static interference buzz
  playGlitchStatic() {
    if (!this.isEnabled || !this.ctx) return;
    this.init();
    const bufferSize = this.ctx.sampleRate * 0.6;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.4 ? 1 : 0.1);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter for harsh TV static
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.5, this.ctx.currentTime);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.55);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start();
    noise.stop(this.ctx.currentTime + 0.6);
  }

  // Stage 2: Eerie dark haunted drone & howling wind
  startHorrorDrone() {
    if (!this.isEnabled || !this.ctx) return;
    this.init();

    // Deep sub drone
    const droneOsc = this.ctx.createOscillator();
    const droneGain = this.ctx.createGain();
    droneOsc.type = 'sawtooth';
    droneOsc.frequency.setValueAtTime(45, this.ctx.currentTime);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, this.ctx.currentTime);

    // LFO to oscillate filter
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.5, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(50, this.ctx.currentTime);
    lfo.connect(filter.frequency);
    droneOsc.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(this.masterGain);
    droneGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    droneGain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 1.2);
    droneOsc.start();
    lfo.start();
    this.activeNodes.add(droneOsc);
    this.activeNodes.add(lfo);

    // Wind whisper
    const bufferSize = this.ctx.sampleRate * 2.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const windSource = this.ctx.createBufferSource();
    windSource.buffer = buffer;
    windSource.loop = true;
    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(650, this.ctx.currentTime);
    windFilter.Q.setValueAtTime(4, this.ctx.currentTime);
    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    windGain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 1.5);
    windSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(this.masterGain);
    windSource.start();
    this.activeNodes.add(windSource);
  }

  // Stage 3: THE JUMPSCARE CLIMAX STING
  // Extreme dissonant screech, sub-drop punch, and terrifying presence
  playJumpscareSting() {
    if (!this.isEnabled || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;

    // 1. Dissonant Horror Cluster Chords (Sawtooth + Square)
    const screechFreqs = [440, 466.16, 622.25, 880, 932.33, 1244.5];
    screechFreqs.forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      // Sudden pitch bend up and down
      osc.frequency.exponentialRampToValueAtTime(freq * 1.3, t + 0.15);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, t + 0.8);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 1.5);
    });

    // 2. Heavy Sub-Bass Impact (Bass Boom)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140, t);
    subOsc.frequency.exponentialRampToValueAtTime(32, t + 0.6);
    subGain.gain.setValueAtTime(0.55, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(t);
    subOsc.stop(t + 1.3);

    // 3. Harsh noise burst (fright blast)
    const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.7, this.ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.25));
    }
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(1200, t);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noiseSource.start(t);
  }

  // Creepy demonic whisper sound
  playCreepyWhisper() {
    if (!this.isEnabled || !this.ctx) return;
    this.init();
    const t = this.ctx.currentTime;
    const dur = 1.8;
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * dur, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.linearRampToValueAtTime(2200, t + dur * 0.5);
    filter.frequency.linearRampToValueAtTime(600, t + dur);
    filter.Q.setValueAtTime(6.0, t);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.28, t + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start(t);
  }
}
const soundEngine = new SoundEngine();

/* --- File: src/utils/horrorMessages.js --- */
/**
 * Curated horror messages, quotes, and comedic subscription copy
 */

const FUNNY_HORROR_MESSAGES = ["You calculated your own destiny.", "Math was your first mistake.", "The ghost says your answer is 666.", "Your calculator has joined the dark side.", "ERROR 666: Soul not found.", "Your mathematics teacher has returned.", "You should have subscribed to Ghost Premium.", "The answer was inside you all along.", "Why did you press equals? WHY?", "The ghost is disappointed in your math skills."];
const CUTE_MASCOT_QUOTES = ["You're doing amazing, sweetie! 🌸", "Math is cute and totally safe! 💕", "Just don't calculate anything with 3 digits... wait what? 🤫", "Sparkles make numbers softer! ✨", "I believe in your algebra powers! 🎀", "Isn't this the sweetest calculator ever? 💖"];

/**
 * Returns a random message from the horror quotes collection
 * @returns {string}
 */
function getRandomHorrorMessage() {
  const index = Math.floor(Math.random() * FUNNY_HORROR_MESSAGES.length);
  return FUNNY_HORROR_MESSAGES[index];
}

/**
 * Returns a random mascot cheer
 * @returns {string}
 */
function getRandomMascotQuote() {
  const index = Math.floor(Math.random() * CUTE_MASCOT_QUOTES.length);
  return CUTE_MASCOT_QUOTES[index];
}

/* --- File: src/components/AudioSettings.jsx --- */

function AudioSettings({
  soundEnabled,
  onToggleSound,
  reducedMotion,
  onToggleReducedMotion
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5 bg-white/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-pink-200/80 shadow-sm"
  }, /*#__PURE__*/React.createElement("button", {
    id: "sound-toggle-btn",
    onClick: onToggleSound,
    className: `flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${soundEnabled ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm shadow-pink-300' : 'bg-white/80 text-gray-500 hover:text-pink-600'}`,
    title: soundEnabled ? 'Sound is Enabled (Click to mute)' : 'Sound is Muted (Click to enable audio)'
  }, /*#__PURE__*/React.createElement("span", null, soundEnabled ? '🔊' : '🔇'), /*#__PURE__*/React.createElement("span", {
    className: "hidden sm:inline"
  }, soundEnabled ? 'Sound On' : 'Muted'), soundEnabled && /*#__PURE__*/React.createElement("span", {
    className: "flex items-center gap-0.5 ml-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-0.5 h-2 bg-white animate-pulse"
  }), /*#__PURE__*/React.createElement("span", {
    className: "w-0.5 h-3 bg-white animate-pulse delay-75"
  }), /*#__PURE__*/React.createElement("span", {
    className: "w-0.5 h-1.5 bg-white animate-pulse delay-150"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "text-pink-200"
  }, "|"), /*#__PURE__*/React.createElement("button", {
    id: "reduced-motion-btn",
    onClick: onToggleReducedMotion,
    className: `flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${reducedMotion ? 'bg-purple-600 text-white shadow-sm' : 'bg-white/80 text-gray-500 hover:text-purple-600'}`,
    title: "Toggle reduced motion accessibility mode"
  }, /*#__PURE__*/React.createElement("span", null, reducedMotion ? '🛡️' : '✨'), /*#__PURE__*/React.createElement("span", {
    className: "hidden sm:inline"
  }, reducedMotion ? 'Reduced Motion' : 'Animations On')));
}

/* --- File: src/components/CuteBackground.jsx --- */

function CuteBackground({
  reducedMotion = false
}) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Floating pastel symbols (hearts, stars, sparkles, bubbles)
    const symbols = ['💖', '✨', '🌸', '⭐', '🎀', '☁️', '🍬'];
    const particles = Array.from({
      length: 28
    }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 16 + 14,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      speedY: Math.random() * 0.4 + 0.2,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.3,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 0.02
    }));
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;
        if (p.y < -30) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.symbol, 0, 0);
        ctx.restore();
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion]);
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 pointer-events-none z-0 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 cute-bg-mesh opacity-90"
  }), /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    className: "absolute inset-0 w-full h-full"
  }));
}

/* --- File: src/components/CuteMascot.jsx --- */

function CuteMascot({
  digitCount = 0
}) {
  const [quote, setQuote] = useState("Hi! I'm Calcy! Let's do some sweet math together! 💖");
  const [isWiggling, setIsWiggling] = useState(false);
  const handleMascotClick = () => {
    setIsWiggling(true);
    soundEngine.playCuteClick(1.4);
    setTimeout(() => soundEngine.playCuteClick(1.8), 100);
    setQuote(getRandomMascotQuote());
    setTimeout(() => setIsWiggling(false), 600);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center select-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative mb-3 max-w-[260px] sm:max-w-[300px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border-2 border-pink-200 shadow-md text-center text-xs sm:text-sm font-medium text-pink-700 leading-snug"
  }, quote), /*#__PURE__*/React.createElement("div", {
    className: "w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-pink-200 mx-auto"
  })), /*#__PURE__*/React.createElement("div", {
    onClick: handleMascotClick,
    className: `relative cursor-pointer transition-transform duration-300 ${isWiggling ? 'scale-110 rotate-6' : 'hover:scale-105'}`,
    title: "Click me for cute love!"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute -inset-2 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 rounded-3xl blur-md opacity-60 animate-pulse"
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-white/90 shadow-xl bg-pink-100 flex items-center justify-center animate-mascot"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/assets/cute_calc_mascot.jpg",
    alt: "CuteCalc Mascot",
    className: "w-full h-full object-cover"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute top-1.5 right-1.5 bg-white/90 text-xs px-1.5 py-0.5 rounded-full shadow-sm text-pink-500 font-bold flex items-center gap-0.5"
  }, /*#__PURE__*/React.createElement("span", null, "\u2728"))), /*#__PURE__*/React.createElement("div", {
    className: "absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-md whitespace-nowrap"
  }, "Calcy \uD83D\uDC95")));
}

/* --- File: src/components/GhostPremiumModal.jsx --- */

function GhostPremiumModal({
  onClose,
  onReplay,
  triggerExpression
}) {
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
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none"
  }, !showCheckout ?
  /*#__PURE__*/
  /* Main Ghost Premium Card */
  React.createElement("div", {
    className: "relative w-full max-w-md bg-gradient-to-b from-gray-900 via-purple-950/70 to-black border-2 border-red-500/70 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(255,0,0,0.4)] text-center text-white animate-ghost-jumpscare"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inline-flex items-center gap-1.5 bg-red-600/30 border border-red-500/60 text-red-300 text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDC7B"), /*#__PURE__*/React.createElement("span", null, "PARANORMAL UPGRADE")), /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1"
  }, "GHOST PREMIUM"), /*#__PURE__*/React.createElement("div", {
    className: "text-xl sm:text-2xl font-black text-red-400 font-mono mb-3"
  }, "\u20B999 ", /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-normal text-gray-400"
  }, "/ month")), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-300 italic mb-5 leading-relaxed"
  }, "\u201CUnlock unlimited calculations. Keep the ghosts guessing.\u201D"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 text-left bg-black/40 border border-gray-800 rounded-2xl p-4 mb-6 text-xs sm:text-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-gray-200"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-red-400 font-bold"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "Calculate 3, 4, or 100 digits without demonic summon")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-gray-200"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-red-400 font-bold"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "Exorcism-grade arithmetic algorithm")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-gray-200"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-red-400 font-bold"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "Paranormal anti-jumpscare shield")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-gray-200"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-red-400 font-bold"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "24/7 Spectral customer support"))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-2.5"
  }, /*#__PURE__*/React.createElement("button", {
    id: "unlock-premium-btn",
    onClick: handleStartCheckout,
    className: "w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-900/60 transition-all flex items-center justify-center gap-2 text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98]"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDC8E"), /*#__PURE__*/React.createElement("span", null, "Unlock Ghost Premium")), /*#__PURE__*/React.createElement("button", {
    id: "dare-again-btn",
    onClick: () => {
      soundEngine.stopAll();
      onClose();
    },
    className: "w-full bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 border border-purple-500/50 font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDD04"), /*#__PURE__*/React.createElement("span", null, "Dare to Calculate Again")), /*#__PURE__*/React.createElement("button", {
    id: "escape-calculator-btn",
    onClick: () => {
      soundEngine.stopAll();
      onClose();
    },
    className: "w-full bg-gray-800/70 hover:bg-gray-700 text-gray-300 font-medium py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDC7B"), /*#__PURE__*/React.createElement("span", null, "Escape to Calculator")), /*#__PURE__*/React.createElement("button", {
    id: "replay-horror-btn",
    onClick: onReplay,
    className: "text-[11px] text-gray-500 hover:text-red-400 font-mono underline transition-colors pt-1"
  }, "\uD83C\uDFAC Replay Horror Jumpscare Sequence"))) :
  /*#__PURE__*/
  /* Demo Checkout Flow Modal */
  React.createElement("div", {
    className: "relative w-full max-w-sm bg-gray-900 border border-gray-700 rounded-3xl p-6 text-center text-white shadow-2xl"
  }, checkoutStep === 'processing' && /*#__PURE__*/React.createElement("div", {
    className: "py-8 space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold"
  }, "Transferring Soul Currency..."), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-400 font-mono"
  }, "Negotiating contract with mathematics phantom..."), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-yellow-500 bg-yellow-950/40 border border-yellow-800/60 px-3 py-1 rounded-full"
  }, "\u26A0\uFE0F DEMO PAYMENT SIMULATION \u2014 NO REAL CHARGES")), checkoutStep === 'success' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 py-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-5xl"
  }, "\uD83C\uDF89\uD83D\uDC7B"), /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-bold text-green-400"
  }, "Ghost Premium Demo Activated!"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-300 leading-relaxed"
  }, "You are now protected by the Spectral Shield. This was a harmless humorous demo simulation. No actual payment was taken!"), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-gray-800/80 rounded-xl text-left text-xs font-mono text-gray-300 space-y-1"
  }, /*#__PURE__*/React.createElement("div", null, "Receipt: ", /*#__PURE__*/React.createElement("span", {
    className: "text-green-400"
  }, "#DEMO-GHOST-666")), /*#__PURE__*/React.createElement("div", null, "Amount: ", /*#__PURE__*/React.createElement("span", {
    className: "text-green-400"
  }, "\u20B90.00 (Demo Mode)")), /*#__PURE__*/React.createElement("div", null, "Status: ", /*#__PURE__*/React.createElement("span", {
    className: "text-green-400"
  }, "Temporarily Spared"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      soundEngine.stopAll();
      onClose();
    },
    className: "w-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-md text-sm"
  }, "Return to CuteCalc \uD83D\uDC95"))));
}

/* --- File: src/components/CuteCalculator.jsx --- */

function CuteCalculator({
  onTriggerHorror,
  soundEnabled,
  reducedMotion
}) {
  const [expression, setExpression] = useState('');
  const [displayValue, setDisplayValue] = useState('0');
  const [history, setHistory] = useState([{
    expr: '2 + 2',
    result: '4 💕'
  }, {
    expr: '7 + 8',
    result: '15 ✨'
  }]);
  const [showHistory, setShowHistory] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const calcContainerRef = useRef(null);

  // Sparkle burst effect on button click
  const spawnSparkles = e => {
    if (reducedMotion) return;
    const rect = e?.currentTarget?.getBoundingClientRect();
    if (!rect || !calcContainerRef.current) return;
    const containerRect = calcContainerRef.current.getBoundingClientRect();
    const originX = rect.left - containerRect.left + rect.width / 2;
    const originY = rect.top - containerRect.top + rect.height / 2;
    const icons = ['✨', '💖', '🌸', '⭐', '🍬'];
    const newSparkles = Array.from({
      length: 4
    }).map((_, i) => ({
      id: Date.now() + Math.random() + i,
      x: originX,
      y: originY,
      tx: `${(Math.random() - 0.5) * 70}px`,
      ty: `${-Math.random() * 60 - 20}px`,
      icon: icons[Math.floor(Math.random() * icons.length)]
    }));
    setSparkles(prev => [...prev.slice(-12), ...newSparkles]);
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => !newSparkles.includes(s)));
    }, 700);
  };

  // Button actions
  const handleDigit = (digit, e) => {
    spawnSparkles(e);
    soundEngine.playCuteClick(1 + parseInt(digit, 10) * 0.05);
    if (displayValue === '0' || displayValue === 'Error' || displayValue.includes('💕')) {
      setDisplayValue(digit);
      setExpression(digit);
    } else {
      setDisplayValue(prev => prev + digit);
      setExpression(prev => prev + digit);
    }
  };
  const handleOperator = (op, e) => {
    spawnSparkles(e);
    soundEngine.playCuteClick(1.2);
    if (expression === '' && op === '-') {
      setDisplayValue('-');
      setExpression('-');
      return;
    }
    const lastChar = expression.slice(-1);
    if (['+', '-', '×', '÷'].includes(lastChar)) {
      // Replace operator
      setExpression(prev => prev.slice(0, -1) + op);
      setDisplayValue(prev => prev.slice(0, -1) + op);
    } else {
      setExpression(prev => prev + op);
      setDisplayValue(prev => prev + op);
    }
  };
  const handleDecimal = e => {
    spawnSparkles(e);
    soundEngine.playCuteClick(1.15);

    // Prevent multiple decimals in current segment
    const parts = expression.split(/[+\-×÷]/);
    const lastPart = parts[parts.length - 1];
    if (!lastPart.includes('.')) {
      if (lastPart === '') {
        setDisplayValue(prev => prev + '0.');
        setExpression(prev => prev + '0.');
      } else {
        setDisplayValue(prev => prev + '.');
        setExpression(prev => prev + '.');
      }
    }
  };
  const handleClear = e => {
    spawnSparkles(e);
    soundEngine.playCuteClear();
    setDisplayValue('0');
    setExpression('');
  };
  const handleDelete = e => {
    spawnSparkles(e);
    soundEngine.playCuteClick(0.9);
    if (expression.length <= 1) {
      setDisplayValue('0');
      setExpression('');
    } else {
      const next = expression.slice(0, -1);
      setDisplayValue(next);
      setExpression(next);
    }
  };
  const handlePercent = e => {
    spawnSparkles(e);
    soundEngine.playCuteClick(1.3);
    const calc = calculateExpression(expression);
    if (calc.success) {
      const val = parseFloat(calc.result) / 100;
      setDisplayValue(val.toString());
      setExpression(val.toString());
    }
  };
  const handleToggleSign = e => {
    spawnSparkles(e);
    soundEngine.playCuteClick(1.1);
    if (!expression || expression === '0') return;
    if (expression.startsWith('-')) {
      const positive = expression.substring(1);
      setDisplayValue(positive);
      setExpression(positive);
    } else {
      const negative = '-' + expression;
      setDisplayValue(negative);
      setExpression(negative);
    }
  };

  // THE MAIN EQUALS LOGIC & HORROR TRIGGER
  const handleEquals = e => {
    spawnSparkles(e);

    // Check if input expression contains 3 or more numeric digits
    if (shouldTriggerHorror(expression)) {
      // HORROR ACTIVATED!
      onTriggerHorror(expression);
      return;
    }

    // Normal safe calculation if under 3 digits
    const calc = calculateExpression(expression);
    if (calc.success) {
      soundEngine.playCuteSuccess();
      const cuteResult = calc.result;
      setHistory(prev => [{
        expr: expression,
        result: cuteResult + ' 💖'
      }, ...prev.slice(0, 9)]);
      setDisplayValue(cuteResult);
      setExpression(cuteResult.toString());
    } else {
      soundEngine.playCuteClear();
      setDisplayValue('Error 💫');
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = e => {
      // Ignore if user is typing in an input or modal is active
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      const key = e.key;
      if (key >= '0' && key <= '9') {
        handleDigit(key);
      } else if (key === '+') {
        handleOperator('+');
      } else if (key === '-') {
        handleOperator('-');
      } else if (key === '*' || key === 'x' || key === 'X') {
        handleOperator('×');
      } else if (key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (key === '.') {
        handleDecimal();
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (key === 'Backspace') {
        handleDelete();
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression]);
  const digitCount = countNumericDigits(expression);
  return /*#__PURE__*/React.createElement("div", {
    ref: calcContainerRef,
    className: "relative w-full max-w-[360px] sm:max-w-[400px] glass-panel rounded-[32px] p-5 sm:p-6 select-none transition-all duration-300"
  }, sparkles.map(s => /*#__PURE__*/React.createElement("span", {
    key: s.id,
    className: "sparkle-burst text-lg",
    style: {
      left: s.x,
      top: s.y,
      '--tx': s.tx,
      '--ty': s.ty
    }
  }, s.icon)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between pb-3 mb-2 border-b border-pink-200/60"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-3 h-3 rounded-full bg-pink-400 inline-block shadow-sm"
  }), /*#__PURE__*/React.createElement("span", {
    className: "w-3 h-3 rounded-full bg-purple-300 inline-block shadow-sm"
  }), /*#__PURE__*/React.createElement("span", {
    className: "w-3 h-3 rounded-full bg-sky-300 inline-block shadow-sm"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-semibold text-pink-600 ml-1"
  }, "CuteCalc v1.0")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowHistory(!showHistory),
    className: "text-xs font-medium text-pink-500 hover:text-pink-700 bg-pink-100/70 hover:bg-pink-100 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1",
    title: "Toggle Sweet Math Diary"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCD6"), /*#__PURE__*/React.createElement("span", null, showHistory ? 'Close Diary' : 'Diary'))), showHistory && /*#__PURE__*/React.createElement("div", {
    className: "mb-3 p-3 bg-pink-50/90 rounded-2xl border border-pink-200 text-xs max-h-36 overflow-y-auto space-y-1.5 transition-all"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-pink-700 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83C\uDF80 Sweet Calculation Diary"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-pink-400"
  }, "Recent entries")), history.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-gray-400 italic text-center py-2"
  }, "No math yet! Type something sweet \uD83D\uDC95") : history.map((item, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    className: "flex justify-between items-center bg-white/70 px-2.5 py-1 rounded-lg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-600 font-mono"
  }, item.expr, " ="), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-pink-600"
  }, item.result)))), /*#__PURE__*/React.createElement("div", {
    className: "relative glass-panel-inner rounded-2xl p-4 mb-4 overflow-hidden shadow-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-1 right-2 text-2xl text-pink-200/30 font-bold select-none pointer-events-none"
  }, "\uD83D\uDC96"), /*#__PURE__*/React.createElement("div", {
    className: "text-right text-xs font-mono text-purple-400 min-h-[18px] tracking-wide truncate"
  }, expression || ' '), /*#__PURE__*/React.createElement("div", {
    className: "text-right text-3xl sm:text-4xl font-bold font-mono text-gray-800 tracking-tight mt-1 truncate"
  }, displayValue), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mt-2 pt-2 border-t border-pink-100/80 text-[11px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-pink-400 font-medium flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("span", null, "\u2728"), /*#__PURE__*/React.createElement("span", null, "Love at first calculation")), /*#__PURE__*/React.createElement("span", {
    className: "text-pink-500 font-medium bg-pink-100/60 px-2 py-0.5 rounded-full"
  }, "Digits: ", digitCount, " ", digitCount >= 3 ? '⚠️' : '🌸'))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-4 gap-2.5 sm:gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    id: "btn-clear",
    onClick: handleClear,
    className: "glass-button text-rose-500 font-bold text-lg sm:text-xl py-3 rounded-2xl",
    title: "Clear (C / Esc)"
  }, "C"), /*#__PURE__*/React.createElement("button", {
    id: "btn-delete",
    onClick: handleDelete,
    className: "glass-button text-purple-600 font-bold text-lg sm:text-xl py-3 rounded-2xl",
    title: "Delete (Backspace)"
  }, "DEL"), /*#__PURE__*/React.createElement("button", {
    id: "btn-percent",
    onClick: handlePercent,
    className: "glass-button text-purple-600 font-bold text-lg sm:text-xl py-3 rounded-2xl",
    title: "Percent (%)"
  }, "%"), /*#__PURE__*/React.createElement("button", {
    id: "btn-divide",
    onClick: e => handleOperator('÷', e),
    className: "operator-button font-bold text-xl sm:text-2xl py-3 rounded-2xl",
    title: "Divide (\xF7)"
  }, "\xF7"), /*#__PURE__*/React.createElement("button", {
    id: "btn-7",
    onClick: e => handleDigit('7', e),
    className: "glass-button text-gray-700 font-bold text-xl sm:text-2xl py-3 rounded-2xl"
  }, "7"), /*#__PURE__*/React.createElement("button", {
    id: "btn-8",
    onClick: e => handleDigit('8', e),
    className: "glass-button text-gray-700 font-bold text-xl sm:text-2xl py-3 rounded-2xl"
  }, "8"), /*#__PURE__*/React.createElement("button", {
    id: "btn-9",
    onClick: e => handleDigit('9', e),
    className: "glass-button text-gray-700 font-bold text-xl sm:text-2xl py-3 rounded-2xl"
  }, "9"), /*#__PURE__*/React.createElement("button", {
    id: "btn-multiply",
    onClick: e => handleOperator('×', e),
    className: "operator-button font-bold text-xl sm:text-2xl py-3 rounded-2xl",
    title: "Multiply (\xD7)"
  }, "\xD7"), /*#__PURE__*/React.createElement("button", {
    id: "btn-4",
    onClick: e => handleDigit('4', e),
    className: "glass-button text-gray-700 font-bold text-xl sm:text-2xl py-3 rounded-2xl"
  }, "4"), /*#__PURE__*/React.createElement("button", {
    id: "btn-5",
    onClick: e => handleDigit('5', e),
    className: "glass-button text-gray-700 font-bold text-xl sm:text-2xl py-3 rounded-2xl"
  }, "5"), /*#__PURE__*/React.createElement("button", {
    id: "btn-6",
    onClick: e => handleDigit('6', e),
    className: "glass-button text-gray-700 font-bold text-xl sm:text-2xl py-3 rounded-2xl"
  }, "6"), /*#__PURE__*/React.createElement("button", {
    id: "btn-minus",
    onClick: e => handleOperator('-', e),
    className: "operator-button font-bold text-xl sm:text-2xl py-3 rounded-2xl",
    title: "Subtract (-)"
  }, "-"), /*#__PURE__*/React.createElement("button", {
    id: "btn-1",
    onClick: e => handleDigit('1', e),
    className: "glass-button text-gray-700 font-bold text-xl sm:text-2xl py-3 rounded-2xl"
  }, "1"), /*#__PURE__*/React.createElement("button", {
    id: "btn-2",
    onClick: e => handleDigit('2', e),
    className: "glass-button text-gray-700 font-bold text-xl sm:text-2xl py-3 rounded-2xl"
  }, "2"), /*#__PURE__*/React.createElement("button", {
    id: "btn-3",
    onClick: e => handleDigit('3', e),
    className: "glass-button text-gray-700 font-bold text-xl sm:text-2xl py-3 rounded-2xl"
  }, "3"), /*#__PURE__*/React.createElement("button", {
    id: "btn-plus",
    onClick: e => handleOperator('+', e),
    className: "operator-button font-bold text-xl sm:text-2xl py-3 rounded-2xl",
    title: "Add (+)"
  }, "+"), /*#__PURE__*/React.createElement("button", {
    id: "btn-toggle-sign",
    onClick: handleToggleSign,
    className: "glass-button text-purple-600 font-bold text-lg sm:text-xl py-3 rounded-2xl",
    title: "Plus / Minus (+/-)"
  }, "\xB1"), /*#__PURE__*/React.createElement("button", {
    id: "btn-0",
    onClick: e => handleDigit('0', e),
    className: "glass-button text-gray-700 font-bold text-xl sm:text-2xl py-3 rounded-2xl"
  }, "0"), /*#__PURE__*/React.createElement("button", {
    id: "btn-decimal",
    onClick: handleDecimal,
    className: "glass-button text-gray-700 font-bold text-xl sm:text-2xl py-3 rounded-2xl",
    title: "Decimal (.)"
  }, "."), /*#__PURE__*/React.createElement("button", {
    id: "btn-equals",
    onClick: handleEquals,
    className: "equals-button font-bold text-2xl py-3 rounded-2xl cursor-pointer",
    title: "Equals (= / Enter)"
  }, "=")), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 pt-3 border-t border-pink-200/50 flex items-center justify-between text-[10px] text-gray-400"
  }, /*#__PURE__*/React.createElement("span", null, "Keyboard: 0-9, +, -, *, /, Enter"), /*#__PURE__*/React.createElement("span", null, "Esc: Clear")));
}

/* --- File: src/components/HorrorOverlay.jsx --- */

function HorrorOverlay({
  triggerExpression,
  onClose,
  reducedMotion = false
}) {
  // Horror stages: 1 = glitch, 2 = takeover, 3 = climax, 4 = offer
  const [stage, setStage] = useState(1);
  const [randomMessage, setRandomMessage] = useState('');
  const [mousePos, setMousePos] = useState({
    x: 0,
    y: 0
  });
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
  const handleMouseMove = e => {
    const {
      clientX,
      clientY
    } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    // Calculate normalized offset (-1 to 1)
    const dx = (clientX - centerX) / (window.innerWidth / 2);
    const dy = (clientY - centerY) / (window.innerHeight / 2);
    setMousePos({
      x: dx * 14,
      y: dy * 14
    });
  };

  // Keyboard Escape listener
  useEffect(() => {
    const handleKey = e => {
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
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const particles = Array.from({
      length: 45
    }, () => ({
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
  return /*#__PURE__*/React.createElement("div", {
    onMouseMove: handleMouseMove,
    className: `fixed inset-0 z-[9999] bg-black text-white overflow-hidden flex flex-col items-center justify-center select-none ${!reducedMotion && stage === 3 ? 'horror-shake' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 crt-scanlines z-30 opacity-70 pointer-events-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 horror-vignette z-20 pointer-events-none"
  }), /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    className: "absolute inset-0 z-10 pointer-events-none opacity-80"
  }), /*#__PURE__*/React.createElement("button", {
    id: "escape-horror-btn",
    onClick: () => {
      soundEngine.stopAll();
      onClose();
    },
    className: "absolute top-4 right-4 z-50 bg-red-950/80 hover:bg-red-800 text-red-200 border border-red-600/60 px-4 py-1.5 rounded-full text-xs font-mono tracking-wider flex items-center gap-1.5 backdrop-blur-md transition-all shadow-lg hover:shadow-red-900/50",
    title: "Escape to safety (ESC)"
  }, /*#__PURE__*/React.createElement("span", null, "\u2715"), /*#__PURE__*/React.createElement("span", null, "ESCAPE (ESC)")), stage === 1 && /*#__PURE__*/React.createElement("div", {
    className: "relative z-20 text-center px-4 horror-glitch-stage1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-6xl sm:text-7xl mb-4 animate-bounce"
  }, "\uD83D\uDC7B"), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl sm:text-4xl font-extrabold text-red-500 font-terminal chromatic-text uppercase tracking-widest"
  }, "SYNTAX CORRUPTION DETECTED"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm sm:text-base text-gray-400 font-mono mt-2"
  }, "Input: ", /*#__PURE__*/React.createElement("span", {
    className: "text-red-400 font-bold"
  }, triggerExpression), " contains forbidden digits..."), /*#__PURE__*/React.createElement("div", {
    className: "mt-6 flex justify-center items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2.5 h-2.5 bg-red-600 rounded-full animate-ping"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-red-400 font-mono tracking-widest"
  }, "CONNECTING TO PARANORMAL REALM..."))), stage === 2 && /*#__PURE__*/React.createElement("div", {
    className: "relative z-20 flex flex-col items-center justify-center text-center px-4 w-full max-w-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative flex items-center justify-center gap-16 sm:gap-24 my-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative w-16 h-10 sm:w-20 sm:h-12 bg-black rounded-full border-2 border-red-800/80 shadow-[0_0_25px_rgba(255,0,0,0.8)] flex items-center justify-center overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-600 shadow-[0_0_12px_#ff0000] flex items-center justify-center transition-transform duration-75",
    style: {
      transform: `translate(${mousePos.x}px, ${mousePos.y}px)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-2 h-3 bg-black rounded-full"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "relative w-16 h-10 sm:w-20 sm:h-12 bg-black rounded-full border-2 border-red-800/80 shadow-[0_0_25px_rgba(255,0,0,0.8)] flex items-center justify-center overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-600 shadow-[0_0_12px_#ff0000] flex items-center justify-center transition-transform duration-75",
    style: {
      transform: `translate(${mousePos.x}px, ${mousePos.y}px)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-2 h-3 bg-black rounded-full"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl sm:text-3xl font-horror tracking-wider text-red-500 mb-2"
  }, "IT WATCHES YOUR EVERY INPUT..."), /*#__PURE__*/React.createElement("div", {
    className: "text-xs sm:text-sm font-mono text-gray-400"
  }, "\"You dared to calculate 3 digits without a permit...\"")), stage >= 3 && /*#__PURE__*/React.createElement("div", {
    className: "relative z-20 flex flex-col items-center justify-center w-full h-full max-w-4xl px-4 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative w-72 h-72 sm:w-96 sm:h-96 md:w-[460px] md:h-[460px] rounded-full overflow-hidden border-4 border-red-900/80 demonic-glow animate-ghost-jumpscare"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/assets/spooky_ghost_face.jpg",
    alt: "Terrifying Specter",
    className: "w-full h-full object-cover filter contrast-125 brightness-110"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-red-600/20 mix-blend-color-dodge animate-pulse"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 sm:mt-6 space-y-2 max-w-2xl"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl sm:text-4xl md:text-5xl font-horror text-red-600 chromatic-text tracking-wide uppercase leading-tight"
  }, "\uD83D\uDC7B YOU SHOULD NOT HAVE CALCULATED THAT!"), /*#__PURE__*/React.createElement("div", {
    className: "text-base sm:text-2xl font-mono font-bold text-gray-200 tracking-wider"
  }, "THE GHOST KNOWS YOUR ANSWER."), /*#__PURE__*/React.createElement("div", {
    className: "text-red-500 font-extrabold text-xl sm:text-3xl font-terminal tracking-[0.3em] animate-pulse"
  }, "RUN... RUN... RUN..."), /*#__PURE__*/React.createElement("div", {
    className: "inline-block mt-3 bg-red-950/90 border border-red-500/70 px-4 py-2 rounded-xl text-xs sm:text-sm font-mono text-red-300 shadow-lg"
  }, "\"", randomMessage, "\""))), showSubscription && /*#__PURE__*/React.createElement(GhostPremiumModal, {
    onClose: onClose,
    onReplay: handleReplay,
    triggerExpression: triggerExpression
  }));
}

/* --- File: src/app.jsx --- */

function App() {
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
  const handleTriggerHorror = expression => {
    setTriggerExpr(expression);
    setIsHorrorActive(true);
    setHorrorCount(prev => prev + 1);
  };
  const handleCloseHorror = () => {
    setIsHorrorActive(false);
    setTriggerExpr('');
  };
  return /*#__PURE__*/React.createElement("div", {
    className: `relative min-h-screen flex flex-col justify-between text-gray-800 ${reducedMotion ? 'reduced-motion-active' : ''}`
  }, /*#__PURE__*/React.createElement(CuteBackground, {
    reducedMotion: reducedMotion
  }), /*#__PURE__*/React.createElement("header", {
    className: "relative z-20 w-full max-w-5xl mx-auto px-4 py-4 sm:py-6 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-2xl sm:text-3xl animate-bounce"
  }, "\uD83D\uDC96"), /*#__PURE__*/React.createElement("span", {
    className: "text-lg sm:text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"
  }, "CuteCalc"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs bg-pink-100 text-pink-600 font-bold px-2 py-0.5 rounded-full border border-pink-200"
  }, "Aesthetic \uD83C\uDF38")), /*#__PURE__*/React.createElement(AudioSettings, {
    soundEnabled: soundEnabled,
    onToggleSound: handleToggleSound,
    reducedMotion: reducedMotion,
    onToggleReducedMotion: handleToggleReducedMotion
  })), /*#__PURE__*/React.createElement("main", {
    className: "relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-8 max-w-4xl mx-auto w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-6 sm:mb-8 space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inline-block bg-white/70 backdrop-blur-sm border border-pink-200 text-pink-600 font-medium text-xs px-3.5 py-1 rounded-full shadow-sm mb-1"
  }, "\u2728 CuteCalc \uD83D\uDC7B \u2014 Love at First Calculation, Fear at First Result"), /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl sm:text-5xl font-black text-gray-800 tracking-tight"
  }, "\uD83D\uDC95 Welcome to CuteCalc \uD83D\uDC95"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm sm:text-base font-medium text-pink-600/90 max-w-md mx-auto"
  }, "Your little calculator with a ", /*#__PURE__*/React.createElement("span", {
    className: "font-bold underline decoration-pink-300"
  }, "BIG"), " personality.")), /*#__PURE__*/React.createElement("div", {
    className: "w-full flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-10"
  }, /*#__PURE__*/React.createElement(CuteMascot, null), /*#__PURE__*/React.createElement(CuteCalculator, {
    onTriggerHorror: handleTriggerHorror,
    soundEnabled: soundEnabled,
    reducedMotion: reducedMotion
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full border border-pink-200/60"
  }, "\uD83C\uDF38 Innocent tip: 12 + 5 = 17 works fine!"), /*#__PURE__*/React.createElement("span", {
    className: "bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full border border-pink-200/60"
  }, "\uD83E\uDD2B Shh: What happens with 3 or more digits?"), horrorCount > 0 && /*#__PURE__*/React.createElement("span", {
    className: "bg-red-50 text-red-600 font-bold px-3 py-1 rounded-full border border-red-200"
  }, "\uD83D\uDC7B Nightmares survived: ", horrorCount))), /*#__PURE__*/React.createElement("footer", {
    className: "relative z-10 w-full py-4 text-center border-t border-pink-200/40 bg-white/30 backdrop-blur-sm"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm font-semibold text-pink-600"
  }, "\u201CCute on the outside. Haunted on the inside. \uD83D\uDC96\uD83D\uDC7B\u201D"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-gray-400 mt-0.5"
  }, "CuteCalc is a fun, cinematic interactive project. Fictional horror only \u2014 no real ghosts harmed in calculations.")), isHorrorActive && /*#__PURE__*/React.createElement(HorrorOverlay, {
    triggerExpression: triggerExpr,
    onClose: handleCloseHorror,
    reducedMotion: reducedMotion
  }));
}

/* --- Mount App --- */
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(React.createElement(App));
}