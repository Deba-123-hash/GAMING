import { resetPasswordWithToken } from '@/server/auth/authService';
import { resetPasswordSchema } from '@/server/auth/authValidation';
import { checkRateLimit, getClientIdentifier } from '@/server/security/rateLimit';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const requestId = createRequestId();
  try {
    checkRateLimit({
      key: `auth:reset:${getClientIdentifier(request)}`,
      limit: 10,
      windowMs: 60_000,
    });

    const body = await parseJsonBody(request);
    const input = validateWithSchema(resetPasswordSchema, body);
    const result = resetPasswordWithToken({
      token: input.token,
      newPassword: input.newPassword,
      requestId,
    });

    return successResponse({
      message: 'Password updated. All existing sessions have been signed out.',
      meta: { requestId },
      data: result,
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/auth/reset-password' });
  }
}
