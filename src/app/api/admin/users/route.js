import { assertPermission } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { listAdminUsers } from '@/server/services/adminService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    assertPermission(session, 'users.read');
    const url = new URL(request.url);
    const users = listAdminUsers({
      role: url.searchParams.get('role') || undefined,
      status: url.searchParams.get('status') || undefined,
      search: url.searchParams.get('search') || undefined,
    });

    return successResponse({
      message: 'Users retrieved.',
      meta: { requestId, count: users.length },
      data: { users, count: users.length },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/admin/users' });
  }
}
