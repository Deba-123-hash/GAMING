import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { listPlayers } from '@/services/playerService';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const requestId = createRequestId();
  try {
    const url = new URL(request.url);
    const limit = Math.min(12, Math.max(1, Number(url.searchParams.get('limit') || 6)));
    const result = await listPlayers({ sort: 'ovr-desc', page: 1, pageSize: limit });
    return successResponse({
      message: 'Featured athletes retrieved.',
      meta: { requestId, count: result.players.length },
      data: { players: result.players },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/players/featured' });
  }
}

