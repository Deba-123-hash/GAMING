import { assertPermission, hasPermission } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';
import { teamMutationSchema } from '@/server/validation/domainSchemas';
import { createMasterTeam, listTeams } from '@/services/teamService';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const requestId = createRequestId();
  try {
    const url = new URL(request.url);
    const wantsDrafts = url.searchParams.get('includeDrafts') === 'true';
    let includeDrafts = false;
    if (wantsDrafts) {
      const session = await getServerSession(request);
      includeDrafts = Boolean(session && hasPermission(session.user, 'teams.manage'));
    }

    const result = await listTeams({
      type: url.searchParams.get('type') || undefined,
      country: url.searchParams.get('country') || undefined,
      search: url.searchParams.get('search') || undefined,
      sort: url.searchParams.get('sort') || 'rating-desc',
      includeDrafts,
    });

    return successResponse({
      message: 'Teams retrieved.',
      meta: { requestId, total: result.total, source: result.source },
      data: { teams: result.teams, total: result.total },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/teams' });
  }
}

export async function POST(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const actor = assertPermission(session, 'teams.manage');
    const body = await parseJsonBody(request);
    const input = validateWithSchema(teamMutationSchema, body);
    const team = createMasterTeam(input, actor, requestId);

    return successResponse({
      status: 201,
      message: 'Team created.',
      meta: { requestId },
      data: { team },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/teams' });
  }
}
