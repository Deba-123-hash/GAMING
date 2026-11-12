import {
  ExternalIntegrationError,
  mapExternalHttpError,
} from '@/lib/integrations/integrationErrors';
import { logServerEvent } from '@/server/utils/requestLogger';

function waitMs(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Reliable external HTTP fetcher with timeout, safe error normalization,
 * bounded retries ONLY for transient GET failures, and zero secret logging.
 */
export async function fetchWithReliability({
  providerId,
  url,
  method = 'GET',
  headers = {},
  body = undefined,
  timeoutMs = 7000,
  maxRetries = 1,
}) {
  const upperMethod = method.toUpperCase();
  const canRetryMethod = upperMethod === 'GET';
  const attempts = canRetryMethod ? Math.max(1, maxRetries + 1) : 1;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: upperMethod,
        headers,
        body,
        signal: controller.signal,
      });

      if (!response.ok) {
        const mapped = mapExternalHttpError({
          providerId,
          status: response.status,
          retryAfterHeader: response.headers.get('retry-after'),
        });
        if (mapped.retryable && attempt < attempts) {
          await waitMs(200 * attempt);
          continue;
        }
        throw mapped;
      }

      const json = await response.json().catch(() => null);
      if (!json) {
        throw new ExternalIntegrationError({
          providerId,
          statusCode: 502,
          code: 'PROVIDER_INVALID_JSON',
          message: `${providerId} returned non-JSON or empty response.`,
        });
      }

      return { data: json, headers: response.headers };
    } catch (err) {
      if (err instanceof ExternalIntegrationError) {
        logServerEvent('warn', 'External integration request failed', {
          providerId,
          code: err.code,
          statusCode: err.statusCode,
        });
        throw err;
      }

      const isTimeout = err?.name === 'AbortError' || String(err?.message || '').includes('abort');
      if (!isTimeout && canRetryMethod && attempt < attempts) {
        await waitMs(200 * attempt);
        continue;
      }

      throw new ExternalIntegrationError({
        providerId,
        statusCode: isTimeout ? 504 : 503,
        code: isTimeout ? 'PROVIDER_TIMEOUT' : 'PROVIDER_NETWORK_ERROR',
        message: isTimeout
          ? `${providerId} request timed out.`
          : `${providerId} could not be reached.`,
      });
    } finally {
      clearTimeout(timer);
    }
  }
}

