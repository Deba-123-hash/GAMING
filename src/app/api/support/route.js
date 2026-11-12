import { checkRateLimit, getClientIdentifier } from '@/server/security/rateLimit';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';
import { submitSupportInquiry } from '@/services/supportService';
import { supportTicketSchema } from '@/utils/validators';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const requestId = createRequestId();
  try {
    checkRateLimit({
      key: `support:submit:${getClientIdentifier(request)}`,
      limit: 12,
      windowMs: 60_000,
    });

    const body = await parseJsonBody(request);
    const input = validateWithSchema(supportTicketSchema, body);
    const result = await submitSupportInquiry(input);

    return successResponse({
      status: result.persisted ? 200 : 202,
      message: result.message,
      meta: { requestId, mode: result.mode },
      data: result,
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/support' });
  }
}
