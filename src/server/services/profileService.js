import crypto from 'node:crypto';
import { getDevStore } from '@/server/database/devMemoryStore';
import { ApiError, ERROR_CODES } from '@/server/utils/apiError';
import { recordAuditEvent } from '@/server/services/auditService';
import { getTeamById } from '@/data/teams';

const ALLOWED_AVATAR_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2MB

export function getPrivateProfile(userId) {
  const store = getDevStore();
  const user = store.users.find((u) => u.id === userId);
  const profile = store.profiles.find((p) => p.userId === userId);
  if (!user || !profile) {
    throw new ApiError({
      statusCode: 404,
      code: ERROR_CODES.NOT_FOUND,
      message: 'Profile not found.',
    });
  }
  return {
    ...profile,
    email: user.email,
    emailVerified: user.emailVerified,
    role: user.role,
    status: user.status,
  };
}

export function updatePrivateProfile(userId, updates, requestId = null) {
  const store = getDevStore();
  const profile = store.profiles.find((p) => p.userId === userId);
  const user = store.users.find((u) => u.id === userId);
  if (!profile || !user) {
    throw new ApiError({
      statusCode: 404,
      code: ERROR_CODES.NOT_FOUND,
      message: 'Profile not found.',
    });
  }

  if (updates.username && updates.username.toLowerCase() !== profile.username.toLowerCase()) {
    const taken = store.profiles.some(
      (p) => p.userId !== userId && p.username.toLowerCase() === updates.username.toLowerCase()
    );
    if (taken) {
      throw new ApiError({
        statusCode: 409,
        code: ERROR_CODES.CONFLICT,
        message: 'Username is already in use.',
      });
    }
    profile.username = updates.username;
    user.username = updates.username;
  }

  Object.assign(profile, updates, { updatedAt: new Date().toISOString() });
  if (updates.displayName) {
    user.fullName = updates.displayName;
  }

  recordAuditEvent({
    actorUserId: userId,
    actorRole: user.role,
    action: 'profile.update',
    targetType: 'profile',
    targetId: profile.id,
    requestId,
  });

  return getPrivateProfile(userId);
}

export function updateProfilePreferences(userId, prefs, requestId = null) {
  const store = getDevStore();
  const profile = store.profiles.find((p) => p.userId === userId);
  const user = store.users.find((u) => u.id === userId);
  if (!profile || !user) {
    throw new ApiError({
      statusCode: 404,
      code: ERROR_CODES.NOT_FOUND,
      message: 'Profile not found.',
    });
  }

  if (prefs.appearanceTheme) profile.appearanceTheme = prefs.appearanceTheme;
  if (prefs.profileVisibility) profile.profileVisibility = prefs.profileVisibility;
  if (typeof prefs.showBioPublic === 'boolean') profile.showBioPublic = prefs.showBioPublic;
  if (typeof prefs.showPreferencesPublic === 'boolean') {
    profile.showPreferencesPublic = prefs.showPreferencesPublic;
  }
  if (prefs.notificationPreferences) {
    profile.notificationPreferences = {
      ...profile.notificationPreferences,
      ...prefs.notificationPreferences,
    };
  }
  profile.updatedAt = new Date().toISOString();

  recordAuditEvent({
    actorUserId: userId,
    actorRole: user.role,
    action: 'profile.preferences_update',
    targetType: 'profile',
    targetId: profile.id,
    requestId,
  });

  return getPrivateProfile(userId);
}

export function validateAndPrepareAvatar({ mimeType, byteLength, originalName = 'avatar.webp' }) {
  if (!ALLOWED_AVATAR_MIMES.has(mimeType)) {
    throw new ApiError({
      statusCode: 400,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: 'Only JPEG, PNG, and WebP avatars are permitted.',
    });
  }
  if (!byteLength || byteLength > MAX_AVATAR_BYTES) {
    throw new ApiError({
      statusCode: 400,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: 'Avatar file size must be under 2 MB.',
    });
  }

  const ext = mimeType === 'image/png' ? 'png' : mimeType === 'image/jpeg' ? 'jpg' : 'webp';
  return {
    storageKey: `avatars/${crypto.randomUUID()}.${ext}`,
    originalName,
  };
}

export function removeProfileAvatar(userId) {
  const store = getDevStore();
  const profile = store.profiles.find((p) => p.userId === userId);
  if (!profile) {
    throw new ApiError({
      statusCode: 404,
      code: ERROR_CODES.NOT_FOUND,
      message: 'Profile not found.',
    });
  }
  profile.avatarUrl = null;
  profile.updatedAt = new Date().toISOString();
  return getPrivateProfile(userId);
}

export function getPublicProfileByUsername(username) {
  const store = getDevStore();
  const profile = store.profiles.find(
    (p) => p.username.toLowerCase() === String(username).toLowerCase()
  );
  if (!profile) {
    return null;
  }

  if (profile.profileVisibility === 'private') {
    return {
      username: profile.username,
      isPrivate: true,
      profileVisibility: 'private',
    };
  }

  const team = profile.favouriteTeamId ? getTeamById(profile.favouriteTeamId) : null;
  // NEVER expose email, passwordHash, or security settings publicly
  return {
    username: profile.username,
    displayName: profile.displayName,
    avatarUrl: profile.avatarUrl,
    isPrivate: false,
    profileVisibility: profile.profileVisibility,
    bio: profile.showBioPublic ? profile.bio : null,
    favouriteTeam: profile.showPreferencesPublic && team ? team.name : null,
    preferredPosition: profile.showPreferencesPublic ? profile.preferredPosition : null,
    preferredFormation: profile.showPreferencesPublic ? profile.preferredFormation : null,
    joinedAt: profile.profileVisibility === 'public' ? profile.createdAt : null,
  };
}
