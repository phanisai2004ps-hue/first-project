/**
 * Curated horror messages, quotes, and comedic subscription copy
 */

export const FUNNY_HORROR_MESSAGES = [
  "You calculated your own destiny.",
  "Math was your first mistake.",
  "The ghost says your answer is 666.",
  "Your calculator has joined the dark side.",
  "ERROR 666: Soul not found.",
  "Your mathematics teacher has returned.",
  "You should have subscribed to Ghost Premium.",
  "The answer was inside you all along.",
  "Why did you press equals? WHY?",
  "The ghost is disappointed in your math skills."
];

export const CUTE_MASCOT_QUOTES = [
  "You're doing amazing, sweetie! 🌸",
  "Math is cute and totally safe! 💕",
  "Just don't calculate anything with 3 digits... wait what? 🤫",
  "Sparkles make numbers softer! ✨",
  "I believe in your algebra powers! 🎀",
  "Isn't this the sweetest calculator ever? 💖"
];

/**
 * Returns a random message from the horror quotes collection
 * @returns {string}
 */
export function getRandomHorrorMessage() {
  const index = Math.floor(Math.random() * FUNNY_HORROR_MESSAGES.length);
  return FUNNY_HORROR_MESSAGES[index];
}

/**
 * Returns a random mascot cheer
 * @returns {string}
 */
export function getRandomMascotQuote() {
  const index = Math.floor(Math.random() * CUTE_MASCOT_QUOTES.length);
  return CUTE_MASCOT_QUOTES[index];
}
