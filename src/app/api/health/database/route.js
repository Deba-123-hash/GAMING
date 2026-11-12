import { hasPermission } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { checkDatabaseHealth } from '@/server/database/databaseClient';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const includeDiagnostics = Boolean(session && hasPermission(session.user, 'audit.read'));
    const health = await checkDatabaseHealth({ includeDiagnostics });

    return successResponse({
      message: health.connected
        ? 'Database connection verified.'
        : 'Database running in safe fallback or pending schema state.',
      meta: { requestId },
      data: health,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/health/database' });
  }
}
