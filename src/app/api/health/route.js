import { successResponse, createRequestId } from '@/server/utils/apiResponse';
import { getHealthPayload } from '@/server/services/healthService';

export async function GET() {
  const requestId = createRequestId();
  return successResponse({
    data: getHealthPayload(),
    message: 'Backend foundation is healthy.',
    meta: { requestId },
    headers: { 'Cache-Control': 'no-store' },
  });
}
