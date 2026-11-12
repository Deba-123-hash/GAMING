import { listCmsMedia } from '@/server/services/cmsService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';

export const dynamic = 'force-dynamic';

export async function GET() {
  const requestId = createRequestId();
  try {
    const published = listCmsMedia({ includeDrafts: false });
    const featured = published.filter((m) => m.isFeatured);
    return successResponse({
      message: 'Featured media retrieved.',
      meta: { requestId, count: featured.length },
      data: { media: featured.length ? featured : published.slice(0, 4) },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/media/featured' });
  }
}

