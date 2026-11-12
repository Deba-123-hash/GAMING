import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { listStadiums } from '@/services/contentService';

export const dynamic = 'force-dynamic';

export async function GET() {
  const requestId = createRequestId();
  try {
    const { items, source } = await listStadiums();
    return successResponse({
      message: 'Stadiums retrieved.',
      meta: { requestId, count: items.length, source },
      data: { stadiums: items, count: items.length },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/stadiums' });
  }
}
