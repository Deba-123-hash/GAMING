import { listIntegrationsStatus } from '@/lib/integrations/integrationRegistry';
import { getAnalyticsConfiguration } from '@/services/external/analyticsService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';

export const dynamic = 'force-dynamic';

export async function GET() {
  const requestId = createRequestId();
  try {
    const providers = listIntegrationsStatus().map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      configured: p.configured,
      enabled: p.enabled,
      connectionStatus: p.connectionStatus,
    }));

    return successResponse({
      message: 'External integration status retrieved.',
      meta: { requestId },
      data: {
        providers,
        analytics: getAnalyticsConfiguration(),
      },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/integrations/status' });
  }
}

