import {
  buildClearSessionCookieOptions,
  getServerSession,
  revokeSessionById,
} from '@/server/auth/sessionService';
import { recordAuditEvent } from '@/server/services/auditService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    if (session) {
      revokeSessionById(session.sessionId);
      recordAuditEvent({
        actorUserId: session.user.id,
        actorRole: session.user.role,
        action: 'auth.logout',
        targetType: 'session',
        targetId: session.sessionId,
        requestId,
      });
    }

    const response = successResponse({
      message: 'Signed out successfully.',
      meta: { requestId },
      data: { loggedOut: true },
    });
    response.cookies.set(buildClearSessionCookieOptions());
    return response;
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/auth/logout' });
  }
}
