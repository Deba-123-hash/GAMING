export class ExternalIntegrationError extends Error {
  constructor({
    providerId,
    statusCode = 502,
    code = 'EXTERNAL_PROVIDER_ERROR',
    message = 'External service request failed.',
    retryable = false,
  }) {
    super(message);
    this.name = 'ExternalIntegrationError';
    this.providerId = providerId;
    this.statusCode = statusCode;
    this.code = code;
    this.retryable = retryable;
  }
}

export function mapExternalHttpError({ providerId, status, retryAfterHeader = null }) {
  if (status === 401 || status === 403) {
    return new ExternalIntegrationError({
      providerId,
      statusCode: 502,
      code: 'PROVIDER_AUTH_FAILED',
      message: `${providerId} rejected configured credentials.`,
      retryable: false,
    });
  }
  if (status === 429) {
    const suffix = retryAfterHeader ? ` Retry after ${retryAfterHeader}s.` : '';
    return new ExternalIntegrationError({
      providerId,
      statusCode: 429,
      code: 'PROVIDER_RATE_LIMITED',
      message: `${providerId} rate limit reached.${suffix}`,
      retryable: false,
    });
  }
  if (status >= 500) {
    return new ExternalIntegrationError({
      providerId,
      statusCode: 502,
      code: 'PROVIDER_UPSTREAM_UNAVAILABLE',
      message: `${providerId} returned an upstream server error (${status}).`,
      retryable: true,
    });
  }
  return new ExternalIntegrationError({
    providerId,
    statusCode: 502,
    code: 'PROVIDER_BAD_RESPONSE',
    message: `${providerId} returned HTTP ${status}.`,
    retryable: false,
  });
}

