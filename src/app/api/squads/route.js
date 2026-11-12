import { assertAuthenticated } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';
import { squadCreateSchema } from '@/server/validation/domainSchemas';
import { createUserSquad, listUserSquads } from '@/services/squadService';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);
    const squads = listUserSquads(user.id);
    return successResponse({
      message: 'Saved squads retrieved.',
      meta: { requestId, count: squads.length },
      data: { squads },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/squads' });
  }
}

export async function POST(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);
    const body = await parseJsonBody(request);
    const input = validateWithSchema(squadCreateSchema, body);
    const squad = createUserSquad(user.id, input, user.role, requestId);

    return successResponse({
      status: 201,
      message: 'Squad saved.',
      meta: { requestId },
      data: { squad },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/squads' });
  }
}
