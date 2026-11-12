import { PLAYERS } from '@/data/players';
import { TEAMS } from '@/data/teams';
import { EVENTS } from '@/data/events';
import { NEWS_ARTICLES } from '@/data/news';
import { MEDIA_ITEMS } from '@/data/mediaData';
import { CONTENT_CATEGORIES } from '@/data/categories';
import { ROLE_DEFINITIONS } from '@/server/auth/rbac';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createInitialStore() {
  return {
    users: [],
    profiles: [],
    sessions: new Map(),
    verificationTokens: new Map(), // hashedToken -> { userId, expiresAt, used }
    resetTokens: new Map(), // hashedToken -> { userId, expiresAt, used }
    players: clone(PLAYERS),
    teams: clone(TEAMS),
    squads: [],
    events: clone(EVENTS),
    eventRegistrations: [],
    news: clone(NEWS_ARTICLES),
    media: clone(MEDIA_ITEMS),
    categories: clone(CONTENT_CATEGORIES),
    roles: clone(ROLE_DEFINITIONS),
    auditLogs: [],
    supportTickets: [],
    externalIntegrations: {},
    aiUsageRecords: [],
    settings: {
      platformName: 'RIVALRY 90',
      platformDescription: 'Next-Generation 3D Football Gaming Universe',
      defaultLanguage: 'en',
      defaultTimezone: 'UTC',
      defaultTheme: 'dark',
      featuredEventId: 'rivalry-cup',
      updatedAt: new Date().toISOString(),
    },
  };
}

export function getDevStore() {
  if (!globalThis.__r90DevMemoryStore) {
    globalThis.__r90DevMemoryStore = createInitialStore();
  }
  return globalThis.__r90DevMemoryStore;
}

export function resetDevStore() {
  globalThis.__r90DevMemoryStore = createInitialStore();
  return globalThis.__r90DevMemoryStore;
}
