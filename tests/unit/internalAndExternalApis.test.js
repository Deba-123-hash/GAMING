// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { SERVER_CONFIG } from '@/server/config/serverConfig';
import { getDevStore, resetDevStore } from '@/server/database/devMemoryStore';
import { resetRateLimitStore } from '@/server/security/rateLimit';
import { FORMATIONS } from '@/lib/constants';
import { POST as postRegister } from '@/app/api/auth/register/route';
import { GET as getProfile } from '@/app/api/profile/route';
import { PATCH as patchSettings } from '@/app/api/profile/settings/route';
import { PATCH as patchPrivacy } from '@/app/api/profile/privacy/route';
import { GET as getFormations } from '@/app/api/formations/route';
import { GET as getFeaturedPlayers } from '@/app/api/players/featured/route';
import { GET as searchPlayers } from '@/app/api/players/search/route';
import { GET as searchTeams } from '@/app/api/teams/search/route';
import { GET as getModeCategories } from '@/app/api/game-modes/categories/route';
import { GET as getModeDetail } from '@/app/api/game-modes/[slug]/route';
import { POST as postSquads } from '@/app/api/squads/route';
import { GET as getOwnedSquad } from '@/app/api/squads/[squadId]/route';
import { POST as assignSlotPlayer } from '@/app/api/squads/[squadId]/players/route';
import { DELETE as removeSquadPlayer } from '@/app/api/squads/[squadId]/players/[playerId]/route';
import {
  DELETE as unregisterEvent,
  POST as registerEvent,
} from '@/app/api/events/[slug]/register/route';
import { GET as getFeaturedNews } from '@/app/api/news/featured/route';
import { GET as getAdminAnalytics } from '@/app/api/admin/analytics/route';
import { GET as getFootballCompetitions } from '@/app/api/football/competitions/route';
import { POST as postAiSquadAnalysis } from '@/app/api/ai/squad-analysis/route';
import { POST as postAiPlayerAnalysis } from '@/app/api/ai/player-analysis/route';
import { POST as postAiChat } from '@/app/api/ai/chat/route';
import { GET as getIntegrationStatus } from '@/app/api/integrations/status/route';
import { POST as postAdminIntegrations } from '@/app/api/admin/integrations/route';
import {
  getExternalCompetitions,
  resetFootballDataCache,
} from '@/services/external/footballDataService';
import { sendTransactionalEmail } from '@/services/external/emailService';
import { buildSafeYouTubeEmbedUrl } from '@/services/external/videoService';
import { sanitizeAnalyticsEvent } from '@/services/external/analyticsService';

function authedReq(url, cookie, method = 'GET', body = null) {
  return new NextRequest(url, {
    method,
    headers: {
      ...(body !== null ? { 'Content-Type': 'application/json' } : {}),
      ...(cookie ? { Cookie: `${SERVER_CONFIG.sessionCookieName}=${cookie}` } : {}),
    },
    ...(body !== null ? { body: JSON.stringify(body) } : {}),
  });
}

async function registerUser(username, email) {
  const res = await postRegister(
    new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: username,
        username,
        email,
        password: 'Password1',
        confirmPassword: 'Password1',
        acceptTerms: true,
      }),
    })
  );
  const json = await res.json();
  return {
    userId: json.data.user.id,
    cookie: res.cookies.get(SERVER_CONFIG.sessionCookieName)?.value,
  };
}

