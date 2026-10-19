import React, { useState, useEffect, useRef } from 'react';
import { countNumericDigits, shouldTriggerHorror, calculateExpression } from '../utils/calculatorEngine.js';
import { soundEngine } from '../utils/audioEngine.js';

export default function CuteCalculator({ onTriggerHorror, soundEnabled, reducedMotion }) {
  const [expression, setExpression] = useState('');
  const [displayValue, setDisplayValue] = useState('0');
  const [history, setHistory] = useState([
    { expr: '2 + 2', result: '4 💕' },
    { expr: '7 + 8', result: '15 ✨' }
  ]);
  const [showHistory, setShowHistory] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const calcContainerRef = useRef(null);

  // Sparkle burst effect on button click
  const spawnSparkles = (e) => {
    if (reducedMotion) return;
    const rect = e?.currentTarget?.getBoundingClientRect();
    if (!rect || !calcContainerRef.current) return;

    const containerRect = calcContainerRef.current.getBoundingClientRect();
    const originX = rect.left - containerRect.left + rect.width / 2;
    const originY = rect.top - containerRect.top + rect.height / 2;

    const icons = ['✨', '💖', '🌸', '⭐', '🍬'];
    const newSparkles = Array.from({ length: 4 }).map((_, i) => ({
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

  const handleDecimal = (e) => {
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

  const handleClear = (e) => {
    spawnSparkles(e);
    soundEngine.playCuteClear();
    setDisplayValue('0');
    setExpression('');
  };

  const handleDelete = (e) => {
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

  const handlePercent = (e) => {
    spawnSparkles(e);
    soundEngine.playCuteClick(1.3);

    const calc = calculateExpression(expression);
    if (calc.success) {
      const val = parseFloat(calc.result) / 100;
      setDisplayValue(val.toString());
      setExpression(val.toString());
    }
  };

  const handleToggleSign = (e) => {
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
  const handleEquals = (e) => {
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
      setHistory(prev => [
        { expr: expression, result: cuteResult + ' 💖' },
        ...prev.slice(0, 9)
      ]);
      setDisplayValue(cuteResult);
      setExpression(cuteResult.toString());
    } else {
      soundEngine.playCuteClear();
      setDisplayValue('Error 💫');
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
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

  return (
    <div 
      ref={calcContainerRef}
      className="relative w-full max-w-[360px] sm:max-w-[400px] glass-panel rounded-[32px] p-5 sm:p-6 select-none transition-all duration-300"
    >
      {/* Click Sparkles Overlay */}
      {sparkles.map(s => (
        <span
          key={s.id}
          className="sparkle-burst text-lg"
          style={{
            left: s.x,
            top: s.y,
            '--tx': s.tx,
            '--ty': s.ty
          }}
        >
          {s.icon}
        </span>
      ))}

      {/* Decorative Calculator Header Ears/Ribbon */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-pink-200/60">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-pink-400 inline-block shadow-sm" />
          <span className="w-3 h-3 rounded-full bg-purple-300 inline-block shadow-sm" />
          <span className="w-3 h-3 rounded-full bg-sky-300 inline-block shadow-sm" />
          <span className="text-xs font-semibold text-pink-600 ml-1">CuteCalc v1.0</span>
        </div>

        {/* History Tape Toggle */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-xs font-medium text-pink-500 hover:text-pink-700 bg-pink-100/70 hover:bg-pink-100 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1"
          title="Toggle Sweet Math Diary"
        >
          <span>📖</span>
          <span>{showHistory ? 'Close Diary' : 'Diary'}</span>
        </button>
      </div>

      {/* Sweet Math Diary Tape Dropdown */}
      {showHistory && (
        <div className="mb-3 p-3 bg-pink-50/90 rounded-2xl border border-pink-200 text-xs max-h-36 overflow-y-auto space-y-1.5 transition-all">
          <div className="font-bold text-pink-700 flex items-center justify-between">
            <span>🎀 Sweet Calculation Diary</span>
            <span className="text-[10px] text-pink-400">Recent entries</span>
          </div>
          {history.length === 0 ? (
            <p className="text-gray-400 italic text-center py-2">No math yet! Type something sweet 💕</p>
          ) : (
            history.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center bg-white/70 px-2.5 py-1 rounded-lg">
                <span className="text-gray-600 font-mono">{item.expr} =</span>
                <span className="font-bold text-pink-600">{item.result}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Calculator Screen Display */}
      <div className="relative glass-panel-inner rounded-2xl p-4 mb-4 overflow-hidden shadow-inner">
        {/* Subtle decorative heart watermark */}
        <div className="absolute top-1 right-2 text-2xl text-pink-200/30 font-bold select-none pointer-events-none">
          💖
        </div>

        {/* Expression trace */}
        <div className="text-right text-xs font-mono text-purple-400 min-h-[18px] tracking-wide truncate">
          {expression || ' '}
        </div>

        {/* Main Display Number */}
        <div className="text-right text-3xl sm:text-4xl font-bold font-mono text-gray-800 tracking-tight mt-1 truncate">
          {displayValue}
        </div>

        {/* Innocent Digit Counter Status */}
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-pink-100/80 text-[11px]">
          <span className="text-pink-400 font-medium flex items-center gap-1">
            <span>✨</span>
            <span>Love at first calculation</span>
          </span>
          <span className="text-pink-500 font-medium bg-pink-100/60 px-2 py-0.5 rounded-full">
            Digits: {digitCount} {digitCount >= 3 ? '⚠️' : '🌸'}
          </span>
        </div>
      </div>

      {/* Calculator Keypad Grid */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {/* Row 1 */}
        <button
          id="btn-clear"
          onClick={handleClear}
          className="glass-button text-rose-500 font-bold text-lg sm:text-xl py-3 rounded-2xl"
          title="Clear (C / Esc)"
        >
          C
        </button>
        <button
          id="btn-delete"
          onClick={handleDelete}
          className="glass-button text-purple-600 font-bold text-lg sm:text-xl py-3 rounded-2xl"
          title="Delete (Backspace)"
        >
          DEL
        </button>
        <button
          id="btn-percent"
          onClick={handlePercent}
          className="glass-button text-purple-600 font-bold text-lg sm:text-xl py-3 rounded-2xl"
          title="Percent (%)"
        >
          %
        </button>
        <button
          id="btn-divide"
          onClick={(e) => handleOperator('÷', e)}
          className="operator-button font-bold text-xl sm:text-2xl py-3 rounded-2xl"
          title="Divide (÷)"
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          id="btn-7"
          onClick={(e) => handleDigit('7', e)}
          className="glass-button text-gray-700 font-bold text-xl sm:text-2xl py-3 rounded-2xl"
        >
          7
        </button>
        <button
          id="btn-8"
          onClick={(e) => handleDigit('8', e)}
          className="glass-button text-gray-700 font-bold text-xl sm:text-2xl py-3 rounded-2xl"
        >
          8
        </button>
        <button
          id="btn-9"
          onClick={(e) => handleDigit('9', e)}
          className="glass-button text-gray-700 font-bold text-xl sm:text-2xl py-3 rounded-2xl"
        >
          9
        </button>
        <button
          id="btn-multiply"
          onClick={(e) => handleOperator('×', e)}
          className="operator-button font-bold text-xl sm:text-2xl py-3 rounded-2xl"
          title="Multiply (×)"
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          id="btn-4"
          onClick={(e) => handleDigit('4', e)}
          className="glass-button text-gray-700 font-bold text-xl sm:text-2xl py-3 rounded-2xl"
        >
          4
        </button>
        <button
          id="btn-5"
          onClick={(e) => handleDigit('5', e)}
          className="glass-button text-gray-700 font-bold text-xl sm:text-2xl py-3 rounded-2xl"
        >
          5
        </button>
        <button
          id="btn-6"
          onClick={(e) => handleDigit('6', e)}
          className="glass-button text-gray-700 font-bold text-xl sm:text-2xl py-3 rounded-2xl"
        >
          6
        </button>
        <button
          id="btn-minus"
          onClick={(e) => handleOperator('-', e)}
          className="operator-button font-bold text-xl sm:text-2xl py-3 rounded-2xl"
          title="Subtract (-)"
        >
          -
        </button>

        {/* Row 4 */}
        <button
          id="btn-1"
          onClick={(e) => handleDigit('1', e)}
          className="glass-button text-gray-700 font-bold text-xl sm:text-2xl py-3 rounded-2xl"
        >
          1
        </button>
        <button
          id="btn-2"
          onClick={(e) => handleDigit('2', e)}
          className="glass-button text-gray-700 font-bold text-xl sm:text-2xl py-3 rounded-2xl"
        >
          2
        </button>
        <button
          id="btn-3"
          onClick={(e) => handleDigit('3', e)}
          className="glass-button text-gray-700 font-bold text-xl sm:text-2xl py-3 rounded-2xl"
        >
          3
        </button>
        <button
          id="btn-plus"
          onClick={(e) => handleOperator('+', e)}
          className="operator-button font-bold text-xl sm:text-2xl py-3 rounded-2xl"
          title="Add (+)"
        >
          +
        </button>

        {/* Row 5 */}
        <button
          id="btn-toggle-sign"
          onClick={handleToggleSign}
          className="glass-button text-purple-600 font-bold text-lg sm:text-xl py-3 rounded-2xl"
          title="Plus / Minus (+/-)"
        >
          ±
        </button>
        <button
          id="btn-0"
          onClick={(e) => handleDigit('0', e)}
          className="glass-button text-gray-700 font-bold text-xl sm:text-2xl py-3 rounded-2xl"
        >
          0
        </button>
        <button
          id="btn-decimal"
          onClick={handleDecimal}
          className="glass-button text-gray-700 font-bold text-xl sm:text-2xl py-3 rounded-2xl"
          title="Decimal (.)"
        >
          .
        </button>
        <button
          id="btn-equals"
          onClick={handleEquals}
          className="equals-button font-bold text-2xl py-3 rounded-2xl cursor-pointer"
          title="Equals (= / Enter)"
        >
          =
        </button>
      </div>

      {/* Helpful keyboard shortcut guide footer */}
      <div className="mt-4 pt-3 border-t border-pink-200/50 flex items-center justify-between text-[10px] text-gray-400">
        <span>Keyboard: 0-9, +, -, *, /, Enter</span>
        <span>Esc: Clear</span>
      </div>
    </div>
  );
}
