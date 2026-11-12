import { assertPermission } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { listAuditLogs } from '@/server/services/auditService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    assertPermission(session, 'audit.read');

    const url = new URL(request.url);
    const result = listAuditLogs({
      action: url.searchParams.get('action') || undefined,
      actorRole: url.searchParams.get('actorRole') || undefined,
      page: Number(url.searchParams.get('page') || 1),
      pageSize: Math.min(50, Math.max(1, Number(url.searchParams.get('pageSize') || 20))),
    });

    return successResponse({
      message: 'Audit logs retrieved.',
      meta: { requestId, total: result.total, page: result.page, pageSize: result.pageSize },
      data: result,
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/admin/audit-logs' });
  }
}
