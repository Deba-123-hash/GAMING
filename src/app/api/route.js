import { successResponse, createRequestId } from '@/server/utils/apiResponse';
import { getVersionPayload } from '@/server/services/healthService';

export async function GET() {
  const requestId = createRequestId();
  return successResponse({
    data: {
      ...getVersionPayload(),
      endpoints: [
        '/api/health',
        '/api/version',
        '/api/auth/*',
        '/api/profile/*',
        '/api/players',
        '/api/teams',
        '/api/squads',
        '/api/events',
        '/api/news',
        '/api/media',
        '/api/admin/*',
      ],
    },
    message: 'RIVALRY 90 API foundation.',
    meta: { requestId },
  });
}
