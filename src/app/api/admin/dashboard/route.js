import { assertPermission } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { getAdminDashboardMetrics } from '@/server/services/adminService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    assertPermission(session, 'analytics.read');
    const metrics = getAdminDashboardMetrics();

    return successResponse({
      message: 'Admin dashboard metrics loaded.',
      meta: { requestId },
      data: { metrics },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/admin/dashboard' });
  }
}
