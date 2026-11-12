import { buildPaginationMeta, parsePaginationParams } from '@/lib/api/pagination';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { listPlayers } from '@/services/playerService';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const requestId = createRequestId();
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get('q') || url.searchParams.get('search') || '';
    const { page, limit } = parsePaginationParams(url.searchParams, { defaultLimit: 12 });
    const result = await listPlayers({
      search: q,
      position: url.searchParams.get('position') || undefined,
      teamId: url.searchParams.get('teamId') || undefined,
      page,
      pageSize: limit,
    });

    return successResponse({
      message: 'Player search completed.',
      meta: { requestId, ...buildPaginationMeta({ page, limit, total: result.total }) },
      data: { players: result.players },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/players/search' });
  }
}

