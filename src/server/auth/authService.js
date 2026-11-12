import crypto from 'node:crypto';
import { getDevStore } from '@/server/database/devMemoryStore';
import { hashPassword, verifyPassword } from '@/server/security/passwordHash';
import { generateOneTimeToken, hashOneTimeToken } from '@/server/security/tokenUtils';
import { ApiError, ERROR_CODES } from '@/server/utils/apiError';
import {
  createSessionRecord,
  revokeAllUserSessions,
  sanitizeUserForClient,
} from '@/server/auth/sessionService';
import { recordAuditEvent } from '@/server/services/auditService';

export function registerUser({ fullName, username, email, password, requestId = null }) {
  const store = getDevStore();
  const normalizedEmail = email.toLowerCase();
  const normalizedUsername = username.toLowerCase();

  const existingEmail = store.users.find((u) => u.email === normalizedEmail);
  if (existingEmail) {
    throw new ApiError({
      statusCode: 409,
      code: ERROR_CODES.CONFLICT,
      message: 'An account with this email already exists.',
    });
  }

  const existingUsername = store.profiles.find(
    (p) => p.username.toLowerCase() === normalizedUsername
  );
  if (existingUsername) {
    throw new ApiError({
      statusCode: 409,
      code: ERROR_CODES.CONFLICT,
      message: 'This username is already taken.',
    });
  }

  const userId = crypto.randomUUID();
  const now = new Date().toISOString();

  // Public registration NEVER assigns elevated admin roles
  const user = {
    id: userId,
    email: normalizedEmail,
    fullName,
    username,
    passwordHash: hashPassword(password),
    role: 'user',
    status: 'active',
    emailVerified: false,
    createdAt: now,
    updatedAt: now,
  };

  const profile = {
    id: crypto.randomUUID(),
    userId,
    username,
    displayName: fullName,
    bio: '',
    avatarUrl: null,
    country: '',
    preferredLanguage: 'en',
    favouriteTeamId: 'apex-united',
    preferredPosition: 'ST',
    preferredFormation: '4-3-3',
    favouriteGameMode: 'quick-match',
    profileVisibility: 'public',
    showBioPublic: true,
    showPreferencesPublic: true,
    notificationPreferences: {
      productAnnouncements: false,
      eventAlerts: false,
      communityAlerts: false,
      securityAlerts: true,
    },
    appearanceTheme: 'dark',
    createdAt: now,
    updatedAt: now,
  };

  store.users.push(user);
  store.profiles.push(profile);

  const rawVerifyToken = generateOneTimeToken();
  store.verificationTokens.set(hashOneTimeToken(rawVerifyToken), {
    userId,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24,
    used: false,
  });

  const session = createSessionRecord(user);
  recordAuditEvent({
    actorUserId: userId,
    actorRole: 'user',
    action: 'auth.register',
    targetType: 'user',
    targetId: userId,
    requestId,
  });

  return {
    user: sanitizeUserForClient(user),
    profile,
    session,
    emailDelivered: false,
    verificationStatus: 'pending-email-provider',
    // Token exposed ONLY in test environment for automated verification; never in production!
    ...(process.env.NODE_ENV === 'test' ? { devVerificationToken: rawVerifyToken } : {}),
  };
}

export function loginUser({ email, password, requestId = null }) {
  const store = getDevStore();
  const normalizedEmail = email.toLowerCase();
  const user = store.users.find((u) => u.email === normalizedEmail);

  const valid = user ? verifyPassword(password, user.passwordHash) : false;
  if (!user || !valid) {
    recordAuditEvent({
      actorUserId: user?.id || null,
      actorRole: user?.role || 'anonymous',
      action: 'auth.login_failed',
      targetType: 'user',
      targetId: user?.id || null,
      outcome: 'denied',
      requestId,
    });
    throw new ApiError({
      statusCode: 401,
      code: ERROR_CODES.UNAUTHORIZED,
      message: 'Invalid email or password.',
    });
  }

  if (user.status !== 'active') {
    throw new ApiError({
      statusCode: 403,
      code: ERROR_CODES.FORBIDDEN,
      message: 'This account is currently suspended or inactive.',
    });
  }

  const session = createSessionRecord(user);
  const profile = store.profiles.find((p) => p.userId === user.id) || null;
  recordAuditEvent({
    actorUserId: user.id,
    actorRole: user.role,
    action: 'auth.login',
    targetType: 'user',
    targetId: user.id,
    requestId,
  });

  return {
    user: sanitizeUserForClient(user),
    profile,
    session,
  };
}

export function requestPasswordReset({ email, requestId = null }) {
  const store = getDevStore();
  const user = store.users.find((u) => u.email === email.toLowerCase());
  let rawToken = null;

  if (user && user.status === 'active') {
    rawToken = generateOneTimeToken();
    store.resetTokens.set(hashOneTimeToken(rawToken), {
      userId: user.id,
      expiresAt: Date.now() + 1000 * 60 * 30,
      used: false,
    });
    recordAuditEvent({
      actorUserId: user.id,
      actorRole: user.role,
      action: 'auth.password_reset_requested',
      targetType: 'user',
      targetId: user.id,
      requestId,
    });
  }

  return {
    accepted: true,
    emailDelivered: false,
    message:
      'If an account matches that email address, recovery instructions have been prepared. Live email delivery requires Resend/SMTP configuration.',
    ...(process.env.NODE_ENV === 'test' && rawToken ? { devResetToken: rawToken } : {}),
  };
}

export function resetPasswordWithToken({ token, newPassword, requestId = null }) {
  const store = getDevStore();
  const hashed = hashOneTimeToken(token);
  const record = store.resetTokens.get(hashed);

  if (!record || record.used || Date.now() > record.expiresAt) {
    throw new ApiError({
      statusCode: 400,
      code: ERROR_CODES.BAD_REQUEST,
      message: 'Password reset token is invalid or expired.',
    });
  }

  const user = store.users.find((u) => u.id === record.userId);
  if (!user) {
    throw new ApiError({
      statusCode: 404,
      code: ERROR_CODES.NOT_FOUND,
      message: 'Account not found.',
    });
  }

  record.used = true;
  store.resetTokens.set(hashed, record);
  user.passwordHash = hashPassword(newPassword);
  user.updatedAt = new Date().toISOString();
  revokeAllUserSessions(user.id);

  recordAuditEvent({
    actorUserId: user.id,
    actorRole: user.role,
    action: 'auth.password_reset_completed',
    targetType: 'user',
    targetId: user.id,
    requestId,
  });

  return { reset: true };
}

export function verifyEmailWithToken({ token, requestId = null }) {
  const store = getDevStore();
  const hashed = hashOneTimeToken(token);
  const record = store.verificationTokens.get(hashed);

  if (!record || record.used || Date.now() > record.expiresAt) {
    throw new ApiError({
      statusCode: 400,
      code: ERROR_CODES.BAD_REQUEST,
      message: 'Verification token is invalid or expired.',
    });
  }

  const user = store.users.find((u) => u.id === record.userId);
  if (!user) {
    throw new ApiError({
      statusCode: 404,
      code: ERROR_CODES.NOT_FOUND,
      message: 'Account not found.',
    });
  }

  record.used = true;
  store.verificationTokens.set(hashed, record);
  user.emailVerified = true;
  user.updatedAt = new Date().toISOString();

  recordAuditEvent({
    actorUserId: user.id,
    actorRole: user.role,
    action: 'auth.email_verified',
    targetType: 'user',
    targetId: user.id,
    requestId,
  });

  return { verified: true };
}
