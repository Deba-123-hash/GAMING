import { z } from 'zod';
import { assertAuthenticated } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';
import { getOwnedSquad, updateOwnedSquad } from '@/services/squadService';

export const dynamic = 'force-dynamic';

const squadPlayersSchema = z.object({
  slots: z
    .array(
      z.object({
        slotIndex: z.number().int().min(0).max(10),
        role: z.string().min(1).max(8),
        playerId: z.string().min(1).nullable(),
      })
    )
    .length(11),
  substitutes: z.array(z.string().min(1)).max(7).optional(),
  captainPlayerId: z.string().min(1).nullable().optional(),
});

const singleAssignSchema = z.object({
  slotIndex: z.number().int().min(0).max(10),
  playerId: z.string().min(1),
});

export async function POST(request, context) {
  const requestId = createRequestId();
  try {
    const { squadId } = await context.params;
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);
    const body = await parseJsonBody(request);
    const input = validateWithSchema(singleAssignSchema, body);
    const existing = getOwnedSquad(squadId, user.id);

    const nextSlots = existing.slots.map((slot) =>
      slot.slotIndex === input.slotIndex ? { ...slot, playerId: input.playerId } : slot
    );
    const squad = updateOwnedSquad(squadId, user.id, { slots: nextSlots }, requestId);

    return successResponse({
      message: 'Player assigned to squad slot.',
      meta: { requestId },
      data: { squad },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/squads/[squadId]/players' });
  }
}

export async function PUT(request, context) {
  const requestId = createRequestId();
  try {
    const { squadId } = await context.params;
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);
    const body = await parseJsonBody(request);
    const input = validateWithSchema(squadPlayersSchema, body);
    const squad = updateOwnedSquad(squadId, user.id, input, requestId);

    return successResponse({
      message: 'Squad lineup updated.',
      meta: { requestId },
      data: { squad },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/squads/[squadId]/players' });
  }
}
