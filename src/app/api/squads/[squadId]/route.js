import { assertAuthenticated } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';
import { squadUpdateSchema } from '@/server/validation/domainSchemas';
import { deleteOwnedSquad, getOwnedSquad, updateOwnedSquad } from '@/services/squadService';

export const dynamic = 'force-dynamic';

export async function GET(request, context) {
  const requestId = createRequestId();
  try {
    const { squadId } = await context.params;
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);
    const squad = getOwnedSquad(squadId, user.id);

    return successResponse({
      message: 'Squad loaded.',
      meta: { requestId },
      data: { squad },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/squads/[squadId]' });
  }
}

export async function PATCH(request, context) {
  const requestId = createRequestId();
  try {
    const { squadId } = await context.params;
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);
    const body = await parseJsonBody(request);
    const input = validateWithSchema(squadUpdateSchema, body);
    const squad = updateOwnedSquad(squadId, user.id, input, requestId);

    return successResponse({
      message: 'Squad updated.',
      meta: { requestId },
      data: { squad },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/squads/[squadId]' });
  }
}

export async function DELETE(request, context) {
  const requestId = createRequestId();
  try {
    const { squadId } = await context.params;
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);
    const result = deleteOwnedSquad(squadId, user.id, requestId);

    return successResponse({
      message: 'Squad deleted.',
      meta: { requestId },
      data: result,
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/squads/[squadId]' });
  }
}
