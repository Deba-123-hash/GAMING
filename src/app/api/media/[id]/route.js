import { assertPermission, hasPermission } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { getDevStore } from '@/server/database/devMemoryStore';
import { recordAuditEvent } from '@/server/services/auditService';
import { deleteCmsMedia } from '@/server/services/cmsService';
import { ApiError, ERROR_CODES } from '@/server/utils/apiError';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';
import { mediaMutationSchema } from '@/server/validation/domainSchemas';

export const dynamic = 'force-dynamic';

export async function GET(request, context) {
  const requestId = createRequestId();
  try {
    const { id } = await context.params;
    const session = await getServerSession(request);
    const includeDrafts = Boolean(session && hasPermission(session.user, 'media.manage'));
    const store = getDevStore();
    const item = store.media.find((m) => m.id === id);
    if (!item || (!includeDrafts && item.publicationStatus !== 'published')) {
      throw new ApiError({
        statusCode: 404,
        code: ERROR_CODES.NOT_FOUND,
        message: 'Media item not found.',
      });
    }
    return successResponse({
      message: 'Media item loaded.',
      meta: { requestId },
      data: { item },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/media/[id]' });
  }
}

export async function PATCH(request, context) {
  const requestId = createRequestId();
  try {
    const { id } = await context.params;
    const session = await getServerSession(request);
    const actor = assertPermission(session, 'media.manage');
    const body = await parseJsonBody(request);
    const updates = validateWithSchema(mediaMutationSchema.partial(), body);
    const store = getDevStore();
    const item = store.media.find((m) => m.id === id);
    if (!item) {
      throw new ApiError({
        statusCode: 404,
        code: ERROR_CODES.NOT_FOUND,
        message: 'Media item not found.',
      });
    }
    Object.assign(item, updates);
    recordAuditEvent({
      actorUserId: actor.id,
      actorRole: actor.role,
      action: 'media.update',
      targetType: 'media',
      targetId: item.id,
      requestId,
    });
    return successResponse({
      message: 'Media item updated.',
      meta: { requestId },
      data: { item },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/media/[id]' });
  }
}

export async function DELETE(request, context) {
  const requestId = createRequestId();
  try {
    const { id } = await context.params;
    const session = await getServerSession(request);
    const actor = assertPermission(session, 'media.manage');
    const result = deleteCmsMedia(id, actor, requestId);

    return successResponse({
      message: 'Media item removed.',
      meta: { requestId },
      data: result,
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/media/[id]' });
  }
}
