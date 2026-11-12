import { z } from 'zod';
import { assertAuthenticated } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { getPrivateProfile, updateProfilePreferences } from '@/server/services/profileService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';

export const dynamic = 'force-dynamic';

const privacySchema = z.object({
  profileVisibility: z.enum(['public', 'limited', 'private']).optional(),
  showBioPublic: z.boolean().optional(),
  showPreferencesPublic: z.boolean().optional(),
});

export async function GET(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);
    const profile = getPrivateProfile(user.id);
    return successResponse({
      message: 'Privacy settings loaded.',
      meta: { requestId },
      data: {
        profileVisibility: profile.profileVisibility,
        showBioPublic: profile.showBioPublic,
        showPreferencesPublic: profile.showPreferencesPublic,
      },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/profile/privacy' });
  }
}

export async function PATCH(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);
    const body = await parseJsonBody(request);
    const input = validateWithSchema(privacySchema, body);
    const profile = updateProfilePreferences(user.id, input, requestId);
    return successResponse({
      message: 'Privacy settings updated.',
      meta: { requestId },
      data: {
        profileVisibility: profile.profileVisibility,
        showBioPublic: profile.showBioPublic,
        showPreferencesPublic: profile.showPreferencesPublic,
      },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/profile/privacy' });
  }
}

