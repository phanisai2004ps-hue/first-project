/**
 * Safe Mathematical Calculator Engine & Horror Input Detector
 * Strictly avoids eval() / new Function() for safety and reliability.
 */

export const OPERATORS = ['+', '-', '×', '÷', '*', '/'];

/**
 * Counts the total number of numeric digits (0-9) in the input string,
 * ignoring operators, spaces, parentheses, and decimal points.
 * @param {string} input 
 * @returns {number}
 */
export function countNumericDigits(input) {
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
export function shouldTriggerHorror(input) {
  return countNumericDigits(input) >= 3;
}

/**
 * Tokenizes a mathematical expression string into tokens (numbers and operators)
 * @param {string} expr 
 * @returns {Array<string|number>}
 */
function tokenize(expr) {
  const normalized = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/\s+/g, '');

  const tokens = [];
  let currentNum = '';

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];

    if ((char >= '0' && char <= '9') || char === '.') {
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
export function calculateExpression(expression) {
  try {
    if (!expression || expression.trim() === '') {
      return { success: true, result: '0' };
    }

    const tokens = tokenize(expression);
    if (tokens.length === 0) {
      return { success: true, result: '0' };
    }

    const value = evaluateTokens(tokens);

    if (isNaN(value) || !isFinite(value)) {
      return { success: false, error: 'Undefined 💫' };
    }

    // Format output cleanly (limit floating point inaccuracies)
    let formatted = Math.round(value * 100000000) / 100000000;
    return { success: true, result: formatted.toString() };
  } catch (err) {
    return { success: false, error: err.message || 'Math Error 💕' };
  }
}
