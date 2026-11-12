import { getServerEnv } from '@/lib/env';

export { getServerEnv };

export const SERVER_CONFIG = {
  appName: 'RIVALRY 90',
  apiVersion: '1.0.0',
  appVersion: '0.1.0',
  apiBasePath: '/api',
  allowedEnvironments: ['development', 'test', 'production'],
  sessionCookieName: 'r90_session',
  sessionMaxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
};

export function getRuntimeConfig() {
  const env = getServerEnv();
  return {
    ...SERVER_CONFIG,
    nodeEnv: env.nodeEnv,
    siteUrl: env.siteUrl,
    isSupabaseConfigured: env.isSupabaseConfigured,
    isEmailConfigured: Boolean(process.env.RESEND_API_KEY),
    storageBucket: process.env.SUPABASE_STORAGE_BUCKET || 'rivalry90-public-assets',
  };
}
