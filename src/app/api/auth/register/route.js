import { registerUser } from '@/server/auth/authService';
import { registerSchema } from '@/server/auth/authValidation';
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
      key: `auth:register:${getClientIdentifier(request)}`,
      limit: 12,
      windowMs: 60_000,
    });

    const body = await parseJsonBody(request);
    const input = validateWithSchema(registerSchema, body);
    const result = registerUser({ ...input, requestId });

    const response = successResponse({
      status: 201,
      message: 'Account registered successfully.',
      meta: { requestId },
      data: {
        user: result.user,
        profile: result.profile,
        emailDelivered: result.emailDelivered,
        verificationStatus: result.verificationStatus,
        ...(result.devVerificationToken
          ? { devVerificationToken: result.devVerificationToken }
          : {}),
      },
    });

    response.cookies.set({
      ...buildSessionCookieOptions(),
      value: result.session.signedToken,
    });

    logServerEvent('info', 'User registered', { requestId, userId: result.user.id });
    return response;
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/auth/register' });
  }
}
