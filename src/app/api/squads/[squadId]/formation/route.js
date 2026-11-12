import { z } from 'zod';
import { SUPPORTED_FORMATION_CODES } from '@/lib/formations';
import { assertAuthenticated } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';
import { updateOwnedSquad } from '@/services/squadService';

export const dynamic = 'force-dynamic';

const formationSchema = z.object({
  formation: z.enum(SUPPORTED_FORMATION_CODES),
});

export async function PATCH(request, context) {
  const requestId = createRequestId();
  try {
    const { squadId } = await context.params;
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);
    const body = await parseJsonBody(request);
    const input = validateWithSchema(formationSchema, body);
    const squad = updateOwnedSquad(squadId, user.id, { formation: input.formation }, requestId);

    return successResponse({
      message: 'Squad formation updated.',
      meta: { requestId },
      data: { squad },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/squads/[squadId]/formation' });
  }
}
