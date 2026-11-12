import { assertPermission } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { listRolesAndPermissions } from '@/server/services/adminService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    assertPermission(session, 'roles.read');
    const data = listRolesAndPermissions();

    return successResponse({
      message: 'Roles and permissions loaded.',
      meta: { requestId },
      data,
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/admin/roles' });
  }
}
