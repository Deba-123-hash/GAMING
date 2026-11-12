import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { SERVER_CONFIG } from '@/server/config/serverConfig';
import { getDevStore } from '@/server/database/devMemoryStore';
import { signSessionToken, verifySessionToken } from '@/server/security/tokenUtils';

export function sanitizeUserForClient(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    username: user.username,
    role: user.role,
    status: user.status,
    emailVerified: Boolean(user.emailVerified),
    createdAt: user.createdAt,
  };
}

export function createSessionRecord(user) {
  const store = getDevStore();
  const sessionId = crypto.randomUUID();
  const expiresAt = Date.now() + SERVER_CONFIG.sessionMaxAgeSeconds * 1000;

  store.sessions.set(sessionId, {
    id: sessionId,
    userId: user.id,
    createdAt: new Date().toISOString(),
    expiresAt,
    revoked: false,
  });

  const signedToken = signSessionToken({
    sid: sessionId,
    uid: user.id,
    exp: expiresAt,
  });

  return { sessionId, signedToken, expiresAt };
}

export function buildSessionCookieOptions() {
  return {
    name: SERVER_CONFIG.sessionCookieName,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SERVER_CONFIG.sessionMaxAgeSeconds,
  };
}

export function buildClearSessionCookieOptions() {
  return {
    name: SERVER_CONFIG.sessionCookieName,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  };
}

export function resolveSessionFromToken(rawCookieToken) {
  const decoded = verifySessionToken(rawCookieToken);
  if (!decoded) return null;

  const store = getDevStore();
  const sessionRecord = store.sessions.get(decoded.sid);
  if (!sessionRecord || sessionRecord.revoked || Date.now() > sessionRecord.expiresAt) {
    return null;
  }

  const user = store.users.find((u) => u.id === decoded.uid);
  if (!user || user.status !== 'active') {
    return null;
  }

  const profile = store.profiles.find((p) => p.userId === user.id) || null;
  return {
    sessionId: sessionRecord.id,
    expiresAt: sessionRecord.expiresAt,
    user: sanitizeUserForClient(user),
    profile,
  };
}

export async function getServerSession(request = null) {
  if (request?.cookies?.get) {
    const token = request.cookies.get(SERVER_CONFIG.sessionCookieName)?.value;
    return resolveSessionFromToken(token);
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SERVER_CONFIG.sessionCookieName)?.value;
    return resolveSessionFromToken(token);
  } catch {
    return null;
  }
}

export function revokeSessionById(sessionId) {
  const store = getDevStore();
  const existing = store.sessions.get(sessionId);
  if (existing) {
    existing.revoked = true;
    store.sessions.set(sessionId, existing);
  }
}

export function revokeAllUserSessions(userId) {
  const store = getDevStore();
  for (const [sid, sess] of store.sessions.entries()) {
    if (sess.userId === userId) {
      sess.revoked = true;
      store.sessions.set(sid, sess);
    }
  }
}
