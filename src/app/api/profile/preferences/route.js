import { assertAuthenticated } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { getPrivateProfile, updateProfilePreferences } from '@/server/services/profileService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';
import { preferencesUpdateSchema } from '@/server/validation/domainSchemas';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);
    const profile = getPrivateProfile(user.id);
    return successResponse({
      message: 'Profile preferences loaded.',
      meta: { requestId },
      data: {
        appearanceTheme: profile.appearanceTheme,
        profileVisibility: profile.profileVisibility,
        showBioPublic: profile.showBioPublic,
        showPreferencesPublic: profile.showPreferencesPublic,
        notificationPreferences: profile.notificationPreferences,
      },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/profile/preferences' });
  }
}

export async function PATCH(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);
    const body = await parseJsonBody(request);
    const input = validateWithSchema(preferencesUpdateSchema, body);
    const profile = updateProfilePreferences(user.id, input, requestId);
    return successResponse({
      message: 'Preferences updated successfully.',
      meta: { requestId },
      data: { profile },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/profile/preferences' });
  }
}
