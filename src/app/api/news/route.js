import { assertPermission, hasPermission } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { createCmsNews, listCmsNews } from '@/server/services/cmsService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';
import { newsMutationSchema } from '@/server/validation/domainSchemas';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const requestId = createRequestId();
  try {
    const url = new URL(request.url);
    const wantsDrafts = url.searchParams.get('includeDrafts') === 'true';
    let includeDrafts = false;
    if (wantsDrafts) {
      const session = await getServerSession(request);
      includeDrafts = Boolean(session && hasPermission(session.user, 'news.manage'));
    }

    const news = listCmsNews({
      category: url.searchParams.get('category') || undefined,
      search: url.searchParams.get('search') || undefined,
      includeDrafts,
    });

    return successResponse({
      message: 'News articles retrieved.',
      meta: { requestId, count: news.length },
      data: { news, count: news.length },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/news' });
  }
}

export async function POST(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const actor = assertPermission(session, 'news.manage');
    const body = await parseJsonBody(request);
    const input = validateWithSchema(newsMutationSchema, body);
    const article = createCmsNews(input, actor, requestId);

    return successResponse({
      status: 201,
      message: 'News article created.',
      meta: { requestId },
      data: { article },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/news' });
  }
}
