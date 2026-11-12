import { z } from 'zod';
import { assertAuthenticated } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { checkRateLimit } from '@/server/security/rateLimit';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';
import { askFootballAssistant } from '@/services/external/aiService';

export const dynamic = 'force-dynamic';

const chatSchema = z.object({
  question: z.string().trim().min(3, 'Question must be at least 3 characters.').max(600),
});

export async function POST(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);
    checkRateLimit({ key: `ai:chat:${user.id}`, limit: 15, windowMs: 60_000 });

    const body = await parseJsonBody(request);
    const input = validateWithSchema(chatSchema, body);
    const analysis = await askFootballAssistant({ question: input.question, userId: user.id });

    return successResponse({
      message: 'AI assistant response generated.',
      meta: { requestId, aiProviderConnected: analysis.aiProviderConnected },
      data: { analysis },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/ai/chat' });
  }
}

