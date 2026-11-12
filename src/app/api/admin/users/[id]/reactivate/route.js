import { assertPermission } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { setUserAccountStatus } from '@/server/services/adminService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';

export const dynamic = 'force-dynamic';

export async function POST(request, context) {
  const requestId = createRequestId();
  try {
    const { id } = await context.params;
    const session = await getServerSession(request);
    const actor = assertPermission(session, 'users.suspend');
    const user = setUserAccountStatus(id, 'active', actor, requestId);

    return successResponse({
      message: 'Account reactivated.',
      meta: { requestId },
      data: { user },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/admin/users/[id]/reactivate' });
  }
}
