import { fetchWithReliability } from '@/lib/integrations/httpClient';
import {
  getIntegrationState,
  recordIntegrationProbe,
} from '@/lib/integrations/integrationRegistry';

const responseCache = new Map();

function getCached(key) {
  const hit = responseCache.get(key);
  if (!hit || Date.now() > hit.expiresAt) {
    responseCache.delete(key);
    return null;
  }
  return hit.value;
}

function setCached(key, value, ttlMs) {
  responseCache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function resetFootballDataCache() {
  responseCache.clear();
}

function getConfig() {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY || '';
  const baseUrl = (
    process.env.FOOTBALL_DATA_BASE_URL || 'https://api.football-data.org/v4'
  ).replace(/\/$/, '');
  return { apiKey, baseUrl, configured: Boolean(apiKey) };
}

async function fetchFootballResource(path, ttlMs = 300_000) {
  const state = getIntegrationState('football-data');
  const { apiKey, baseUrl, configured } = getConfig();

  if (!state.enabled) {
    return {
      configured,
      live: false,
      source: 'football-data.org',
      items: [],
      message: 'Football Data integration is currently disabled by administrator.',
    };
  }

  if (!configured) {
    return {
      configured: false,
      live: false,
      source: 'football-data.org',
      items: [],
      message:
        'FOOTBALL_DATA_API_KEY is not configured. Add a token in .env.local to load live external competitions, standings, and fixtures.',
    };
  }

  const cached = getCached(path);
  if (cached) return { ...cached, cached: true };

  try {
    const { data } = await fetchWithReliability({
      providerId: 'football-data',
      url: `${baseUrl}${path}`,
      headers: { 'X-Auth-Token': apiKey },
      timeoutMs: 6000,
      maxRetries: 1,
    });
    recordIntegrationProbe('football-data', { ok: true });
    const payload = {
      configured: true,
      live: true,
      source: 'football-data.org',
      cached: false,
      data,
    };
    setCached(path, payload, ttlMs);
    return payload;
  } catch (err) {
    recordIntegrationProbe('football-data', { ok: false, error: err.message });
    throw err;
  }
}

export async function getExternalCompetitions() {
  const res = await fetchFootballResource('/competitions', 600_000);
  if (!res.live) return res;
  const competitions = (res.data?.competitions || []).slice(0, 12).map((c) => ({
    externalId: String(c.id),
    code: c.code,
    name: c.name,
    areaName: c.area?.name || '',
    type: c.type,
    currentSeasonEnd: c.currentSeason?.endDate || null,
  }));
  return { ...res, items: competitions };
}

export async function getExternalStandings(competitionCode = 'PL') {
  const safeCode = String(competitionCode || 'PL')
    .replace(/[^A-Za-z0-9]/g, '')
    .slice(0, 8);
  const res = await fetchFootballResource(`/competitions/${safeCode}/standings`, 180_000);
  if (!res.live) return res;
  const table = res.data?.standings?.[0]?.table || [];
  return {
    ...res,
    competition: res.data?.competition?.name || safeCode,
    items: table.map((row) => ({
      position: row.position,
      externalTeamId: String(row.team?.id || ''),
      teamName: row.team?.name || '',
      playedGames: row.playedGames,
      won: row.won,
      draw: row.draw,
      lost: row.lost,
      points: row.points,
      goalDifference: row.goalDifference,
    })),
  };
}

export async function getExternalFixtures(status = 'SCHEDULED') {
  const allowed = new Set(['SCHEDULED', 'LIVE', 'FINISHED']);
  const safeStatus = allowed.has(String(status).toUpperCase())
    ? String(status).toUpperCase()
    : 'SCHEDULED';
  const ttl = safeStatus === 'LIVE' ? 45_000 : 180_000;
  const res = await fetchFootballResource(`/matches?status=${safeStatus}`, ttl);
  if (!res.live) return res;
  const matches = (res.data?.matches || []).slice(0, 20).map((m) => ({
    externalMatchId: String(m.id),
    competition: m.competition?.name || '',
    utcDate: m.utcDate,
    status: m.status,
    homeTeam: m.homeTeam?.name || '',
    awayTeam: m.awayTeam?.name || '',
    score: m.score?.fullTime || { home: null, away: null },
  }));
  return { ...res, items: matches };
}

export async function probeFootballDataConnection() {
  const res = await getExternalCompetitions();
  return {
    providerId: 'football-data',
    configured: res.configured,
    connected: Boolean(res.live),
    message: res.live ? `Connected (${res.items.length} competitions accessible).` : res.message,
  };
}
