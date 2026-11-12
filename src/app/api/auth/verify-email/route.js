import { verifyEmailWithToken } from '@/server/auth/authService';
import { verifyEmailSchema } from '@/server/auth/authValidation';
import { checkRateLimit, getClientIdentifier } from '@/server/security/rateLimit';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const requestId = createRequestId();
  try {
    checkRateLimit({
      key: `auth:verify:${getClientIdentifier(request)}`,
      limit: 15,
      windowMs: 60_000,
    });

    const body = await parseJsonBody(request);
    const input = validateWithSchema(verifyEmailSchema, body);
    const result = verifyEmailWithToken({ token: input.token, requestId });

    return successResponse({
      message: 'Email address verified successfully.',
      meta: { requestId },
      data: result,
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/auth/verify-email' });
  }
}
