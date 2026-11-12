// @vitest-environment node
import { beforeEach, describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { hashPassword, verifyPassword } from '@/server/security/passwordHash';
import { getDevStore, resetDevStore } from '@/server/database/devMemoryStore';
import { resetRateLimitStore } from '@/server/security/rateLimit';
import { POST as postRegister } from '@/app/api/auth/register/route';
import { POST as postLogin } from '@/app/api/auth/login/route';
import { POST as postLogout } from '@/app/api/auth/logout/route';
import { GET as getSession } from '@/app/api/auth/session/route';
import { POST as postForgotPassword } from '@/app/api/auth/forgot-password/route';
import { POST as postResetPassword } from '@/app/api/auth/reset-password/route';
import { PATCH as patchPreferences } from '@/app/api/profile/preferences/route';
import { GET as getPublicUser } from '@/app/api/users/[username]/route';
import { POST as postPlayers } from '@/app/api/players/route';
import { POST as postNews, GET as getNews } from '@/app/api/news/route';
import { DELETE as deleteNews, GET as getNewsSlug } from '@/app/api/news/[slug]/route';
import { GET as getOwnedSquad } from '@/app/api/squads/[squadId]/route';
import { POST as postSquads } from '@/app/api/squads/route';
import { PATCH as patchAdminUser } from '@/app/api/admin/users/[id]/route';
import { POST as suspendAdminUser } from '@/app/api/admin/users/[id]/suspend/route';
import { GET as getAuditLogs } from '@/app/api/admin/audit-logs/route';
import { FORMATIONS } from '@/lib/constants';

import { SERVER_CONFIG } from '@/server/config/serverConfig';

function makeAuthedReq(url, cookieVal, method = 'GET', body = null) {
  return new NextRequest(url, {
    method,
    headers: {
      ...(body !== null ? { 'Content-Type': 'application/json' } : {}),
      ...(cookieVal ? { Cookie: `${SERVER_CONFIG.sessionCookieName}=${cookieVal}` } : {}),
    },
    ...(body !== null ? { body: JSON.stringify(body) } : {}),
  });
}

async function registerTestUser({ fullName, username, email }) {
  const res = await postRegister(
    new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName,
        username,
        email,
        password: 'Password1',
        confirmPassword: 'Password1',
        acceptTerms: true,
      }),
    })
  );
  const json = await res.json();
  const cookie = res.cookies.get(SERVER_CONFIG.sessionCookieName)?.value;
  return { res, json, cookie, userId: json.data.user.id };
}

