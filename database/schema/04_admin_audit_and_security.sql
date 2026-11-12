-- ============================================================================
-- RIVALRY 90 — Phase 18 Schema: Administration, Audit, Security & Migrations
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID,
  actor_role VARCHAR(32) NOT NULL,
  action VARCHAR(80) NOT NULL,
  target_type VARCHAR(40) NOT NULL,
  target_id VARCHAR(120),
  outcome VARCHAR(20) NOT NULL DEFAULT 'success',
  request_id UUID,
  safe_metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_audit_actor FOREIGN KEY (actor_user_id) REFERENCES public.users(id) ON DELETE SET NULL,
  CONSTRAINT chk_audit_outcome CHECK (outcome IN ('success', 'denied', 'failed'))
);

CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  event_type VARCHAR(64) NOT NULL,
  severity VARCHAR(16) NOT NULL DEFAULT 'info',
  ip_hash VARCHAR(64),
  details JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_sec_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL,
  CONSTRAINT chk_sec_severity CHECK (severity IN ('info', 'low', 'medium', 'high', 'critical'))
);

CREATE TABLE IF NOT EXISTS public.platform_settings (
  key VARCHAR(40) PRIMARY KEY DEFAULT 'global',
  platform_name VARCHAR(60) NOT NULL DEFAULT 'RIVALRY 90',
  platform_description VARCHAR(240) NOT NULL,
  default_language VARCHAR(8) NOT NULL DEFAULT 'en',
  default_timezone VARCHAR(40) NOT NULL DEFAULT 'UTC',
  default_theme VARCHAR(16) NOT NULL DEFAULT 'dark',
  featured_event_slug VARCHAR(80),
  updated_by UUID,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_ps_updated_by FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL,
  CONSTRAINT chk_ps_lang CHECK (default_language IN ('en', 'es', 'fr', 'de', 'ja')),
  CONSTRAINT chk_ps_theme CHECK (default_theme IN ('dark', 'light'))
);

CREATE TABLE IF NOT EXISTS public.schema_migrations (
  version VARCHAR(64) PRIMARY KEY,
  checksum VARCHAR(64) NOT NULL,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

