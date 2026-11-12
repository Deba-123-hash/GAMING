import { successResponse, createRequestId } from '@/server/utils/apiResponse';
import { getVersionPayload } from '@/server/services/healthService';

export async function GET() {
  const requestId = createRequestId();
  return successResponse({
    data: getVersionPayload(),
    message: 'Application version retrieved.',
    meta: { requestId },
  });
}
