import { getDevStore } from '@/server/database/devMemoryStore';

const PROVIDER_CATALOG = [
  {
    id: 'football-data',
    name: 'football-data.org (v4)',
    category: 'Football Data',
    docsUrl: 'https://www.football-data.org/documentation/quickstart',
    rateLimitNote: 'Free tier: 10 requests/min, 12 core competitions, delayed live scores.',
    envKeys: ['FOOTBALL_DATA_API_KEY'],
  },
  {
    id: 'gemini-ai',
    name: 'Google Gemini API',
    category: 'AI Intelligence',
    docsUrl: 'https://ai.google.dev/gemini-api/docs',
    rateLimitNote:
      'Free tier Flash RPM/RPD limits; Paid tier removes Google training data retention.',
    envKeys: ['GEMINI_API_KEY'],
  },
  {
    id: 'resend-email',
    name: 'Resend Transactional Email',
    category: 'Email Delivery',
    docsUrl: 'https://resend.com/docs/api-reference/emails/send-email',
    rateLimitNote: 'Free tier: 3,000 emails/month, 100/day (UTC), 10 req/sec.',
    envKeys: ['RESEND_API_KEY'],
  },
  {
    id: 'media-storage',
    name: 'Supabase Storage / Cloudinary',
    category: 'Media & Images',
    docsUrl: 'https://cloudinary.com/documentation',
    rateLimitNote:
      'Reuses Supabase Storage by default; optional Cloudinary CDN when keys configured.',
    envKeys: ['NEXT_PUBLIC_SUPABASE_URL', 'CLOUDINARY_CLOUD_NAME'],
  },
  {
    id: 'youtube-video',
    name: 'YouTube Data API v3',
    category: 'Video Metadata',
    docsUrl: 'https://developers.google.com/youtube/v3',
    rateLimitNote: 'Falls back to verified safe embed links when YOUTUBE_API_KEY is unset.',
    envKeys: ['YOUTUBE_API_KEY'],
  },
  {
    id: 'analytics',
    name: 'Vercel Analytics / GA4',
    category: 'Privacy-Safe Analytics',
    docsUrl: 'https://vercel.com/docs/analytics',
    rateLimitNote: 'Zero PII and zero private squad telemetry.',
    envKeys: ['NEXT_PUBLIC_VERCEL_ANALYTICS_ID', 'NEXT_PUBLIC_GA_MEASUREMENT_ID'],
  },
];

function isProviderEnvConfigured(envKeys) {
  return envKeys.some((key) => Boolean(process.env[key]));
}

export function getIntegrationState(providerId) {
  const store = getDevStore();
  if (!store.externalIntegrations[providerId]) {
    store.externalIntegrations[providerId] = {
      enabled: true,
      lastStatus: 'unverified',
      lastCheckedAt: null,
      lastError: null,
    };
  }
  return store.externalIntegrations[providerId];
}

export function setIntegrationEnabled(providerId, enabled) {
  const state = getIntegrationState(providerId);
  state.enabled = Boolean(enabled);
  return state;
}

export function recordIntegrationProbe(providerId, { ok, error = null }) {
  const state = getIntegrationState(providerId);
  state.lastCheckedAt = new Date().toISOString();
  state.lastStatus = ok ? 'connected' : 'error';
  state.lastError = ok ? null : String(error || 'Probe failed');
  return state;
}

export function listIntegrationsStatus() {
  return PROVIDER_CATALOG.map((item) => {
    const configured = isProviderEnvConfigured(item.envKeys);
    const runtime = getIntegrationState(item.id);

    let connectionStatus = 'not-configured';
    if (!runtime.enabled) {
      connectionStatus = 'disabled';
    } else if (configured) {
      connectionStatus = runtime.lastStatus === 'connected' ? 'connected' : runtime.lastStatus;
    }

    return {
      id: item.id,
      name: item.name,
      category: item.category,
      docsUrl: item.docsUrl,
      rateLimitNote: item.rateLimitNote,
      configured,
      enabled: runtime.enabled,
      connectionStatus,
      lastCheckedAt: runtime.lastCheckedAt,
      lastError: runtime.lastError,
      requiredEnvKeys: item.envKeys,
    };
  });
}
