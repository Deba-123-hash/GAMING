/**
 * Safe public & server environment accessors.
 * Never import getServerEnv() from client components.
 */
export function getPublicEnv() {
  return {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    enable3DDevtools: process.env.NEXT_PUBLIC_ENABLE_3D_DEVTOOLS === 'true',
  };
}

export function getServerEnv() {
  if (typeof window !== 'undefined') {
    throw new Error('getServerEnv() must only be called on the server.');
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceRoleKey,
    isSupabaseConfigured: Boolean(supabaseUrl && (supabaseServiceRoleKey || supabaseAnonKey)),
    hasServiceRoleKey: Boolean(supabaseServiceRoleKey),
  };
}
