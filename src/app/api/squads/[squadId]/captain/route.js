import { z } from 'zod';
import { assertAuthenticated } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { ApiError, ERROR_CODES } from '@/server/utils/apiError';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';
import { getOwnedSquad, updateOwnedSquad } from '@/services/squadService';

export const dynamic = 'force-dynamic';

const captainSchema = z.object({
  captainPlayerId: z.string().min(1).nullable(),
});

export async function PATCH(request, context) {
  const requestId = createRequestId();
  try {
    const { squadId } = await context.params;
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);
    const body = await parseJsonBody(request);
    const input = validateWithSchema(captainSchema, body);

    const existing = getOwnedSquad(squadId, user.id);
    if (input.captainPlayerId) {
      const inSquad =
        existing.slots.some((s) => s.playerId === input.captainPlayerId) ||
        (existing.substitutes || []).includes(input.captainPlayerId);
      if (!inSquad) {
        throw new ApiError({
          statusCode: 400,
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Captain must be an active player in this squad.',
        });
      }
    }

    const squad = updateOwnedSquad(
      squadId,
      user.id,
      { captainPlayerId: input.captainPlayerId },
      requestId
    );

    return successResponse({
      message: 'Squad captain updated.',
      meta: { requestId },
      data: { squad },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/squads/[squadId]/captain' });
  }
}
