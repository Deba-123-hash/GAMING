import { ApiError, ERROR_CODES } from '@/server/utils/apiError';

const PG_ERROR_MAP = {
  23505: {
    statusCode: 409,
    code: ERROR_CODES.CONFLICT,
    message: 'A record with the same unique identifier already exists.',
  },
  23503: {
    statusCode: 400,
    code: ERROR_CODES.BAD_REQUEST,
    message: 'Referenced related record does not exist or cannot be modified.',
  },
  23514: {
    statusCode: 400,
    code: ERROR_CODES.VALIDATION_ERROR,
    message: 'Record violates a database data integrity constraint.',
  },
  23502: {
    statusCode: 400,
    code: ERROR_CODES.VALIDATION_ERROR,
    message: 'A required field is missing.',
  },
  42501: {
    statusCode: 403,
    code: ERROR_CODES.FORBIDDEN,
    message: 'Database security policy denied access to this resource.',
  },
  57014: {
    statusCode: 504,
    code: ERROR_CODES.INTERNAL_ERROR,
    message: 'Database query timed out. Please retry shortly.',
  },
};

/**
 * Translates PostgreSQL / PostgREST / network errors into safe ApiError responses
 * without ever exposing raw SQL strings, table schemas, or connection URLs.
 */
export function normalizeDatabaseError(error) {
  if (error instanceof ApiError) return error;

  const pgCode = String(error?.code || '');
  if (pgCode && PG_ERROR_MAP[pgCode]) {
    const mapped = PG_ERROR_MAP[pgCode];
    return new ApiError({
      statusCode: mapped.statusCode,
      code: mapped.code,
      message: mapped.message,
      cause: error,
    });
  }

  const msg = String(error?.message || '').toLowerCase();
  if (msg.includes('timeout') || msg.includes('aborted') || error?.name === 'TimeoutError') {
    return new ApiError({
      statusCode: 504,
      code: ERROR_CODES.INTERNAL_ERROR,
      message: 'Database request exceeded timeout threshold.',
      cause: error,
    });
  }

  if (msg.includes('fetch failed') || msg.includes('econnrefused') || msg.includes('enotfound')) {
    return new ApiError({
      statusCode: 503,
      code: ERROR_CODES.INTERNAL_ERROR,
      message: 'Database service is temporarily unavailable.',
      cause: error,
    });
  }

  return new ApiError({
    statusCode: 500,
    code: ERROR_CODES.INTERNAL_ERROR,
    message: 'A database operation failed safely.',
    cause: error,
  });
}
