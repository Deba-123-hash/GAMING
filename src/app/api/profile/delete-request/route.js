import { assertAuthenticated } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { getDevStore } from '@/server/database/devMemoryStore';
import { recordAuditEvent } from '@/server/services/auditService';
import { ApiError, ERROR_CODES } from '@/server/utils/apiError';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody } from '@/server/utils/validation';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);
    const body = await parseJsonBody(request);
    if (body?.confirmUsername !== user.username) {
      throw new ApiError({
        statusCode: 400,
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Please type your exact username to confirm deletion request.',
      });
    }

    const store = getDevStore();
    const record = store.users.find((u) => u.id === user.id);
    if (record) {
      record.deletionRequestedAt = new Date().toISOString();
    }

    recordAuditEvent({
      actorUserId: user.id,
      actorRole: user.role,
      action: 'profile.deletion_requested',
      targetType: 'user',
      targetId: user.id,
      requestId,
    });

    return successResponse({
      message:
        'Account deletion request recorded. Permanent erasure completes during Phase 19/20 database purge jobs.',
      meta: { requestId },
      data: {
        requestedAt: record?.deletionRequestedAt || new Date().toISOString(),
      },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/profile/delete-request' });
  }
}
