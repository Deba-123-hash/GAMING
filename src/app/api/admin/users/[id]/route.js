import { assertPermission } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { getAdminUserDetail, updateAdminUser } from '@/server/services/adminService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';
import { adminUserUpdateSchema } from '@/server/validation/domainSchemas';

export const dynamic = 'force-dynamic';

export async function GET(request, context) {
  const requestId = createRequestId();
  try {
    const { id } = await context.params;
    const session = await getServerSession(request);
    assertPermission(session, 'users.read');
    const detail = getAdminUserDetail(id);

    return successResponse({
      message: 'User detail loaded.',
      meta: { requestId },
      data: detail,
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/admin/users/[id]' });
  }
}

export async function PATCH(request, context) {
  const requestId = createRequestId();
  try {
    const { id } = await context.params;
    const session = await getServerSession(request);
    const actor = assertPermission(session, 'users.update');
    const body = await parseJsonBody(request);
    const input = validateWithSchema(adminUserUpdateSchema, body);
    const user = updateAdminUser(id, input, actor, requestId);

    return successResponse({
      message: 'User updated.',
      meta: { requestId },
      data: { user },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/admin/users/[id]' });
  }
}
