import { assertPermission, hasPermission } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { ApiError, ERROR_CODES } from '@/server/utils/apiError';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';
import { teamMutationSchema } from '@/server/validation/domainSchemas';
import {
  deleteMasterTeam,
  findTeamById,
  getTeamRoster,
  updateMasterTeam,
} from '@/services/teamService';

export const dynamic = 'force-dynamic';

export async function GET(request, context) {
  const requestId = createRequestId();
  try {
    const { teamId } = await context.params;
    const session = await getServerSession(request);
    const includeDrafts = Boolean(session && hasPermission(session.user, 'teams.manage'));
    const { team } = await findTeamById(teamId, { includeDrafts });
    if (!team) {
      throw new ApiError({
        statusCode: 404,
        code: ERROR_CODES.NOT_FOUND,
        message: 'Team not found.',
      });
    }
    const roster = getTeamRoster(team.id);
    return successResponse({
      message: 'Team loaded.',
      meta: { requestId },
      data: { team, roster },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/teams/[teamId]' });
  }
}

export async function PATCH(request, context) {
  const requestId = createRequestId();
  try {
    const { teamId } = await context.params;
    const session = await getServerSession(request);
    const actor = assertPermission(session, 'teams.manage');
    const body = await parseJsonBody(request);
    const input = validateWithSchema(teamMutationSchema.partial(), body);
    const team = updateMasterTeam(teamId, input, actor, requestId);

    return successResponse({
      message: 'Team updated.',
      meta: { requestId },
      data: { team },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/teams/[teamId]' });
  }
}

export async function DELETE(request, context) {
  const requestId = createRequestId();
  try {
    const { teamId } = await context.params;
    const session = await getServerSession(request);
    const actor = assertPermission(session, 'teams.manage');
    const result = deleteMasterTeam(teamId, actor, requestId);

    return successResponse({
      message: 'Team deleted.',
      meta: { requestId },
      data: result,
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/teams/[teamId]' });
  }
}
