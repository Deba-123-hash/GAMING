import { z } from 'zod';
import { SUPPORTED_FORMATION_CODES } from '@/lib/formations';
import { assertAuthenticated } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { getDevStore } from '@/server/database/devMemoryStore';
import { checkRateLimit } from '@/server/security/rateLimit';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';
import { getOwnedSquad } from '@/services/squadService';
import { analyzeSquadWithAi } from '@/services/external/aiService';

export const dynamic = 'force-dynamic';

const squadAnalysisSchema = z.object({
  squadId: z.string().min(1).optional(),
  name: z.string().trim().max(60).optional(),
  formation: z.enum(SUPPORTED_FORMATION_CODES).optional(),
  slots: z
    .array(
      z.object({
        slotIndex: z.number().int().min(0).max(10),
        role: z.string().min(1).max(8),
        playerId: z.string().min(1).nullable(),
      })
    )
    .length(11)
    .optional(),
  captainPlayerId: z.string().min(1).nullable().optional(),
  tactics: z
    .object({
      mentality: z.enum(['Defensive', 'Balanced', 'Attacking']).optional(),
      pressing: z.enum(['Low Block', 'Balanced', 'High Press']).optional(),
    })
    .optional(),
});

export async function POST(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);
    checkRateLimit({ key: `ai:squad:${user.id}`, limit: 15, windowMs: 60_000 });

    const body = await parseJsonBody(request);
    const input = validateWithSchema(squadAnalysisSchema, body);
    const store = getDevStore();
    const playerMap = new Map(store.players.map((p) => [p.id, p]));

    const squad = input.squadId
      ? getOwnedSquad(input.squadId, user.id)
      : {
          name: input.name || 'Draft Lineup',
          formation: input.formation || '4-3-3',
          slots: input.slots || [],
          captainPlayerId: input.captainPlayerId || null,
          tactics: input.tactics || { mentality: 'Balanced', pressing: 'Balanced' },
        };

    const analysis = await analyzeSquadWithAi({ squad, playerMap, userId: user.id });

    return successResponse({
      message: 'Squad analysis completed (advisory only).',
      meta: { requestId, aiProviderConnected: analysis.aiProviderConnected },
      data: { analysis },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/ai/squad-analysis' });
  }
}

