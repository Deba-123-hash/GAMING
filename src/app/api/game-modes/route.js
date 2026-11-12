import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { listGameModes } from '@/services/contentService';

export const dynamic = 'force-dynamic';

export async function GET() {
  const requestId = createRequestId();
  try {
    const { items, source } = await listGameModes();
    return successResponse({
      message: 'Game modes retrieved.',
      meta: { requestId, count: items.length, source },
      data: { gameModes: items, count: items.length },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/game-modes' });
  }
}
