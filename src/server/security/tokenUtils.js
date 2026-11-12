import crypto from 'node:crypto';

function getSigningSecret() {
  if (process.env.AUTH_SESSION_SECRET && process.env.AUTH_SESSION_SECRET.length >= 16) {
    return process.env.AUTH_SESSION_SECRET;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SESSION_SECRET must be configured in production.');
  }
  if (!globalThis.__r90DevSessionSecret) {
    globalThis.__r90DevSessionSecret = crypto.randomBytes(32).toString('hex');
  }
  return globalThis.__r90DevSessionSecret;
}

export function signSessionToken(payload) {
  const secret = getSigningSecret();
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    return null;
  }
  const [encoded, providedSig] = token.split('.');
  if (!encoded || !providedSig) return null;

  try {
    const secret = getSigningSecret();
    const expectedSig = crypto.createHmac('sha256', secret).update(encoded).digest('base64url');
    const a = Buffer.from(providedSig, 'utf8');
    const b = Buffer.from(expectedSig, 'utf8');
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return null;
    }
    const decoded = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!decoded?.sid || !decoded?.uid || !decoded?.exp || Date.now() > decoded.exp) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export function generateOneTimeToken() {
  return crypto.randomBytes(24).toString('hex');
}

export function hashOneTimeToken(rawToken) {
  return crypto
    .createHash('sha256')
    .update(String(rawToken || ''))
    .digest('hex');
}
