import crypto from 'node:crypto';
import { getDevStore } from '@/server/database/devMemoryStore';
import { sanitizeLogMeta } from '@/server/utils/requestLogger';

/**
 * Immutable server-side audit trail.
 * Audit entries cannot be updated or deleted via application APIs.
 */
export function recordAuditEvent({
  actorUserId = null,
  actorRole = 'anonymous',
  action,
  targetType,
  targetId = null,
  outcome = 'success',
  requestId = null,
  metadata = {},
}) {
  const store = getDevStore();
  const entry = {
    id: crypto.randomUUID(),
    actorUserId,
    actorRole,
    action,
    targetType,
    targetId,
    outcome,
    requestId,
    metadata: sanitizeLogMeta(metadata),
    timestamp: new Date().toISOString(),
  };

  store.auditLogs.unshift(entry);
  if (store.auditLogs.length > 500) {
    store.auditLogs.length = 500;
  }
  return entry;
}

export function listAuditLogs({ action, actorRole, page = 1, pageSize = 20 } = {}) {
  const store = getDevStore();
  const filtered = store.auditLogs.filter((item) => {
    const matchAction = !action || item.action.toLowerCase().includes(action.toLowerCase());
    const matchRole = !actorRole || actorRole === 'ALL' || item.actorRole === actorRole;
    return matchAction && matchRole;
  });

  const start = (Math.max(1, page) - 1) * pageSize;
  return {
    items: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
  };
}
