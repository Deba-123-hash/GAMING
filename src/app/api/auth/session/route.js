import { getServerSession } from '@/server/auth/sessionService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    return successResponse({
      message: session ? 'Authenticated session active.' : 'No active session.',
      meta: { requestId },
      data: {
        authenticated: Boolean(session),
        user: session?.user || null,
        profile: session?.profile || null,
        expiresAt: session?.expiresAt || null,
      },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/auth/session' });
  }
}
