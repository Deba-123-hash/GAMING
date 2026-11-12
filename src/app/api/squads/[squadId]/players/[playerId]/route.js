import { assertAuthenticated } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { getOwnedSquad, updateOwnedSquad } from '@/services/squadService';

export const dynamic = 'force-dynamic';

export async function DELETE(request, context) {
  const requestId = createRequestId();
  try {
    const { squadId, playerId } = await context.params;
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);
    const existing = getOwnedSquad(squadId, user.id);

    const nextSlots = existing.slots.map((slot) =>
      slot.playerId === playerId ? { ...slot, playerId: null } : slot
    );
    const nextSubs = (existing.substitutes || []).filter((id) => id !== playerId);
    const nextCaptain = existing.captainPlayerId === playerId ? null : existing.captainPlayerId;

    const squad = updateOwnedSquad(
      squadId,
      user.id,
      {
        slots: nextSlots,
        substitutes: nextSubs,
        captainPlayerId: nextCaptain,
      },
      requestId
    );

    return successResponse({
      message: 'Player removed from squad.',
      meta: { requestId },
      data: { squad },
    });
  } catch (error) {
    return handleApiError(error, {
      requestId,
      endpoint: '/api/squads/[squadId]/players/[playerId]',
    });
  }
}

