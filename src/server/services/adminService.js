import crypto from 'node:crypto';
import { getDevStore } from '@/server/database/devMemoryStore';
import { assertCanAssignRole, PERMISSIONS } from '@/server/auth/rbac';
import { revokeAllUserSessions, sanitizeUserForClient } from '@/server/auth/sessionService';
import { recordAuditEvent } from '@/server/services/auditService';
import { ApiError, ERROR_CODES } from '@/server/utils/apiError';
import { slugify } from '@/utils/formatters';

export function getAdminDashboardMetrics() {
  const store = getDevStore();
  const activeUsers = store.users.filter((u) => u.status === 'active').length;
  const publishedNews = store.news.filter((n) => n.publicationStatus === 'published').length;
  const draftCount =
    store.players.filter((p) => p.status !== 'published').length +
    store.news.filter((n) => n.publicationStatus !== 'published').length +
    store.events.filter((e) => e.publicationStatus !== 'published').length;

  return {
    totalUsers: store.users.length,
    activeUsers,
    totalPlayers: store.players.length,
    totalTeams: store.teams.length,
    totalSquads: store.squads.length,
    publishedEvents: store.events.filter((e) => e.publicationStatus === 'published').length,
    publishedNews,
    totalMedia: store.media.length,
    draftContentCount: draftCount,
    recentAuditLogs: store.auditLogs.slice(0, 8),
  };
}

export function listAdminUsers({ role, status, search } = {}) {
  const store = getDevStore();
  const q = search ? search.trim().toLowerCase() : '';
  return store.users
    .filter((u) => {
      const matchRole = !role || role === 'ALL' || u.role === role;
      const matchStatus = !status || status === 'ALL' || u.status === status;
      const matchSearch =
        !q ||
        u.username.toLowerCase().includes(q) ||
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      return matchRole && matchStatus && matchSearch;
    })
    .map(sanitizeUserForClient);
}

export function getAdminUserDetail(userId) {
  const store = getDevStore();
  const user = store.users.find((u) => u.id === userId);
  if (!user)
    throw new ApiError({
      statusCode: 404,
      code: ERROR_CODES.NOT_FOUND,
      message: 'User not found.',
    });
  const profile = store.profiles.find((p) => p.userId === userId) || null;
  const squads = store.squads.filter((s) => s.userId === userId);
  return { user: sanitizeUserForClient(user), profile, squadCount: squads.length };
}

export function updateAdminUser(targetUserId, updates, actorUser, requestId = null) {
  const store = getDevStore();
  const user = store.users.find((u) => u.id === targetUserId);
  if (!user)
    throw new ApiError({
      statusCode: 404,
      code: ERROR_CODES.NOT_FOUND,
      message: 'User not found.',
    });

  if (updates.role && updates.role !== user.role) {
    if (targetUserId === actorUser.id) {
      throw new ApiError({
        statusCode: 403,
        code: ERROR_CODES.FORBIDDEN,
        message: 'Administrators cannot modify their own role.',
      });
    }
    assertCanAssignRole(actorUser, updates.role);

    if (user.role === 'super_admin' && updates.role !== 'super_admin') {
      const activeSupers = store.users.filter(
        (u) => u.role === 'super_admin' && u.status === 'active'
      );
      if (activeSupers.length <= 1) {
        throw new ApiError({
          statusCode: 409,
          code: ERROR_CODES.CONFLICT,
          message: 'Cannot demote the final active Super Admin.',
        });
      }
    }
    user.role = updates.role;
    recordAuditEvent({
      actorUserId: actorUser.id,
      actorRole: actorUser.role,
      action: 'admin.user_role_changed',
      targetType: 'user',
      targetId: user.id,
      metadata: { nextRole: updates.role },
      requestId,
    });
  }

  if (updates.displayName) {
    user.fullName = updates.displayName;
    const profile = store.profiles.find((p) => p.userId === user.id);
    if (profile) profile.displayName = updates.displayName;
  }

  user.updatedAt = new Date().toISOString();
  return sanitizeUserForClient(user);
}

export function setUserAccountStatus(targetUserId, nextStatus, actorUser, requestId = null) {
  const store = getDevStore();
  const user = store.users.find((u) => u.id === targetUserId);
  if (!user)
    throw new ApiError({
      statusCode: 404,
      code: ERROR_CODES.NOT_FOUND,
      message: 'User not found.',
    });

  if (targetUserId === actorUser.id && nextStatus !== 'active') {
    throw new ApiError({
      statusCode: 403,
      code: ERROR_CODES.FORBIDDEN,
      message: 'Administrators cannot suspend or ban their own account.',
    });
  }

  if (user.role === 'super_admin' && nextStatus !== 'active') {
    const activeSupers = store.users.filter(
      (u) => u.role === 'super_admin' && u.status === 'active'
    );
    if (activeSupers.length <= 1) {
      throw new ApiError({
        statusCode: 409,
        code: ERROR_CODES.CONFLICT,
        message: 'Cannot suspend the final active Super Admin.',
      });
    }
  }

  user.status = nextStatus;
  user.updatedAt = new Date().toISOString();
  if (nextStatus !== 'active') {
    revokeAllUserSessions(user.id);
  }

  recordAuditEvent({
    actorUserId: actorUser.id,
    actorRole: actorUser.role,
    action: nextStatus === 'active' ? 'admin.user_reactivated' : `admin.user_${nextStatus}`,
    targetType: 'user',
    targetId: user.id,
    requestId,
  });

  return sanitizeUserForClient(user);
}

export function listRolesAndPermissions() {
  const store = getDevStore();
  return {
    roles: Object.values(store.roles),
    permissions: Object.entries(PERMISSIONS).map(([id, description]) => ({ id, description })),
  };
}

export function listCategories() {
  return getDevStore().categories;
}

export function createCategory(input, actorUser, requestId = null) {
  const store = getDevStore();
  const slug = input.slug || slugify(input.name);
  if (store.categories.some((c) => c.slug === slug)) {
    throw new ApiError({
      statusCode: 409,
      code: ERROR_CODES.CONFLICT,
      message: 'Category slug already exists.',
    });
  }
  const cat = {
    id: `cat-${crypto.randomUUID().slice(0, 8)}`,
    name: input.name,
    slug,
    contentType: input.contentType,
    enabled: input.enabled ?? true,
  };
  store.categories.push(cat);
  recordAuditEvent({
    actorUserId: actorUser.id,
    actorRole: actorUser.role,
    action: 'admin.category_created',
    targetType: 'category',
    targetId: cat.id,
    requestId,
  });
  return cat;
}

export function getAdminSettings() {
  return getDevStore().settings;
}

export function updateAdminSettings(updates, actorUser, requestId = null) {
  const store = getDevStore();
  Object.assign(store.settings, updates, { updatedAt: new Date().toISOString() });
  recordAuditEvent({
    actorUserId: actorUser.id,
    actorRole: actorUser.role,
    action: 'admin.settings_updated',
    targetType: 'settings',
    targetId: 'global',
    requestId,
  });
  return store.settings;
}

export function getSecurityOverview() {
  const store = getDevStore();
  let activeSessions = 0;
  for (const sess of store.sessions.values()) {
    if (!sess.revoked && Date.now() < sess.expiresAt) activeSessions += 1;
  }

  return {
    activeSessions,
    suspendedAccounts: store.users.filter((u) => u.status === 'suspended').length,
    bannedAccounts: store.users.filter((u) => u.status === 'banned').length,
    recentSecurityEvents: store.auditLogs
      .filter((log) => log.action.startsWith('auth.') || log.action.startsWith('admin.'))
      .slice(0, 12),
  };
}
