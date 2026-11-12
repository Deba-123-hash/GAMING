import { FORMATIONS_CONFIG } from '@/lib/formations';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';

export const dynamic = 'force-dynamic';

export async function GET() {
  const requestId = createRequestId();
  try {
    const formations = Object.values(FORMATIONS_CONFIG);
    return successResponse({
      message: 'Formations retrieved.',
      meta: { requestId, count: formations.length },
      data: { formations },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/formations' });
  }
}

