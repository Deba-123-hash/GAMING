import { assertPermission } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { getDevStore } from '@/server/database/devMemoryStore';
import { findCmsEvent } from '@/server/services/cmsService';
import { ApiError, ERROR_CODES } from '@/server/utils/apiError';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';

export const dynamic = 'force-dynamic';

export async function GET(request, context) {
  const requestId = createRequestId();
  try {
    const { slug } = await context.params;
    const session = await getServerSession(request);
    assertPermission(session, 'events.manage');

    const ev = findCmsEvent(slug, { includeDrafts: true });
    if (!ev) {
      throw new ApiError({
        statusCode: 404,
        code: ERROR_CODES.NOT_FOUND,
        message: 'Event not found.',
      });
    }
    const store = getDevStore();
    const registrations = store.eventRegistrations
      .filter((r) => r.eventId === ev.id)
      .map((r) => ({
        id: r.id,
        eventId: r.eventId,
        status: r.status,
        registeredAt: r.registeredAt,
      }));

    return successResponse({
      message: 'Event registrations retrieved.',
      meta: { requestId, count: registrations.length },
      data: { registrations },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/events/[slug]/registrations' });
  }
}
