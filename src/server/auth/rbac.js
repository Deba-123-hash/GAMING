import { ApiError, ERROR_CODES } from '@/server/utils/apiError';

export const PERMISSIONS = {
  'users.read': 'View user accounts and statuses',
  'users.update': 'Edit user profile fields and roles',
  'users.suspend': 'Suspend or reactivate user accounts',
  'users.ban': 'Ban user accounts permanently',
  'roles.read': 'View role definitions and permission matrix',
  'roles.manage': 'Modify custom role permissions',
  'players.read': 'View all players including drafts',
  'players.create': 'Create master player records',
  'players.update': 'Update master player records',
  'players.delete': 'Delete master player records',
  'teams.manage': 'Create, update, and delete master team records',
  'events.manage': 'Create, edit, publish, and delete events',
  'news.manage': 'Create, edit, publish, and delete news articles',
  'media.manage': 'Create, edit, publish, and delete media items',
  'categories.manage': 'Manage content categories',
  'analytics.read': 'View platform overview analytics',
  'audit.read': 'View immutable administrative audit logs',
  'security.manage': 'Manage platform security & session revocations',
  'settings.manage': 'Update general and content platform settings',
};

export const ROLE_DEFINITIONS = {
  super_admin: {
    id: 'super_admin',
    label: 'Super Admin',
    permissions: Object.keys(PERMISSIONS),
  },
  admin: {
    id: 'admin',
    label: 'Admin',
    permissions: [
      'users.read',
      'users.update',
      'users.suspend',
      'roles.read',
      'players.read',
      'players.create',
      'players.update',
      'players.delete',
      'teams.manage',
      'events.manage',
      'news.manage',
      'media.manage',
      'categories.manage',
      'analytics.read',
      'audit.read',
    ],
  },
  content_manager: {
    id: 'content_manager',
    label: 'Content Manager',
    permissions: [
      'events.manage',
      'news.manage',
      'media.manage',
      'categories.manage',
      'analytics.read',
    ],
  },
  moderator: {
    id: 'moderator',
    label: 'Moderator',
    permissions: ['users.read', 'users.suspend', 'analytics.read'],
  },
  user: {
    id: 'user',
    label: 'User',
    permissions: [],
  },
};

export function getPermissionsForRole(roleId, customRolesMap = null) {
  if (customRolesMap && customRolesMap[roleId]) {
    return customRolesMap[roleId].permissions || [];
  }
  return ROLE_DEFINITIONS[roleId]?.permissions || [];
}

export function hasPermission(user, permission, customRolesMap = null) {
  if (!user || user.status !== 'active') return false;
  const perms = getPermissionsForRole(user.role, customRolesMap);
  return perms.includes(permission);
}

export function assertAuthenticated(session) {
  if (!session?.user) {
    throw new ApiError({
      statusCode: 401,
      code: ERROR_CODES.UNAUTHORIZED,
      message: 'Authentication required.',
    });
  }
  return session.user;
}

export function assertPermission(session, permission, customRolesMap = null) {
  const user = assertAuthenticated(session);
  if (!hasPermission(user, permission, customRolesMap)) {
    throw new ApiError({
      statusCode: 403,
      code: ERROR_CODES.FORBIDDEN,
      message: 'You do not have permission to perform this action.',
    });
  }
  return user;
}

export function assertCanAssignRole(actorUser, targetRole) {
  if (!ROLE_DEFINITIONS[targetRole]) {
    throw new ApiError({
      statusCode: 400,
      code: ERROR_CODES.BAD_REQUEST,
      message: 'Invalid target role.',
    });
  }
  if (targetRole === 'super_admin' && actorUser.role !== 'super_admin') {
    throw new ApiError({
      statusCode: 403,
      code: ERROR_CODES.FORBIDDEN,
      message: 'Only Super Admins may assign Super Admin role.',
    });
  }
}
