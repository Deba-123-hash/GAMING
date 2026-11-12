import { assertAuthenticated } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { getDevStore } from '@/server/database/devMemoryStore';
import { recordAuditEvent } from '@/server/services/auditService';
import { findCmsEvent, registerForEvent } from '@/server/services/cmsService';
import { ApiError, ERROR_CODES } from '@/server/utils/apiError';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';

export const dynamic = 'force-dynamic';

export async function POST(request, context) {
  const requestId = createRequestId();
  try {
    const { slug } = await context.params;
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);
    const registration = registerForEvent(slug, user.id);

    recordAuditEvent({
      actorUserId: user.id,
      actorRole: user.role,
      action: 'event.register',
      targetType: 'event',
      targetId: registration.eventId,
      requestId,
    });

    return successResponse({
      status: 201,
      message: 'Registered for event successfully.',
      meta: { requestId },
      data: { registration },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/events/[slug]/register' });
  }
}

export async function DELETE(request, context) {
  const requestId = createRequestId();
  try {
    const { slug } = await context.params;
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);
    const ev = findCmsEvent(slug);
    if (!ev) {
      throw new ApiError({
        statusCode: 404,
        code: ERROR_CODES.NOT_FOUND,
        message: 'Event not found.',
      });
    }
    const store = getDevStore();
    const before = store.eventRegistrations.length;
    store.eventRegistrations = store.eventRegistrations.filter(
      (r) => !(r.eventId === ev.id && r.userId === user.id)
    );
    if (store.eventRegistrations.length === before) {
      throw new ApiError({
        statusCode: 404,
        code: ERROR_CODES.NOT_FOUND,
        message: 'Registration record not found.',
      });
    }

    recordAuditEvent({
      actorUserId: user.id,
      actorRole: user.role,
      action: 'event.unregister',
      targetType: 'event',
      targetId: ev.id,
      requestId,
    });

    return successResponse({
      message: 'Event registration cancelled.',
      meta: { requestId },
      data: { eventId: ev.id, cancelled: true },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/events/[slug]/register' });
  }
}
