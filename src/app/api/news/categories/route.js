import { getDevStore } from '@/server/database/devMemoryStore';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';

export const dynamic = 'force-dynamic';

export async function GET() {
  const requestId = createRequestId();
  try {
    const store = getDevStore();
    const categories = store.categories.filter((c) => c.contentType === 'news' && c.enabled);
    return successResponse({
      message: 'News categories retrieved.',
      meta: { requestId, count: categories.length },
      data: { categories },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/news/categories' });
  }
}

