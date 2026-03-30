import crypto from 'crypto';

/**
 * Performs a constant-time string comparison to prevent timing attacks.
 *
 * @param {string} a - First string to compare.
 * @param {string} b - Second string to compare.
 * @returns {boolean} True if strings are equal, false otherwise.
 */
export function secureCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }

  // Ensure both strings are the same length to prevent length-based timing attacks
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    // Compare against itself to maintain constant time
    crypto.timingSafeEqual(aBuffer, aBuffer);
    return false;
  }

  return crypto.timingSafeEqual(aBuffer, bBuffer);
}
