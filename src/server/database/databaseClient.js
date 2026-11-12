import { getServerEnv } from '@/lib/env';
import { getServerSupabaseClient } from '@/lib/supabase/server';
import { normalizeDatabaseError } from '@/server/database/databaseErrors';
import { getMigrationManifest } from '@/server/database/migrationRegistry';
import { runDatabaseIntegrityAudit } from '@/server/database/integrityAudit';

export function getPoolConfiguration() {
  const env = getServerEnv();
  return {
    provider: 'supabase-postgresql',
    poolingMode: env.isSupabaseConfigured
      ? 'supabase-managed-http-pgbouncer'
      : 'in-memory-fallback',
    clientReuse: 'module-singleton',
    defaultTimeoutMs: 5000,
    serviceRoleConfigured: Boolean(env.supabaseServiceRoleKey),
  };
}

export function getDatabaseStatus() {
  const env = getServerEnv();
  if (!env.isSupabaseConfigured) {
    return {
      provider: 'supabase-postgresql',
      configured: false,
      connected: false,
      status: 'not-configured',
      mode: 'development-memory-fallback',
    };
  }

  return {
    provider: 'supabase-postgresql',
    configured: true,
    connected: false, // Becomes true only after live query probe succeeds
    status: 'configured-unverified',
    mode: 'supabase',
  };
}

export function getDatabaseClient() {
  return getServerSupabaseClient();
}

export async function runWithDatabaseTimeout(operation, timeoutMs = 5000) {
  let timer;
  try {
    const timeoutPromise = new Promise((_, reject) => {
      timer = setTimeout(() => {
        const err = new Error('Database operation timed out');
        err.code = '57014';
        reject(err);
      }, timeoutMs);
    });
    return await Promise.race([operation(), timeoutPromise]);
  } catch (err) {
    throw normalizeDatabaseError(err);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function checkDatabaseHealth({ includeDiagnostics = false } = {}) {
  const baseStatus = getDatabaseStatus();
  const pooling = getPoolConfiguration();
  const manifest = getMigrationManifest();
  const client = getDatabaseClient();

  let reachable = false;
  let latencyMs = null;
  let liveProbeStatus = baseStatus.status;

  if (client) {
    const start = Date.now();
    try {
      const { error } = await runWithDatabaseTimeout(
        () => client.from('teams').select('id', { count: 'exact', head: true }),
        4000
      );
      latencyMs = Date.now() - start;
      if (!error) {
        reachable = true;
        liveProbeStatus = 'connected';
      } else {
        liveProbeStatus = 'configured-schema-pending';
      }
    } catch {
      latencyMs = Date.now() - start;
      liveProbeStatus = 'unreachable';
    }
  }

  const publicPayload = {
    provider: baseStatus.provider,
    configured: baseStatus.configured,
    connected: reachable,
    status: liveProbeStatus,
    mode: baseStatus.mode,
    latencyMs,
    pooling: {
      mode: pooling.poolingMode,
      clientReuse: pooling.clientReuse,
      defaultTimeoutMs: pooling.defaultTimeoutMs,
    },
    migrationManifestCount: manifest.migrations.length,
    checkedAt: new Date().toISOString(),
  };

  if (!includeDiagnostics) {
    return publicPayload;
  }

  return {
    ...publicPayload,
    diagnostics: {
      migrations: manifest.migrations.map((m) => ({
        version: m.version,
        bytes: m.bytes,
        destructive: m.destructive,
      })),
      hasDestructiveMigrations: manifest.hasDestructiveStatements,
      integrity: runDatabaseIntegrityAudit(),
      backupStatus: baseStatus.configured
        ? 'Managed by Supabase (verify automated schedule & PITR in Supabase Project Settings)'
        : 'Awaiting live Supabase provider configuration in .env.local',
      environmentSeparation: {
        nodeEnv: process.env.NODE_ENV || 'development',
        serviceRoleIsolatedToServer: true,
        rlsPolicyFilePresent: manifest.migrations.some((m) => m.version.includes('rls')),
      },
    },
  };
}
