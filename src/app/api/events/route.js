import { assertPermission, hasPermission } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { createCmsEvent, listCmsEvents } from '@/server/services/cmsService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';
import { eventMutationSchema } from '@/server/validation/domainSchemas';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const requestId = createRequestId();
  try {
    const url = new URL(request.url);
    const wantsDrafts = url.searchParams.get('includeDrafts') === 'true';
    let includeDrafts = false;
    if (wantsDrafts) {
      const session = await getServerSession(request);
      includeDrafts = Boolean(session && hasPermission(session.user, 'events.manage'));
    }

    const events = listCmsEvents({
      category: url.searchParams.get('category') || undefined,
      status: url.searchParams.get('status') || undefined,
      search: url.searchParams.get('search') || undefined,
      includeDrafts,
    });

    return successResponse({
      message: 'Events retrieved.',
      meta: { requestId, count: events.length },
      data: { events, count: events.length },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/events' });
  }
}

export async function POST(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const actor = assertPermission(session, 'events.manage');
    const body = await parseJsonBody(request);
    const input = validateWithSchema(eventMutationSchema, body);
    const event = createCmsEvent(input, actor, requestId);

    return successResponse({
      status: 201,
      message: 'Event created.',
      meta: { requestId },
      data: { event },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/events' });
  }
}
