import { ApiError, ERROR_CODES } from '@/server/utils/apiError';

export async function parseJsonBody(request) {
  try {
    return await request.json();
  } catch {
    throw new ApiError({
      statusCode: 400,
      code: ERROR_CODES.BAD_REQUEST,
      message: 'Malformed JSON request body.',
    });
  }
}

export function validateWithSchema(schema, payload) {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new ApiError({
      statusCode: 400,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: 'Input validation failed.',
      details: parsed.error.flatten(),
    });
  }
  return parsed.data;
}
