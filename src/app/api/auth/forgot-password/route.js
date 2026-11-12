import { requestPasswordReset } from '@/server/auth/authService';
import { forgotPasswordSchema } from '@/server/auth/authValidation';
import { checkRateLimit, getClientIdentifier } from '@/server/security/rateLimit';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const requestId = createRequestId();
  try {
    checkRateLimit({
      key: `auth:forgot:${getClientIdentifier(request)}`,
      limit: 10,
      windowMs: 60_000,
    });

    const body = await parseJsonBody(request);
    const input = validateWithSchema(forgotPasswordSchema, body);
    const result = requestPasswordReset({ ...input, requestId });

    return successResponse({
      message: result.message,
      meta: { requestId },
      data: {
        accepted: result.accepted,
        emailDelivered: result.emailDelivered,
        ...(result.devResetToken ? { devResetToken: result.devResetToken } : {}),
      },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/auth/forgot-password' });
  }
}
