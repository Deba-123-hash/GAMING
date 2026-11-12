import { assertPermission, hasPermission } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';
import { playerMutationSchema } from '@/server/validation/domainSchemas';
import { createMasterPlayer, listPlayers } from '@/services/playerService';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const requestId = createRequestId();
  try {
    const url = new URL(request.url);
    const wantsDrafts = url.searchParams.get('includeDrafts') === 'true';
    let includeDrafts = false;
    if (wantsDrafts) {
      const session = await getServerSession(request);
      includeDrafts = Boolean(session && hasPermission(session.user, 'players.update'));
    }

    const result = await listPlayers({
      position: url.searchParams.get('position') || undefined,
      teamId: url.searchParams.get('teamId') || undefined,
      nationality: url.searchParams.get('nationality') || undefined,
      minOvr: url.searchParams.get('minOvr') || undefined,
      maxOvr: url.searchParams.get('maxOvr') || undefined,
      search: url.searchParams.get('search') || undefined,
      sort: url.searchParams.get('sort') || 'ovr-desc',
      page: url.searchParams.get('page') || 1,
      pageSize: url.searchParams.get('pageSize') || 50,
      includeDrafts,
    });

    return successResponse({
      message: 'Players retrieved.',
      meta: {
        requestId,
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        source: result.source,
      },
      data: {
        players: result.players,
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
      },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/players' });
  }
}

export async function POST(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const actor = assertPermission(session, 'players.create');
    const body = await parseJsonBody(request);
    const input = validateWithSchema(playerMutationSchema, body);
    const player = createMasterPlayer(input, actor, requestId);

    return successResponse({
      status: 201,
      message: 'Player record created.',
      meta: { requestId },
      data: { player },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/players' });
  }
}
