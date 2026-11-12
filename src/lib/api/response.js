import { createRequestId, errorResponse, successResponse } from '@/server/utils/apiResponse';

/**
 * Re-exports canonical Phase 11-21 response builders so all routes share one envelope.
 */
export { createRequestId, errorResponse, successResponse };

export function apiOk(data, meta = {}, status = 200, message = 'Request completed successfully') {
  return successResponse({ data, meta, status, message });
}
