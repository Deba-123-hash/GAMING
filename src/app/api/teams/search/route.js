import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { listTeams } from '@/services/teamService';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const requestId = createRequestId();
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get('q') || url.searchParams.get('search') || '';
    const result = await listTeams({
      search: q,
      type: url.searchParams.get('type') || undefined,
    });
    return successResponse({
      message: 'Team search completed.',
      meta: { requestId, count: result.total },
      data: { teams: result.teams },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/teams/search' });
  }
}

