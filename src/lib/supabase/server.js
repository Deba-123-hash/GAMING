import { createClient } from '@supabase/supabase-js';
import { getServerEnv } from '@/lib/env';

let cachedClient = null;
let cachedSignature = null;

/**
 * Reuses a single server-side Supabase client per credential configuration
 * to avoid per-request client instantiation and connection churn.
 * Returns null cleanly when Supabase credentials are not configured.
 */
export function getServerSupabaseClient() {
  const env = getServerEnv();
  if (!env.isSupabaseConfigured) {
    cachedClient = null;
    cachedSignature = null;
    return null;
  }

  const key = env.supabaseServiceRoleKey || env.supabaseAnonKey;
  const signature = `${env.supabaseUrl}:${key.slice(0, 8)}:${Boolean(env.supabaseServiceRoleKey)}`;
  if (cachedClient && cachedSignature === signature) {
    return cachedClient;
  }

  cachedSignature = signature;
  cachedClient = createClient(env.supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-application-name': 'rivalry90-server',
      },
    },
  });

  return cachedClient;
}

export function resetCachedSupabaseClient() {
  cachedClient = null;
  cachedSignature = null;
}
