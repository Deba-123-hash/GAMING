import { assertPermission } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { getAdminSettings, updateAdminSettings } from '@/server/services/adminService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';
import { adminSettingsUpdateSchema } from '@/server/validation/domainSchemas';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    assertPermission(session, 'analytics.read');
    const settings = getAdminSettings();

    return successResponse({
      message: 'Platform settings loaded.',
      meta: { requestId },
      data: { settings },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/admin/settings' });
  }
}

export async function PATCH(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const actor = assertPermission(session, 'settings.manage');
    const body = await parseJsonBody(request);
    const input = validateWithSchema(adminSettingsUpdateSchema, body);
    const settings = updateAdminSettings(input, actor, requestId);

    return successResponse({
      message: 'Platform settings updated.',
      meta: { requestId },
      data: { settings },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/admin/settings' });
  }
}
