// @vitest-environment node
import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { buildDeterministicSeedPayload } from '@/../database/seeds/buildSeedPayload';
import { SERVER_CONFIG } from '@/server/config/serverConfig';
import { getDevStore, resetDevStore } from '@/server/database/devMemoryStore';
import { normalizeDatabaseError } from '@/server/database/databaseErrors';
import { runDatabaseIntegrityAudit } from '@/server/database/integrityAudit';
import { getMigrationManifest } from '@/server/database/migrationRegistry';
import { runWithDatabaseTimeout } from '@/server/database/databaseClient';
import { resetRateLimitStore } from '@/server/security/rateLimit';
import { POST as postRegister } from '@/app/api/auth/register/route';
import { GET as getDbHealth } from '@/app/api/health/database/route';
import { GET as getAdminSecurity } from '@/app/api/admin/security/route';

describe('Phases 18-20 Database Architecture, Migrations, Seeds & Security Ops', () => {
  beforeEach(() => {
    resetDevStore();
    resetRateLimitStore();
  });

  it('maintains ordered non-destructive SQL migrations, RLS rules, and matching ER diagram', () => {
    const manifest = getMigrationManifest();
    expect(manifest.directoryExists).toBe(true);
    expect(manifest.migrations.length).toBeGreaterThanOrEqual(3);
    expect(manifest.hasDestructiveStatements).toBe(false);

    const m1 = fs.readFileSync(
      path.join(process.cwd(), 'database', 'migrations', '0001_initial_schema.sql'),
      'utf8'
    );
    expect(m1).toContain('uq_squad_unique_player UNIQUE (squad_id, player_id)');
    expect(m1).toContain('uq_event_user_reg UNIQUE (event_id, user_id)');

    const m3 = fs.readFileSync(
      path.join(process.cwd(), 'database', 'migrations', '0003_rls_and_security.sql'),
      'utf8'
    );
    expect(m3).toContain('ENABLE ROW LEVEL SECURITY');
    expect(m3).toContain('trg_audit_logs_immutable');

    const er = fs.readFileSync(
      path.join(process.cwd(), 'database', 'diagrams', 'er-diagram.mmd'),
      'utf8'
    );
    expect(er).toContain('erDiagram');
    for (const entity of [
      'users',
      'user_profiles',
      'roles',
      'permissions',
      'teams',
      'players',
      'squads',
      'squad_players',
      'events',
      'articles',
      'media_assets',
      'audit_logs',
    ]) {
      expect(er).toContain(entity);
    }
  });

  it('produces deterministic seed payloads matching all universe requirements', () => {
    const seed = buildDeterministicSeedPayload();
    expect(seed.players.length).toBe(32);
    expect(seed.teams.length).toBe(10);
    expect(seed.teams.filter((t) => t.team_type === 'Club').length).toBe(6);
    expect(seed.teams.filter((t) => t.team_type === 'National Team').length).toBe(4);
    expect(seed.formations.length).toBe(10);
    expect(seed.formationPositionsCount).toBe(110);
    expect(seed.gameModes.length).toBe(8);
    expect(seed.events.length).toBe(6);
    expect(seed.news.length).toBe(10);
    expect(seed.media.length).toBe(12);
    expect(seed.roles.length).toBe(5);
    expect(seed.permissions.length).toBe(19);
  });

  it('maps PostgreSQL SQLSTATE codes and timeouts cleanly without leaking raw SQL', () => {
    const uniq = normalizeDatabaseError({
      code: '23505',
      message:
        'duplicate key value violates unique constraint "users_email_key" DETAIL: Key (email)=(secret@x.com) already exists.',
    });
    expect(uniq.statusCode).toBe(409);
    expect(uniq.message).not.toContain('users_email_key');
    expect(uniq.message).not.toContain('secret@x.com');

    const fk = normalizeDatabaseError({ code: '23503', message: 'foreign key violation' });
    expect(fk.statusCode).toBe(400);

    const chk = normalizeDatabaseError({ code: '23514', message: 'check constraint violation' });
    expect(chk.statusCode).toBe(400);

    const timeout = normalizeDatabaseError({ code: '57014', message: 'statement timeout' });
    expect(timeout.statusCode).toBe(504);
  });

  it('rejects hanging database promises via runWithDatabaseTimeout', async () => {
    await expect(
      runWithDatabaseTimeout(
        () => new Promise((resolve) => setTimeout(() => resolve('late'), 250)),
        20
      )
    ).rejects.toMatchObject({ statusCode: 504 });
  });

  it('runs read-only integrity audit and detects anomalies without deleting records', () => {
    const cleanAudit = runDatabaseIntegrityAudit();
    expect(cleanAudit.healthy).toBe(true);
    expect(cleanAudit.anomalyCount).toBe(0);

    const store = getDevStore();
    store.players.push({
      ...store.players[0],
      id: 'bad-player',
      slug: 'bad-player',
      teamId: 'missing-team',
      ovr: 105,
    });
    const dirtyAudit = runDatabaseIntegrityAudit(store);
    expect(dirtyAudit.healthy).toBe(false);
    expect(dirtyAudit.anomalyCount).toBe(2);
    // Must not delete anomalous rows automatically
    expect(store.players.some((p) => p.id === 'bad-player')).toBe(true);
  });

  it('protects /api/health/database diagnostics for staff only and exposes zero secrets', async () => {
    const anonRes = await getDbHealth(new NextRequest('http://localhost:3000/api/health/database'));
    const anonJson = await anonRes.json();
    expect(anonRes.status).toBe(200);
    expect(anonJson.data.mode).toBe('development-memory-fallback');
    expect(anonJson.data.diagnostics).toBeUndefined();

    const regRes = await postRegister(
      new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'DB Ops Admin',
          username: 'db_ops_admin',
          email: 'dbops@rivalry90.dev',
          password: 'Password1',
          confirmPassword: 'Password1',
          acceptTerms: true,
        }),
      })
    );
    const regJson = await regRes.json();
    const cookie = regRes.cookies.get(SERVER_CONFIG.sessionCookieName)?.value;
    const store = getDevStore();
    store.users.find((u) => u.id === regJson.data.user.id).role = 'super_admin';

    const adminRes = await getDbHealth(
      new NextRequest('http://localhost:3000/api/health/database', {
        headers: { Cookie: `${SERVER_CONFIG.sessionCookieName}=${cookie}` },
      })
    );
    const adminJson = await adminRes.json();
    expect(adminRes.status).toBe(200);
    expect(adminJson.data.diagnostics.hasDestructiveMigrations).toBe(false);
    expect(adminJson.data.diagnostics.integrity.healthy).toBe(true);

    const secRes = await getAdminSecurity(
      new NextRequest('http://localhost:3000/api/admin/security', {
        headers: { Cookie: `${SERVER_CONFIG.sessionCookieName}=${cookie}` },
      })
    );
    const secJson = await secRes.json();
    expect(secRes.status).toBe(200);
    expect(secJson.data.databaseHealth.migrationManifestCount).toBeGreaterThanOrEqual(3);
  });
});
