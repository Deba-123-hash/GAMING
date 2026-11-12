import crypto from 'node:crypto';
import { getDevStore } from '@/server/database/devMemoryStore';
import { FORMATIONS_CONFIG } from '@/lib/formations';
import { calculateSquadRatings } from '@/utils/squadRating';
import { ApiError, ERROR_CODES } from '@/server/utils/apiError';
import { recordAuditEvent } from '@/server/services/auditService';

function validateAndHydrateSquadPlayers(slots, substitutes = []) {
  const store = getDevStore();
  const playerMap = new Map(store.players.map((p) => [p.id, p]));
  const seenPlayers = new Set();

  for (const slot of slots) {
    if (!slot.playerId) continue;
    if (!playerMap.has(slot.playerId)) {
      throw new ApiError({
        statusCode: 400,
        code: ERROR_CODES.VALIDATION_ERROR,
        message: `Unknown player ID in starting slot: ${slot.playerId}`,
      });
    }
    if (seenPlayers.has(slot.playerId)) {
      throw new ApiError({
        statusCode: 400,
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'A player cannot be assigned to multiple squad slots.',
      });
    }
    seenPlayers.add(slot.playerId);
  }

  for (const subId of substitutes) {
    if (!playerMap.has(subId)) {
      throw new ApiError({
        statusCode: 400,
        code: ERROR_CODES.VALIDATION_ERROR,
        message: `Unknown substitute player ID: ${subId}`,
      });
    }
    if (seenPlayers.has(subId)) {
      throw new ApiError({
        statusCode: 400,
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'A player cannot be both a starter and a substitute.',
      });
    }
    seenPlayers.add(subId);
  }

  return calculateSquadRatings(slots, playerMap);
}

export function listUserSquads(userId) {
  const store = getDevStore();
  return store.squads.filter((s) => s.userId === userId);
}

export function createUserSquad(userId, input, actorRole = 'user', requestId = null) {
  const store = getDevStore();
  const ratings = validateAndHydrateSquadPlayers(input.slots, input.substitutes || []);
  const now = new Date().toISOString();

  const squad = {
    id: crypto.randomUUID(),
    userId,
    name: input.name,
    formation: input.formation,
    preferredTeamId: input.preferredTeamId || 'apex-united',
    slots: input.slots,
    substitutes: input.substitutes || [],
    captainPlayerId: input.captainPlayerId || null,
    tactics: input.tactics || { mentality: 'Balanced', pressing: 'Balanced' },
    ratings,
    isDefault: store.squads.filter((s) => s.userId === userId).length === 0,
    createdAt: now,
    updatedAt: now,
  };

  store.squads.unshift(squad);
  recordAuditEvent({
    actorUserId: userId,
    actorRole,
    action: 'squad.create',
    targetType: 'squad',
    targetId: squad.id,
    requestId,
  });

  return squad;
}

export function getOwnedSquad(squadId, userId) {
  const store = getDevStore();
  const squad = store.squads.find((s) => s.id === squadId);
  if (!squad) {
    throw new ApiError({
      statusCode: 404,
      code: ERROR_CODES.NOT_FOUND,
      message: 'Squad not found.',
    });
  }
  if (squad.userId !== userId) {
    throw new ApiError({
      statusCode: 403,
      code: ERROR_CODES.FORBIDDEN,
      message: 'Access denied to this squad.',
    });
  }
  return squad;
}

export function updateOwnedSquad(squadId, userId, updates, requestId = null) {
  const squad = getOwnedSquad(squadId, userId);

  const nextFormation = updates.formation || squad.formation;
  let nextSlots = updates.slots || squad.slots;
  if (updates.formation && !updates.slots) {
    const template = FORMATIONS_CONFIG[nextFormation];
    nextSlots = template.slots.map((tpl, idx) => ({
      slotIndex: idx,
      role: tpl.role,
      playerId: squad.slots[idx]?.playerId || null,
    }));
  }

  const nextSubs = updates.substitutes ?? squad.substitutes;
  const ratings = validateAndHydrateSquadPlayers(nextSlots, nextSubs);

  Object.assign(squad, {
    ...(updates.name ? { name: updates.name } : {}),
    formation: nextFormation,
    slots: nextSlots,
    substitutes: nextSubs,
    ...(updates.captainPlayerId !== undefined ? { captainPlayerId: updates.captainPlayerId } : {}),
    ...(updates.tactics ? { tactics: { ...squad.tactics, ...updates.tactics } } : {}),
    ratings,
    updatedAt: new Date().toISOString(),
  });

  recordAuditEvent({
    actorUserId: userId,
    actorRole: 'user',
    action: 'squad.update',
    targetType: 'squad',
    targetId: squad.id,
    requestId,
  });

  return squad;
}

export function deleteOwnedSquad(squadId, userId, requestId = null) {
  const store = getDevStore();
  getOwnedSquad(squadId, userId);
  store.squads = store.squads.filter((s) => s.id !== squadId);
  recordAuditEvent({
    actorUserId: userId,
    actorRole: 'user',
    action: 'squad.delete',
    targetType: 'squad',
    targetId: squadId,
    requestId,
  });
  return { deletedId: squadId };
}
