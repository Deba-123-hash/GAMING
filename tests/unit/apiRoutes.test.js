// @vitest-environment node
import { beforeEach, describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getHealth } from '@/app/api/health/route';
import { GET as getVersion } from '@/app/api/version/route';
import { GET as getPlayers } from '@/app/api/players/route';
import { GET as getPlayerDetail } from '@/app/api/players/[playerId]/route';
import { GET as getTeams } from '@/app/api/teams/route';
import { POST as postSupport } from '@/app/api/support/route';
import { POST as postSquads } from '@/app/api/squads/route';
import { POST as postRegister } from '@/app/api/auth/register/route';
import { FORMATIONS } from '@/lib/constants';
import { resetDevStore } from '@/server/database/devMemoryStore';
import { resetRateLimitStore } from '@/server/security/rateLimit';

describe('Phases 11-16 Core Route Handlers (/api/*)', () => {
  beforeEach(() => {
    resetDevStore();
    resetRateLimitStore();
  });

  it('returns standardized healthy payload from /api/health and /api/version', async () => {
    const res = await getHealth();
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.ok).toBe(true);
    expect(json.meta?.requestId).toBeTruthy();
    expect(json.data.service).toBe('rivalry90-api');
    expect(json.data.database?.mode).toBe('development-memory-fallback');

    const vRes = await getVersion();
    const vJson = await vRes.json();
    expect(vRes.status).toBe(200);
    expect(vJson.data.apiVersion).toBe('1.0.0');
  });

  it('filters players via /api/players with pagination and handles 404 on unknown playerId', async () => {
    const res = await getPlayers(
      new Request('http://localhost:3000/api/players?position=FWD&page=1&pageSize=10')
    );
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.data.players.length).toBeGreaterThan(0);
    expect(json.data.players.every((p) => p.positionGroup === 'FWD')).toBe(true);

    const detailRes = await getPlayerDetail(new Request('http://localhost:3000'), {
      params: Promise.resolve({ playerId: 'kai-vance' }),
    });
    expect(detailRes.status).toBe(200);

    const missingRes = await getPlayerDetail(new Request('http://localhost:3000'), {
      params: Promise.resolve({ playerId: 'does-not-exist' }),
    });
    expect(missingRes.status).toBe(404);
  });

  it('lists clubs and national teams from /api/teams', async () => {
    const res = await getTeams(new Request('http://localhost:3000/api/teams'));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.data.teams.length).toBe(10);

    const natRes = await getTeams(
      new Request('http://localhost:3000/api/teams?type=National%20Team')
    );
    const natJson = await natRes.json();
    expect(natJson.data.teams.length).toBe(4);
  });

  it('validates /api/support with Zod and avoids false DB persistence claims', async () => {
    const badRes = await postSupport(
      new Request('http://localhost:3000/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'A', email: 'bad', category: 'general', message: 'short' }),
      })
    );
    expect(badRes.status).toBe(400);

    const goodRes = await postSupport(
      new Request('http://localhost:3000/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Alex Rivera',
          email: 'alex@rivalry90.dev',
          category: '3d-performance',
          message: 'Testing server-side Zod validation for Phase 11 backend foundation.',
        }),
      })
    );
    const json = await goodRes.json();
    expect(goodRes.status).toBe(202);
    expect(json.data.persisted).toBe(false);
    expect(json.data.mode).toBe('validation-only-no-db');
  });

  it('requires authentication for /api/squads and computes ratings server-side', async () => {
    const slots = FORMATIONS['4-3-3'].slots.map((role, slotIndex) => ({
      slotIndex,
      role,
      playerId: slotIndex === 9 ? 'kai-vance' : null,
    }));

    const anonRes = await postSquads(
      new NextRequest('http://localhost:3000/api/squads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Apex Starting XI', formation: '4-3-3', slots }),
      })
    );
    expect(anonRes.status).toBe(401);

    const regRes = await postRegister(
      new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'Squad Manager',
          username: 'squad_mgr',
          email: 'mgr@rivalry90.dev',
          password: 'Password1',
          confirmPassword: 'Password1',
          acceptTerms: true,
        }),
      })
    );
    const cookieVal = regRes.cookies.get('r90_session')?.value;
    expect(cookieVal).toBeTruthy();

    const authedRes = await postSquads(
      new NextRequest('http://localhost:3000/api/squads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `r90_session=${cookieVal}`,
        },
        body: JSON.stringify({ name: 'Apex Starting XI', formation: '4-3-3', slots }),
      })
    );
    const json = await authedRes.json();
    expect(authedRes.status).toBe(201);
    expect(json.data.squad.ratings.filledCount).toBe(1);
    expect(json.data.squad.ratings.overallRating).toBe(91);
  });
});