describe('Phase 21 & 22 Internal & External API Integration', () => {
  beforeEach(() => {
    resetDevStore();
    resetRateLimitStore();
    resetFootballDataCache();
    delete process.env.FOOTBALL_DATA_API_KEY;
    delete process.env.GEMINI_API_KEY;
    delete process.env.RESEND_API_KEY;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('completes Phase 21 E2E user journey across profile, catalogs, squads, events & admin analytics', async () => {
    const userA = await registerUser('journey_mgr', 'journey@rivalry90.dev');

    const profRes = await getProfile(authedReq('http://localhost:3000/api/profile', userA.cookie));
    expect(profRes.status).toBe(200);

    const setRes = await patchSettings(
      authedReq('http://localhost:3000/api/profile/settings', userA.cookie, 'PATCH', {
        appearanceTheme: 'dark',
      })
    );
    expect(setRes.status).toBe(200);

    const privRes = await patchPrivacy(
      authedReq('http://localhost:3000/api/profile/privacy', userA.cookie, 'PATCH', {
        profileVisibility: 'limited',
      })
    );
    expect(privRes.status).toBe(200);

    const [formRes, featPRes, searchPRes, searchTRes, modeCatRes, modeDetRes, featNewsRes] =
      await Promise.all([
        getFormations(),
        getFeaturedPlayers(new Request('http://localhost:3000/api/players/featured?limit=4')),
        searchPlayers(new Request('http://localhost:3000/api/players/search?q=kai')),
        searchTeams(new Request('http://localhost:3000/api/teams/search?q=apex')),
        getModeCategories(),
        getModeDetail(new Request('http://localhost:3000'), {
          params: Promise.resolve({ slug: 'quick-match' }),
        }),
        getFeaturedNews(),
      ]);

    expect((await formRes.json()).data.formations.length).toBe(10);
    expect((await featPRes.json()).data.players.length).toBe(4);
    expect((await searchPRes.json()).data.players[0].id).toBe('kai-vance');
    expect((await searchTRes.json()).data.teams[0].id).toBe('apex-united');
    expect((await modeCatRes.json()).data.categories.length).toBeGreaterThan(0);
    expect(modeDetRes.status).toBe(200);
    expect((await featNewsRes.json()).data.news.length).toBeGreaterThan(0);

    // Squad lifecycle: create -> assign player -> remove player -> retrieve persisted state
    const emptySlots = FORMATIONS['4-3-3'].slots.map((role, slotIndex) => ({
      slotIndex,
      role,
      playerId: null,
    }));
    const createSq = await postSquads(
      authedReq('http://localhost:3000/api/squads', userA.cookie, 'POST', {
        name: 'Journey XI',
        formation: '4-3-3',
        slots: emptySlots,
      })
    );
    const squadId = (await createSq.json()).data.squad.id;
    expect(createSq.status).toBe(201);

    const assignRes = await assignSlotPlayer(
      authedReq(`http://localhost:3000/api/squads/${squadId}/players`, userA.cookie, 'POST', {
        slotIndex: 9,
        playerId: 'kai-vance',
      }),
      { params: Promise.resolve({ squadId }) }
    );
    expect((await assignRes.json()).data.squad.ratings.filledCount).toBe(1);

    const delPlayerRes = await removeSquadPlayer(
      authedReq(
        `http://localhost:3000/api/squads/${squadId}/players/kai-vance`,
        userA.cookie,
        'DELETE'
      ),
      { params: Promise.resolve({ squadId, playerId: 'kai-vance' }) }
    );
    expect((await delPlayerRes.json()).data.squad.ratings.filledCount).toBe(0);

    const reloadSq = await getOwnedSquad(
      authedReq(`http://localhost:3000/api/squads/${squadId}`, userA.cookie),
      { params: Promise.resolve({ squadId }) }
    );
    expect(reloadSq.status).toBe(200);

    // Event register & unregister
    const regEv = await registerEvent(
      authedReq('http://localhost:3000/api/events/rivalry-cup/register', userA.cookie, 'POST'),
      { params: Promise.resolve({ slug: 'rivalry-cup' }) }
    );
    expect(regEv.status).toBe(201);
    const unregEv = await unregisterEvent(
      authedReq('http://localhost:3000/api/events/rivalry-cup/register', userA.cookie, 'DELETE'),
      { params: Promise.resolve({ slug: 'rivalry-cup' }) }
    );
    expect(unregEv.status).toBe(200);

    // Admin analytics gated by permission
    const anonAnalytics = await getAdminAnalytics(
      authedReq('http://localhost:3000/api/admin/analytics', userA.cookie)
    );
    expect(anonAnalytics.status).toBe(403);
    getDevStore().users.find((u) => u.id === userA.userId).role = 'admin';
    const adminAnalytics = await getAdminAnalytics(
      authedReq('http://localhost:3000/api/admin/analytics', userA.cookie)
    );
    expect(adminAnalytics.status).toBe(200);
  });

  it('keeps external football data honest when unconfigured and handles upstream success/errors safely', async () => {
    const unconfRes = await getFootballCompetitions();
    const unconfJson = await unconfRes.json();
    expect(unconfRes.status).toBe(200);
    expect(unconfJson.data.configured).toBe(false);
    expect(unconfJson.data.live).toBe(false);
    expect(unconfJson.data.items).toEqual([]);

    // Mocked provider success & caching
    process.env.FOOTBALL_DATA_API_KEY = 'test-fake-token';
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          competitions: [
            {
              id: 2021,
              code: 'PL',
              name: 'Premier League',
              area: { name: 'England' },
              type: 'LEAGUE',
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );

    const live1 = await getExternalCompetitions();
    expect(live1.live).toBe(true);
    expect(live1.items[0].code).toBe('PL');
    const live2 = await getExternalCompetitions();
    expect(live2.cached).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Mocked 429 rate-limit response propagates safely
    resetFootballDataCache();
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('rate limited', { status: 429, headers: { 'retry-after': '30' } })
    );
    await expect(getExternalCompetitions()).rejects.toMatchObject({
      statusCode: 429,
      code: 'PROVIDER_RATE_LIMITED',
    });
  });

  it('secures AI endpoints, enforces squad ownership, falls back gracefully, and masks secrets', async () => {
    const userA = await registerUser('ai_user_a', 'aia@rivalry90.dev');
    const userB = await registerUser('ai_user_b', 'aib@rivalry90.dev');

    // Unauthenticated rejected
    const anonChat = await postAiChat(
      new NextRequest('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: 'Explain 4-3-3?' }),
      })
    );
    expect(anonChat.status).toBe(401);

    // Ownership isolation on AI squad analysis
    const slots = FORMATIONS['4-3-3'].slots.map((role, slotIndex) => ({
      slotIndex,
      role,
      playerId: slotIndex === 9 ? 'kai-vance' : null,
    }));
    const sqRes = await postSquads(
      authedReq('http://localhost:3000/api/squads', userA.cookie, 'POST', {
        name: 'AI Test XI',
        formation: '4-3-3',
        slots,
      })
    );
    const squadId = (await sqRes.json()).data.squad.id;

    const hijackAi = await postAiSquadAnalysis(
      authedReq('http://localhost:3000/api/ai/squad-analysis', userB.cookie, 'POST', { squadId })
    );
    expect(hijackAi.status).toBe(403);

    // Honest fallback when GEMINI_API_KEY unset
    const ownAi = await postAiSquadAnalysis(
      authedReq('http://localhost:3000/api/ai/squad-analysis', userA.cookie, 'POST', { squadId })
    );
    const ownJson = await ownAi.json();
    expect(ownAi.status).toBe(200);
    expect(ownJson.data.analysis.aiProviderConnected).toBe(false);
    expect(ownJson.data.analysis.advisoryOnly).toBe(true);

    const playerAi = await postAiPlayerAnalysis(
      authedReq('http://localhost:3000/api/ai/player-analysis', userA.cookie, 'POST', {
        playerIds: ['kai-vance'],
      })
    );
    expect(playerAi.status).toBe(200);

    // Email safety in test mode, YouTube privacy embed, PII-free analytics, Admin integration RBAC
    process.env.RESEND_API_KEY = 're_test_dummy';
    const emailRes = await sendTransactionalEmail({
      to: 'test@example.com',
      subject: 'Test',
      html: '<p>Test</p>',
    });
    expect(emailRes.testSuppressed).toBe(true);
    expect(emailRes.sent).toBe(false);

    expect(buildSafeYouTubeEmbedUrl('dQw4w9WgXcQ')).toBe(
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'
    );

    const tracked = sanitizeAnalyticsEvent('squad_save', {
      formation: '4-3-3',
      email: 'should-be-stripped@example.com',
    });
    expect(tracked.properties.email).toBeUndefined();
    expect(tracked.properties.formation).toBe('4-3-3');

    const statusRes = await getIntegrationStatus();
    expect((await statusRes.json()).data.providers.length).toBeGreaterThanOrEqual(6);

    const forbiddenAdmin = await postAdminIntegrations(
      authedReq('http://localhost:3000/api/admin/integrations', userB.cookie, 'POST', {
        action: 'toggle',
        providerId: 'football-data',
        enabled: false,
      })
    );
    expect(forbiddenAdmin.status).toBe(403);
  });
});
