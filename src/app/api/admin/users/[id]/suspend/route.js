import { z } from 'zod';
import { assertPermission } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { setUserAccountStatus } from '@/server/services/adminService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { validateWithSchema } from '@/server/utils/validation';

export const dynamic = 'force-dynamic';

const suspendSchema = z.object({
  status: z.enum(['suspended', 'banned']).optional(),
});

export async function POST(request, context) {
  const requestId = createRequestId();
  try {
    const { id } = await context.params;
    const session = await getServerSession(request);
    const body = await request.json().catch(() => ({}));
    const input = validateWithSchema(suspendSchema, body || {});
    const targetStatus = input.status || 'suspended';
    const actor = assertPermission(
      session,
      targetStatus === 'banned' ? 'users.ban' : 'users.suspend'
    );
    const user = setUserAccountStatus(id, targetStatus, actor, requestId);

    return successResponse({
      message: `Account ${targetStatus}. Active sessions revoked.`,
      meta: { requestId },
      data: { user },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/admin/users/[id]/suspend' });
  }
}
