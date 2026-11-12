import { z } from 'zod';
import { assertAuthenticated } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { getDevStore } from '@/server/database/devMemoryStore';
import { checkRateLimit } from '@/server/security/rateLimit';
import { ApiError, ERROR_CODES } from '@/server/utils/apiError';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';
import { analyzePlayerWithAi } from '@/services/external/aiService';

export const dynamic = 'force-dynamic';

const playerAnalysisSchema = z.object({
  playerIds: z.array(z.string().min(1)).min(1).max(3),
});

export async function POST(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);
    checkRateLimit({ key: `ai:player:${user.id}`, limit: 20, windowMs: 60_000 });

    const body = await parseJsonBody(request);
    const input = validateWithSchema(playerAnalysisSchema, body);
    const store = getDevStore();
    const matched = input.playerIds
      .map((id) => store.players.find((p) => p.id === id || p.slug === id))
      .filter((p) => p && p.status === 'published');

    if (matched.length === 0) {
      throw new ApiError({
        statusCode: 404,
        code: ERROR_CODES.NOT_FOUND,
        message: 'Requested players not found.',
      });
    }

    const analysis = await analyzePlayerWithAi({ players: matched, userId: user.id });

    return successResponse({
      message: 'Player attribute analysis generated.',
      meta: { requestId, aiProviderConnected: analysis.aiProviderConnected },
      data: { analysis },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/ai/player-analysis' });
  }
}

