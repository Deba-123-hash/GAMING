const SENSITIVE_KEYS = new Set([
  'password',
  'confirmPassword',
  'currentPassword',
  'newPassword',
  'token',
  'resetToken',
  'secret',
  'authorization',
  'cookie',
  'apiKey',
]);

export function sanitizeLogMeta(obj = {}) {
  if (!obj || typeof obj !== 'object') return obj;
  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (
      SENSITIVE_KEYS.has(key) ||
      key.toLowerCase().includes('secret') ||
      key.toLowerCase().includes('password')
    ) {
      clean[key] = '[REDACTED]';
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      clean[key] = sanitizeLogMeta(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

export function logServerEvent(level, message, meta = {}) {
  const entry = {
    level: String(level || 'INFO').toUpperCase(),
    message,
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    ...sanitizeLogMeta(meta),
  };

  if (entry.level === 'DEBUG' && entry.env === 'production') {
    return;
  }

  if (entry.level === 'ERROR') {
    console.error(JSON.stringify(entry));
  } else if (entry.level === 'WARN') {
    console.warn(JSON.stringify(entry));
  } else if (process.env.NODE_ENV !== 'test') {
    console.info(JSON.stringify(entry));
  }
}
