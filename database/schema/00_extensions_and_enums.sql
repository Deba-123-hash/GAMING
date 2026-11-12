-- ============================================================================
-- RIVALRY 90 — Phase 18 Schema: Extensions & Shared Domains / Functions
-- Target Engine: PostgreSQL 15+ (Supabase Compatible)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Automatic updated_at trigger helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

