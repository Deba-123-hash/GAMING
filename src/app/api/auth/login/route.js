import { loginUser } from '@/server/auth/authService';
import { loginSchema } from '@/server/auth/authValidation';
import { buildSessionCookieOptions } from '@/server/auth/sessionService';
import { checkRateLimit, getClientIdentifier } from '@/server/security/rateLimit';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { logServerEvent } from '@/server/utils/requestLogger';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const requestId = createRequestId();
  try {
    checkRateLimit({
      key: `auth:login:${getClientIdentifier(request)}`,
      limit: 20,
      windowMs: 60_000,
    });

    const body = await parseJsonBody(request);
    const input = validateWithSchema(loginSchema, body);
    const result = loginUser({ ...input, requestId });

    const response = successResponse({
      message: 'Signed in successfully.',
      meta: { requestId },
      data: {
        user: result.user,
        profile: result.profile,
      },
    });

    response.cookies.set({
      ...buildSessionCookieOptions(),
      value: result.session.signedToken,
    });

    logServerEvent('info', 'User signed in', { requestId, userId: result.user.id });
    return response;
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/auth/login' });
  }
}
