-- ============================================================================
-- Migration 0004: Phase 22 External Integrations Metadata & Mapping Tables
-- Non-destructive extension; strictly separates real-world data from fictional universe
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.external_provider_configs (
  provider_id VARCHAR(48) PRIMARY KEY,
  category VARCHAR(32) NOT NULL,
  display_name VARCHAR(80) NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  last_status VARCHAR(32) NOT NULL DEFAULT 'unverified',
  last_error TEXT,
  last_checked_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.external_resource_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id VARCHAR(48) NOT NULL,
  resource_type VARCHAR(32) NOT NULL,
  external_id VARCHAR(120) NOT NULL,
  display_label VARCHAR(160) NOT NULL,
  payload_snapshot JSONB NOT NULL DEFAULT '{}'::JSONB,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_erm_provider FOREIGN KEY (provider_id) REFERENCES public.external_provider_configs(provider_id) ON DELETE CASCADE,
  CONSTRAINT uq_erm_provider_resource UNIQUE (provider_id, resource_type, external_id)
);

CREATE TABLE IF NOT EXISTS public.ai_usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  provider_id VARCHAR(48) NOT NULL,
  model_name VARCHAR(80) NOT NULL,
  feature_name VARCHAR(48) NOT NULL,
  status VARCHAR(24) NOT NULL,
  latency_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_ai_usage_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL
);

ALTER TABLE public.external_provider_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_resource_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_records ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_ai_usage_created ON public.ai_usage_records (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_erm_synced_at ON public.external_resource_mappings (synced_at DESC);