describe('Phases 12-17 Auth, Profile, RBAC, Squad Ownership, CMS & Admin Security', () => {
  beforeEach(() => {
    resetDevStore();
    resetRateLimitStore();
  });

  it('hashes passwords via scrypt with unique salts and verifies accurately', () => {
    const h1 = hashPassword('RivalryPass90');
    const h2 = hashPassword('RivalryPass90');
    expect(h1).not.toBe(h2);
    expect(verifyPassword('RivalryPass90', h1)).toBe(true);
    expect(verifyPassword('WrongPass90', h1)).toBe(false);
  });

  it('registers, prevents account enumeration on forgot-password, logs out, and rotates password cleanly', async () => {
    const reg = await registerTestUser({
      fullName: 'Sam Keeper',
      username: 'sam_keeper',
      email: 'sam@rivalry90.dev',
    });
    expect(reg.res.status).toBe(201);
    expect(reg.json.data.user.role).toBe('user');
    expect(reg.json.data.user.passwordHash).toBeUndefined();

    // Wrong login password yields generic 401
    const badLogin = await postLogin(
      new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'sam@rivalry90.dev', password: 'WrongPassword1' }),
      })
    );
    expect(badLogin.status).toBe(401);

    // Non-existent vs existing forgot-password returns same 200 shape
    const fMissing = await postForgotPassword(
      new NextRequest('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'nobody@rivalry90.dev' }),
      })
    );
    const fReal = await postForgotPassword(
      new NextRequest('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'sam@rivalry90.dev' }),
      })
    );
    expect(fMissing.status).toBe(200);
    expect(fReal.status).toBe(200);
    const fRealJson = await fReal.json();
    expect(fRealJson.data.emailDelivered).toBe(false);

    // Single-use reset invalidates existing session
    const resetRes = await postResetPassword(
      new NextRequest('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: fRealJson.data.devResetToken,
          newPassword: 'NewPassword2',
          confirmPassword: 'NewPassword2',
        }),
      })
    );
    expect(resetRes.status).toBe(200);

    // Old session cookie should now be invalid
    const oldSessionRes = await getSession(
      makeAuthedReq('http://localhost:3000/api/auth/session', reg.cookie)
    );
    const oldSessionJson = await oldSessionRes.json();
    expect(oldSessionJson.data.authenticated).toBe(false);

    // Reuse of same reset token fails
    const replayRes = await postResetPassword(
      new NextRequest('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: fRealJson.data.devResetToken,
          newPassword: 'NewPassword3',
          confirmPassword: 'NewPassword3',
        }),
      })
    );
    expect(replayRes.status).toBe(400);

    // New password works, logout revokes session
    const goodLogin = await postLogin(
      new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'sam@rivalry90.dev', password: 'NewPassword2' }),
      })
    );
    expect(goodLogin.status).toBe(200);
    const newCookie = goodLogin.cookies.get('rivalry90_session')?.value;

    await postLogout(makeAuthedReq('http://localhost:3000/api/auth/logout', newCookie, 'POST'));
    const afterLogout = await getSession(
      makeAuthedReq('http://localhost:3000/api/auth/session', newCookie)
    );
    const afterLogoutJson = await afterLogout.json();
    expect(afterLogoutJson.data.authenticated).toBe(false);
  });

  it('enforces public profile privacy rules and never exposes email addresses', async () => {
    const reg = await registerTestUser({
      fullName: 'Maya Striker',
      username: 'maya_st',
      email: 'maya@rivalry90.dev',
    });

    const pubRes1 = await getPublicUser(new Request('http://localhost:3000'), {
      params: Promise.resolve({ username: 'maya_st' }),
    });
    const pubJson1 = await pubRes1.json();
    expect(pubJson1.data.profile.email).toBeUndefined();
    expect(pubJson1.data.profile.isPrivate).toBe(false);

    // Switch to private visibility
    const prefRes = await patchPreferences(
      makeAuthedReq('http://localhost:3000/api/profile/preferences', reg.cookie, 'PATCH', {
        profileVisibility: 'private',
      })
    );
    expect(prefRes.status).toBe(200);

    const pubRes2 = await getPublicUser(new Request('http://localhost:3000'), {
      params: Promise.resolve({ username: 'maya_st' }),
    });
    const pubJson2 = await pubRes2.json();
    expect(pubJson2.data.profile.isPrivate).toBe(true);
    expect(pubJson2.data.profile.bio).toBeUndefined();
  });

  it('enforces squad ownership isolation and blocks player mutations for standard users', async () => {
    const userA = await registerTestUser({
      fullName: 'User A',
      username: 'user_a',
      email: 'a@rivalry90.dev',
    });
    const userB = await registerTestUser({
      fullName: 'User B',
      username: 'user_b',
      email: 'b@rivalry90.dev',
    });

    // Standard user cannot create master player (403)
    const forbidPlayer = await postPlayers(
      makeAuthedReq('http://localhost:3000/api/players', userA.cookie, 'POST', {
        name: 'Blocked Player',
        number: 77,
        position: 'ST',
        role: 'Poacher',
        teamId: 'apex-united',
        nationality: 'France',
        bio: 'Blocked creation attempt by unprivileged account.',
        stats: { pace: 80, shooting: 80, passing: 75, dribbling: 79, defending: 40, physical: 75 },
      })
    );
    expect(forbidPlayer.status).toBe(403);

    // User A creates squad, User B cannot access User A's squad (403)
    const slots = FORMATIONS['4-3-3'].slots.map((role, slotIndex) => ({
      slotIndex,
      role,
      playerId: slotIndex === 9 ? 'kai-vance' : null,
    }));
    const sqRes = await postSquads(
      makeAuthedReq('http://localhost:3000/api/squads', userA.cookie, 'POST', {
        name: 'User A Lineup',
        formation: '4-3-3',
        slots,
      })
    );
    const sqJson = await sqRes.json();
    const squadId = sqJson.data.squad.id;

    const hijackRes = await getOwnedSquad(
      makeAuthedReq(`http://localhost:3000/api/squads/${squadId}`, userB.cookie),
      { params: Promise.resolve({ squadId }) }
    );
    expect(hijackRes.status).toBe(403);
  });

  it('keeps draft CMS articles hidden publicly and enforces Super Admin safety rules & audit logs', async () => {
    const superReg = await registerTestUser({
      fullName: 'Root Director',
      username: 'root_dir',
      email: 'root@rivalry90.dev',
    });
    const staffReg = await registerTestUser({
      fullName: 'Staff User',
      username: 'staff_one',
      email: 'staff@rivalry90.dev',
    });

    // Promote root_dir to super_admin in dev store setup
    const store = getDevStore();
    store.users.find((u) => u.id === superReg.userId).role = 'super_admin';

    // Super admin creates draft news article
    const draftRes = await postNews(
      makeAuthedReq('http://localhost:3000/api/news', superReg.cookie, 'POST', {
        title: 'Internal Draft Briefing',
        category: 'Studio Dispatches',
        excerpt: 'Private editorial draft invisible to unauthenticated visitors.',
        body: ['Draft paragraph only.'],
        publicationStatus: 'draft',
      })
    );
    expect(draftRes.status).toBe(201);
    const draftJson = await draftRes.json();
    const draftSlug = draftJson.data.article.slug;

    // Public list & public slug lookup hide draft
    const publicList = await getNews(
      new Request('http://localhost:3000/api/news?includeDrafts=true')
    );
    const publicListJson = await publicList.json();
    expect(publicListJson.data.news.some((a) => a.slug === draftSlug)).toBe(false);

    const publicSlugRes = await getNewsSlug(
      new Request(`http://localhost:3000/api/news/${draftSlug}`),
      {
        params: Promise.resolve({ slug: draftSlug }),
      }
    );
    expect(publicSlugRes.status).toBe(404);

    // Cleanup draft
    const delNewsRes = await deleteNews(
      makeAuthedReq(`http://localhost:3000/api/news/${draftSlug}`, superReg.cookie, 'DELETE'),
      { params: Promise.resolve({ slug: draftSlug }) }
    );
    expect(delNewsRes.status).toBe(200);

    // Admin self-role-change & self-suspend blocked (403)
    const selfRoleRes = await patchAdminUser(
      makeAuthedReq(
        `http://localhost:3000/api/admin/users/${superReg.userId}`,
        superReg.cookie,
        'PATCH',
        { role: 'user' }
      ),
      { params: Promise.resolve({ id: superReg.userId }) }
    );
    expect(selfRoleRes.status).toBe(403);

    const selfSuspendRes = await suspendAdminUser(
      makeAuthedReq(
        `http://localhost:3000/api/admin/users/${superReg.userId}/suspend`,
        superReg.cookie,
        'POST',
        {}
      ),
      { params: Promise.resolve({ id: superReg.userId }) }
    );
    expect(selfSuspendRes.status).toBe(403);

    // Promote staff_one to moderator and suspend them cleanly
    const modPromote = await patchAdminUser(
      makeAuthedReq(
        `http://localhost:3000/api/admin/users/${staffReg.userId}`,
        superReg.cookie,
        'PATCH',
        { role: 'moderator' }
      ),
      { params: Promise.resolve({ id: staffReg.userId }) }
    );
    expect(modPromote.status).toBe(200);

    // Moderator cannot read audit logs (403), Super Admin can (200)
    const modAudit = await getAuditLogs(
      makeAuthedReq('http://localhost:3000/api/admin/audit-logs', staffReg.cookie)
    );
    expect(modAudit.status).toBe(403);

    const superAudit = await getAuditLogs(
      makeAuthedReq('http://localhost:3000/api/admin/audit-logs', superReg.cookie)
    );
    expect(superAudit.status).toBe(200);
    const superAuditJson = await superAudit.json();
    expect(superAuditJson.data.items.some((e) => e.action === 'admin.user_role_changed')).toBe(
      true
    );
  });
});
