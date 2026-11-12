import { ApiError, ERROR_CODES } from '@/server/utils/apiError';

/**
 * Sliding-window rate-limiter adapter.
 * NOTE: In-memory storage applies per-server-instance only. For multi-instance
 * serverless production deployments, plug in a distributed Redis/Upstash store
 * in Phase 20/25.
 */
const buckets = new Map();

export function getClientIdentifier(request) {
  if (!request?.headers) return 'local-client';
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'local-client';
}

export function checkRateLimit({ key, limit = 30, windowMs = 60_000 }) {
  const now = Date.now();
  const timestamps = (buckets.get(key) || []).filter((ts) => now - ts < windowMs);

  if (timestamps.length >= limit) {
    throw new ApiError({
      statusCode: 429,
      code: ERROR_CODES.RATE_LIMITED,
      message: 'Too many requests. Please wait a moment and try again.',
    });
  }

  timestamps.push(now);
  buckets.set(key, timestamps);
  return { remaining: Math.max(0, limit - timestamps.length) };
}

export function resetRateLimitStore() {
  buckets.clear();
}
