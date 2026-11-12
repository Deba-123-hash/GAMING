import { ApiError, ERROR_CODES } from '@/server/utils/apiError';
import { createRequestId, errorResponse } from '@/server/utils/apiResponse';
import { logServerEvent } from '@/server/utils/requestLogger';

export function handleApiError(err, context = {}) {
  const requestId = context.requestId || createRequestId();

  if (err instanceof ApiError || err?.name === 'ExternalIntegrationError') {
    logServerEvent('WARN', err.message, {
      requestId,
      code: err.code,
      statusCode: err.statusCode,
      endpoint: context.endpoint,
    });
    return errorResponse({
      message: err.message,
      code: err.code,
      status: err.statusCode || 502,
      details: err.details || null,
      meta: { requestId },
    });
  }

  logServerEvent('ERROR', 'Unhandled API exception', {
    requestId,
    endpoint: context.endpoint,
    errorName: err?.name || 'Error',
  });

  return errorResponse({
    message: 'An unexpected server error occurred.',
    code: ERROR_CODES.INTERNAL_SERVER_ERROR,
    status: 500,
    meta: { requestId },
  });
}
