import { listCmsNews } from '@/server/services/cmsService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';

export const dynamic = 'force-dynamic';

export async function GET() {
  const requestId = createRequestId();
  try {
    const published = listCmsNews({ includeDrafts: false });
    const featured = published.filter((a) => a.isFeatured);
    return successResponse({
      message: 'Featured articles retrieved.',
      meta: { requestId, count: featured.length },
      data: { news: featured.length ? featured : published.slice(0, 3) },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/news/featured' });
  }
}

