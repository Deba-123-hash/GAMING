import { assertPermission, hasPermission } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { deleteCmsNews, findCmsNews, updateCmsNews } from '@/server/services/cmsService';
import { ApiError, ERROR_CODES } from '@/server/utils/apiError';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';
import { newsMutationSchema } from '@/server/validation/domainSchemas';

export const dynamic = 'force-dynamic';

export async function GET(request, context) {
  const requestId = createRequestId();
  try {
    const { slug } = await context.params;
    const session = await getServerSession(request);
    const includeDrafts = Boolean(session && hasPermission(session.user, 'news.manage'));
    const article = findCmsNews(slug, { includeDrafts });
    if (!article) {
      throw new ApiError({
        statusCode: 404,
        code: ERROR_CODES.NOT_FOUND,
        message: 'Article not found.',
      });
    }

    return successResponse({
      message: 'Article loaded.',
      meta: { requestId },
      data: { article },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/news/[slug]' });
  }
}

export async function PATCH(request, context) {
  const requestId = createRequestId();
  try {
    const { slug } = await context.params;
    const session = await getServerSession(request);
    const actor = assertPermission(session, 'news.manage');
    const body = await parseJsonBody(request);
    const input = validateWithSchema(newsMutationSchema.partial(), body);
    const article = updateCmsNews(slug, input, actor, requestId);

    return successResponse({
      message: 'Article updated.',
      meta: { requestId },
      data: { article },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/news/[slug]' });
  }
}

export async function DELETE(request, context) {
  const requestId = createRequestId();
  try {
    const { slug } = await context.params;
    const session = await getServerSession(request);
    const actor = assertPermission(session, 'news.manage');
    const result = deleteCmsNews(slug, actor, requestId);

    return successResponse({
      message: 'Article deleted.',
      meta: { requestId },
      data: result,
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/news/[slug]' });
  }
}
