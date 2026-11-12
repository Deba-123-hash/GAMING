import { assertPermission, hasPermission } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { createCmsMedia, listCmsMedia } from '@/server/services/cmsService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';
import { mediaMutationSchema } from '@/server/validation/domainSchemas';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const requestId = createRequestId();
  try {
    const url = new URL(request.url);
    const wantsDrafts = url.searchParams.get('includeDrafts') === 'true';
    let includeDrafts = false;
    if (wantsDrafts) {
      const session = await getServerSession(request);
      includeDrafts = Boolean(session && hasPermission(session.user, 'media.manage'));
    }

    const media = listCmsMedia({
      category: url.searchParams.get('category') || undefined,
      mediaType: url.searchParams.get('mediaType') || undefined,
      includeDrafts,
    });

    return successResponse({
      message: 'Media items retrieved.',
      meta: { requestId, count: media.length },
      data: { media, count: media.length },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/media' });
  }
}

export async function POST(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const actor = assertPermission(session, 'media.manage');
    const body = await parseJsonBody(request);
    const input = validateWithSchema(mediaMutationSchema, body);
    const item = createCmsMedia(input, actor, requestId);

    return successResponse({
      status: 201,
      message: 'Media item added.',
      meta: { requestId },
      data: { item },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/media' });
  }
}
