import { getPublicProfileByUsername } from '@/server/services/profileService';
import { ApiError, ERROR_CODES } from '@/server/utils/apiError';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';

export const dynamic = 'force-dynamic';

export async function GET(request, context) {
  const requestId = createRequestId();
  try {
    const { username } = await context.params;
    const profile = getPublicProfileByUsername(username);
    if (!profile) {
      throw new ApiError({
        statusCode: 404,
        code: ERROR_CODES.NOT_FOUND,
        message: 'Public profile not found.',
      });
    }
    return successResponse({
      message: profile.isPrivate ? 'Profile is private.' : 'Public profile loaded.',
      meta: { requestId },
      data: { profile },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/users/[username]' });
  }
}
