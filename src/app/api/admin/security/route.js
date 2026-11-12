import { z } from 'zod';
import { assertPermission } from '@/server/auth/rbac';
import { getServerSession, revokeAllUserSessions } from '@/server/auth/sessionService';
import { checkDatabaseHealth } from '@/server/database/databaseClient';
import { getSecurityOverview } from '@/server/services/adminService';
import { recordAuditEvent } from '@/server/services/auditService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';

export const dynamic = 'force-dynamic';

const revokeSessionsSchema = z.object({
  userId: z.string().min(1),
});

export async function GET(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    assertPermission(session, 'audit.read');
    const overview = getSecurityOverview();
    const databaseHealth = await checkDatabaseHealth({ includeDiagnostics: true });

    return successResponse({
      message: 'Security telemetry loaded.',
      meta: { requestId },
      data: { overview, databaseHealth },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/admin/security' });
  }
}

export async function POST(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const actor = assertPermission(session, 'security.manage');
    const body = await parseJsonBody(request);
    const input = validateWithSchema(revokeSessionsSchema, body);

    revokeAllUserSessions(input.userId);
    recordAuditEvent({
      actorUserId: actor.id,
      actorRole: actor.role,
      action: 'admin.sessions_revoked',
      targetType: 'user',
      targetId: input.userId,
      requestId,
    });

    return successResponse({
      message: 'All active sessions for user revoked.',
      meta: { requestId },
      data: { revokedUserId: input.userId },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/admin/security' });
  }
}
