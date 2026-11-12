import { getDevStore } from '@/server/database/devMemoryStore';
import { ApiError, ERROR_CODES } from '@/server/utils/apiError';
import { slugify } from '@/utils/formatters';
import { recordAuditEvent } from '@/server/services/auditService';

export async function listTeams({
  type,
  country,
  search,
  sort = 'rating-desc',
  includeDrafts = false,
} = {}) {
  const store = getDevStore();
  const q = search ? search.trim().toLowerCase() : '';

  const filtered = store.teams.filter((team) => {
    if (!includeDrafts && team.status !== 'published') return false;
    const matchType = !type || type === 'ALL' || team.type === type;
    const matchCountry =
      !country || country === 'ALL' || team.country.toLowerCase().includes(country.toLowerCase());
    const matchQuery =
      !q ||
      team.name.toLowerCase().includes(q) ||
      team.city.toLowerCase().includes(q) ||
      team.style.toLowerCase().includes(q);
    return matchType && matchCountry && matchQuery;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'name-asc') return a.name.localeCompare(b.name);
    if (sort === 'name-desc') return b.name.localeCompare(a.name);
    return b.rating - a.rating;
  });

  return { teams: sorted, total: sorted.length, source: 'server-store' };
}

export async function findTeamById(teamId, { includeDrafts = false } = {}) {
  const store = getDevStore();
  const team = store.teams.find((t) => t.id === teamId || t.slug === teamId) || null;
  if (!team || (!includeDrafts && team.status !== 'published')) {
    return { team: null, source: 'server-store' };
  }
  return { team, source: 'server-store' };
}

export function getTeamRoster(teamId) {
  const store = getDevStore();
  return store.players.filter((p) => p.teamId === teamId && p.status === 'published');
}

export function createMasterTeam(input, actorUser, requestId = null) {
  const store = getDevStore();
  const id = input.slug || slugify(input.name);
  if (store.teams.some((t) => t.id === id || t.slug === id)) {
    throw new ApiError({
      statusCode: 409,
      code: ERROR_CODES.CONFLICT,
      message: 'Team slug already exists.',
    });
  }

  const created = {
    id,
    slug: id,
    name: input.name,
    shortCode: input.shortCode,
    type: input.type,
    country: input.country,
    city: input.city,
    foundedYear: 2026,
    region: input.country,
    stadiumId: 'apex-arena',
    primaryColor: input.primaryColor,
    secondaryColor: input.secondaryColor || '#080B09',
    rating: input.rating,
    preferredFormation: input.preferredFormation || '4-3-3',
    style: input.style,
    sampleStats: { attack: input.rating, midfield: input.rating, defense: input.rating },
    status: input.status || 'published',
    description: input.description,
  };

  store.teams.unshift(created);
  recordAuditEvent({
    actorUserId: actorUser.id,
    actorRole: actorUser.role,
    action: 'team.create',
    targetType: 'team',
    targetId: created.id,
    requestId,
  });
  return created;
}

export function updateMasterTeam(teamId, updates, actorUser, requestId = null) {
  const store = getDevStore();
  const team = store.teams.find((t) => t.id === teamId);
  if (!team) {
    throw new ApiError({
      statusCode: 404,
      code: ERROR_CODES.NOT_FOUND,
      message: 'Team not found.',
    });
  }

  Object.assign(team, updates);
  recordAuditEvent({
    actorUserId: actorUser.id,
    actorRole: actorUser.role,
    action: 'team.update',
    targetType: 'team',
    targetId: team.id,
    requestId,
  });
  return team;
}

export function deleteMasterTeam(teamId, actorUser, requestId = null) {
  const store = getDevStore();
  const hasRoster = store.players.some((p) => p.teamId === teamId);
  if (hasRoster) {
    throw new ApiError({
      statusCode: 409,
      code: ERROR_CODES.CONFLICT,
      message: 'Cannot delete a team that still has assigned players. Reassign players first.',
    });
  }
  const idx = store.teams.findIndex((t) => t.id === teamId);
  if (idx === -1) {
    throw new ApiError({
      statusCode: 404,
      code: ERROR_CODES.NOT_FOUND,
      message: 'Team not found.',
    });
  }
  const [removed] = store.teams.splice(idx, 1);
  recordAuditEvent({
    actorUserId: actorUser.id,
    actorRole: actorUser.role,
    action: 'team.delete',
    targetType: 'team',
    targetId: removed.id,
    requestId,
  });
  return { deletedId: removed.id };
}
