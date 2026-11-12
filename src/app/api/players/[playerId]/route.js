import { assertPermission, hasPermission } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { ApiError, ERROR_CODES } from '@/server/utils/apiError';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';
import { playerMutationSchema } from '@/server/validation/domainSchemas';
import { deleteMasterPlayer, findPlayerById, updateMasterPlayer } from '@/services/playerService';

export const dynamic = 'force-dynamic';

export async function GET(request, context) {
  const requestId = createRequestId();
  try {
    const { playerId } = await context.params;
    const session = await getServerSession(request);
    const includeDrafts = Boolean(session && hasPermission(session.user, 'players.update'));
    const { player } = await findPlayerById(playerId, { includeDrafts });
    if (!player) {
      throw new ApiError({
        statusCode: 404,
        code: ERROR_CODES.NOT_FOUND,
        message: 'Player not found.',
      });
    }
    return successResponse({
      message: 'Player profile loaded.',
      meta: { requestId },
      data: { player },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/players/[playerId]' });
  }
}

export async function PATCH(request, context) {
  const requestId = createRequestId();
  try {
    const { playerId } = await context.params;
    const session = await getServerSession(request);
    const actor = assertPermission(session, 'players.update');
    const body = await parseJsonBody(request);
    const input = validateWithSchema(playerMutationSchema.partial(), body);
    const player = updateMasterPlayer(playerId, input, actor, requestId);

    return successResponse({
      message: 'Player updated.',
      meta: { requestId },
      data: { player },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/players/[playerId]' });
  }
}

export async function DELETE(request, context) {
  const requestId = createRequestId();
  try {
    const { playerId } = await context.params;
    const session = await getServerSession(request);
    const actor = assertPermission(session, 'players.delete');
    const result = deleteMasterPlayer(playerId, actor, requestId);

    return successResponse({
      message: 'Player removed.',
      meta: { requestId },
      data: result,
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/players/[playerId]' });
  }
}
