import { getExternalFixtures } from '@/services/external/footballDataService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const requestId = createRequestId();
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || 'SCHEDULED';
    const result = await getExternalFixtures(status);
    return successResponse({
      message: result.live ? 'External fixtures loaded.' : result.message,
      meta: { requestId, source: result.source, configured: result.configured, live: result.live },
      data: result,
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/football/fixtures' });
  }
}

