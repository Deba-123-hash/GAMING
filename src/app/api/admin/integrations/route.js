import { z } from 'zod';
import {
  listIntegrationsStatus,
  setIntegrationEnabled,
} from '@/lib/integrations/integrationRegistry';
import { assertPermission } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { getDevStore } from '@/server/database/devMemoryStore';
import { recordAuditEvent } from '@/server/services/auditService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';
import { probeAiConnection } from '@/services/external/aiService';
import { probeFootballDataConnection } from '@/services/external/footballDataService';

export const dynamic = 'force-dynamic';

const adminIntegrationActionSchema = z.object({
  action: z.enum(['probe', 'toggle']),
  providerId: z.string().min(2).max(48),
  enabled: z.boolean().optional(),
});

export async function GET(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    assertPermission(session, 'analytics.read');
    const store = getDevStore();

    return successResponse({
      message: 'Admin integrations telemetry loaded.',
      meta: { requestId },
      data: {
        providers: listIntegrationsStatus(),
        recentAiUsageCount: store.aiUsageRecords.length,
      },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/admin/integrations' });
  }
}

export async function POST(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const actor = assertPermission(session, 'settings.manage');
    const body = await parseJsonBody(request);
    const input = validateWithSchema(adminIntegrationActionSchema, body);

    let probeResult = null;
    if (input.action === 'toggle') {
      setIntegrationEnabled(input.providerId, Boolean(input.enabled));
      recordAuditEvent({
        actorUserId: actor.id,
        actorRole: actor.role,
        action: 'admin.integration_toggled',
        targetType: 'integration',
        targetId: input.providerId,
        metadata: { enabled: Boolean(input.enabled) },
        requestId,
      });
    } else if (input.action === 'probe') {
      if (input.providerId === 'football-data') {
        probeResult = await probeFootballDataConnection();
      } else if (input.providerId === 'gemini-ai') {
        probeResult = await probeAiConnection();
      } else {
        const matched = listIntegrationsStatus().find((p) => p.id === input.providerId);
        probeResult = {
          providerId: input.providerId,
          configured: Boolean(matched?.configured),
          connected: false,
          message: matched?.configured
            ? 'Credentials detected; live network verification applies on provider invocation.'
            : 'Required environment keys are not configured.',
        };
      }
      recordAuditEvent({
        actorUserId: actor.id,
        actorRole: actor.role,
        action: 'admin.integration_probed',
        targetType: 'integration',
        targetId: input.providerId,
        requestId,
      });
    }

    return successResponse({
      message: 'Integration operation completed.',
      meta: { requestId },
      data: {
        providers: listIntegrationsStatus(),
        probeResult,
      },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/admin/integrations' });
  }
}

