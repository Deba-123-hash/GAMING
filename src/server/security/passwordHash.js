import crypto from 'node:crypto';

const KEY_LENGTH = 64;

export function hashPassword(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string.');
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password, storedHash) {
  if (!password || !storedHash || !storedHash.includes(':')) {
    return false;
  }
  const [salt, originalHex] = storedHash.split(':');
  if (!salt || !originalHex) return false;

  const derivedBuffer = crypto.scryptSync(password, salt, KEY_LENGTH);
  const originalBuffer = Buffer.from(originalHex, 'hex');
  if (derivedBuffer.length !== originalBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(derivedBuffer, originalBuffer);
}
