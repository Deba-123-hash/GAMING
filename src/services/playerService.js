import { getDevStore } from '@/server/database/devMemoryStore';
import { calculatePositionOvr } from '@/utils/playerRating';
import { ApiError, ERROR_CODES } from '@/server/utils/apiError';
import { slugify } from '@/utils/formatters';
import { recordAuditEvent } from '@/server/services/auditService';

function getPositionGroup(pos) {
  if (pos === 'GK') return 'GK';
  if (['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(pos)) return 'DEF';
  if (['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(pos)) return 'MID';
  return 'FWD';
}

export async function listPlayers({
  position,
  teamId,
  nationality,
  minOvr,
  maxOvr,
  search,
  sort = 'ovr-desc',
  page = 1,
  pageSize = 50,
  includeDrafts = false,
} = {}) {
  const store = getDevStore();
  const posFilter = position ? position.trim().toUpperCase() : 'ALL';
  const query = search ? search.trim().toLowerCase() : '';

  const filtered = store.players.filter((player) => {
    if (!includeDrafts && player.status !== 'published') return false;
    const matchPos =
      posFilter === 'ALL' || player.positionGroup === posFilter || player.position === posFilter;
    const matchTeam = !teamId || teamId === 'ALL' || player.teamId === teamId;
    const matchNat =
      !nationality ||
      nationality === 'ALL' ||
      player.nationality.toLowerCase().includes(nationality.toLowerCase());
    const matchMin = minOvr ? player.ovr >= Number(minOvr) : true;
    const matchMax = maxOvr ? player.ovr <= Number(maxOvr) : true;
    const matchQuery =
      !query ||
      player.name.toLowerCase().includes(query) ||
      player.role.toLowerCase().includes(query) ||
      player.position.toLowerCase().includes(query) ||
      player.nationality.toLowerCase().includes(query);

    return matchPos && matchTeam && matchNat && matchMin && matchMax && matchQuery;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'ovr-asc') return a.ovr - b.ovr;
    if (sort === 'name-asc') return a.name.localeCompare(b.name);
    if (sort === 'name-desc') return b.name.localeCompare(a.name);
    return b.ovr - a.ovr;
  });

  const safePage = Math.max(1, Number(page) || 1);
  const safeSize = Math.max(1, Math.min(100, Number(pageSize) || 50));
  const start = (safePage - 1) * safeSize;

  return {
    players: sorted.slice(start, start + safeSize),
    total: sorted.length,
    page: safePage,
    pageSize: safeSize,
    source: 'server-store',
  };
}

export async function findPlayerById(playerId, { includeDrafts = false } = {}) {
  const store = getDevStore();
  const player = store.players.find((p) => p.id === playerId || p.slug === playerId) || null;
  if (!player || (!includeDrafts && player.status !== 'published')) {
    return { player: null, source: 'server-store' };
  }
  return { player, source: 'server-store' };
}

export function createMasterPlayer(input, actorUser, requestId = null) {
  const store = getDevStore();
  const id = slugify(input.name);
  if (store.players.some((p) => p.id === id)) {
    throw new ApiError({
      statusCode: 409,
      code: ERROR_CODES.CONFLICT,
      message: 'Player slug already exists.',
    });
  }
  const team = store.teams.find((t) => t.id === input.teamId);
  if (!team) {
    throw new ApiError({
      statusCode: 400,
      code: ERROR_CODES.BAD_REQUEST,
      message: 'Assigned team does not exist.',
    });
  }
  const numberTaken = store.players.some(
    (p) => p.teamId === input.teamId && p.number === input.number
  );
  if (numberTaken) {
    throw new ApiError({
      statusCode: 409,
      code: ERROR_CODES.CONFLICT,
      message: `Shirt number #${input.number} is already assigned on ${team.name}.`,
    });
  }

  const ovr = calculatePositionOvr(input.position, input.stats);
  const created = {
    id,
    slug: id,
    name: input.name,
    displayName: input.name,
    number: input.number,
    position: input.position,
    secondaryPositions: input.secondaryPositions || [],
    positionGroup: getPositionGroup(input.position),
    role: input.role,
    teamId: input.teamId,
    nationality: input.nationality,
    age: input.age ?? 23,
    height: input.height || '182 cm',
    preferredFoot: input.preferredFoot || 'Right',
    cardCategory: input.cardCategory || 'Standard',
    ovr,
    accentColor: team.primaryColor || '#C6FF3D',
    modelPath: null,
    status: input.status || 'published',
    strengths: [],
    bio: input.bio,
    stats: input.stats,
  };

  store.players.unshift(created);
  recordAuditEvent({
    actorUserId: actorUser.id,
    actorRole: actorUser.role,
    action: 'player.create',
    targetType: 'player',
    targetId: created.id,
    requestId,
  });

  return created;
}

export function updateMasterPlayer(playerId, updates, actorUser, requestId = null) {
  const store = getDevStore();
  const player = store.players.find((p) => p.id === playerId);
  if (!player) {
    throw new ApiError({
      statusCode: 404,
      code: ERROR_CODES.NOT_FOUND,
      message: 'Player not found.',
    });
  }

  const nextTeamId = updates.teamId || player.teamId;
  const nextNumber = updates.number ?? player.number;
  if (updates.teamId && !store.teams.some((t) => t.id === updates.teamId)) {
    throw new ApiError({
      statusCode: 400,
      code: ERROR_CODES.BAD_REQUEST,
      message: 'Target team not found.',
    });
  }
  const clash = store.players.some(
    (p) => p.id !== playerId && p.teamId === nextTeamId && p.number === nextNumber
  );
  if (clash) {
    throw new ApiError({
      statusCode: 409,
      code: ERROR_CODES.CONFLICT,
      message: `Shirt number #${nextNumber} is already taken in that team.`,
    });
  }

  Object.assign(player, updates);
  if (updates.position) {
    player.positionGroup = getPositionGroup(updates.position);
  }
  if (updates.stats || updates.position) {
    player.ovr = calculatePositionOvr(player.position, player.stats);
  }

  recordAuditEvent({
    actorUserId: actorUser.id,
    actorRole: actorUser.role,
    action: 'player.update',
    targetType: 'player',
    targetId: player.id,
    requestId,
  });

  return player;
}

export function deleteMasterPlayer(playerId, actorUser, requestId = null) {
  const store = getDevStore();
  const idx = store.players.findIndex((p) => p.id === playerId);
  if (idx === -1) {
    throw new ApiError({
      statusCode: 404,
      code: ERROR_CODES.NOT_FOUND,
      message: 'Player not found.',
    });
  }
  const [removed] = store.players.splice(idx, 1);
  recordAuditEvent({
    actorUserId: actorUser.id,
    actorRole: actorUser.role,
    action: 'player.delete',
    targetType: 'player',
    targetId: removed.id,
    requestId,
  });
  return { deletedId: removed.id };
}
