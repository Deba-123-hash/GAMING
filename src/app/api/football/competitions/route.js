import { getExternalCompetitions } from '@/services/external/footballDataService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';

export const dynamic = 'force-dynamic';

export async function GET() {
  const requestId = createRequestId();
  try {
    const result = await getExternalCompetitions();
    return successResponse({
      message: result.live ? 'Live external competitions loaded.' : result.message,
      meta: { requestId, source: result.source, configured: result.configured, live: result.live },
      data: result,
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/football/competitions' });
  }
}

