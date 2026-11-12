import { z } from 'zod';
import { assertAuthenticated } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { getPrivateProfile, updateProfilePreferences } from '@/server/services/profileService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';

export const dynamic = 'force-dynamic';

const settingsSchema = z.object({
  appearanceTheme: z.enum(['dark', 'light', 'system']).optional(),
  notificationPreferences: z
    .object({
      productAnnouncements: z.boolean().optional(),
      eventAlerts: z.boolean().optional(),
      communityAlerts: z.boolean().optional(),
      securityAlerts: z.boolean().optional(),
    })
    .optional(),
});

export async function GET(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);
    const profile = getPrivateProfile(user.id);
    return successResponse({
      message: 'Settings loaded.',
      meta: { requestId },
      data: {
        appearanceTheme: profile.appearanceTheme,
        notificationPreferences: profile.notificationPreferences,
      },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/profile/settings' });
  }
}

export async function PATCH(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);
    const body = await parseJsonBody(request);
    const input = validateWithSchema(settingsSchema, body);
    const profile = updateProfilePreferences(user.id, input, requestId);
    return successResponse({
      message: 'Settings updated.',
      meta: { requestId },
      data: {
        appearanceTheme: profile.appearanceTheme,
        notificationPreferences: profile.notificationPreferences,
      },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/profile/settings' });
  }
}

