import { ApiError, ERROR_CODES } from '@/server/utils/apiError';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { findTeamById, getTeamRoster } from '@/services/teamService';

export const dynamic = 'force-dynamic';

export async function GET(request, context) {
  const requestId = createRequestId();
  try {
    const { teamId } = await context.params;
    const { team } = await findTeamById(teamId);
    if (!team) {
      throw new ApiError({
        statusCode: 404,
        code: ERROR_CODES.NOT_FOUND,
        message: 'Team not found.',
      });
    }
    const players = getTeamRoster(team.id);
    return successResponse({
      message: 'Team roster retrieved.',
      meta: { requestId, count: players.length },
      data: { team, players },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/teams/[teamId]/players' });
  }
}
