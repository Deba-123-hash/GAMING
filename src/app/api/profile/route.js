import { assertAuthenticated } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { getPrivateProfile, updatePrivateProfile } from '@/server/services/profileService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';
import { profileUpdateSchema } from '@/server/validation/domainSchemas';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);
    const profile = getPrivateProfile(user.id);
    return successResponse({
      message: 'Profile loaded.',
      meta: { requestId },
      data: { profile },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/profile' });
  }
}

export async function PATCH(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);
    const body = await parseJsonBody(request);
    const input = validateWithSchema(profileUpdateSchema, body);
    const profile = updatePrivateProfile(user.id, input, requestId);
    return successResponse({
      message: 'Profile updated successfully.',
      meta: { requestId },
      data: { profile },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/profile' });
  }
}
