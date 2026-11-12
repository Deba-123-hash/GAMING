-- ============================================================================
-- Migration 0001: Initial RIVALRY 90 PostgreSQL Schema
-- Idempotent & Non-Destructive (CREATE IF NOT EXISTS only; zero DROP/TRUNCATE)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 1. Identity & RBAC Domain
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_provider_id UUID UNIQUE,
  email VARCHAR(120) NOT NULL UNIQUE,
  username VARCHAR(24) NOT NULL UNIQUE,
  full_name VARCHAR(80) NOT NULL,
  password_hash TEXT,
  primary_role VARCHAR(32) NOT NULL DEFAULT 'user',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  deletion_requested_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_users_role CHECK (primary_role IN ('super_admin', 'admin', 'content_manager', 'moderator', 'user')),
  CONSTRAINT chk_users_status CHECK (status IN ('active', 'suspended', 'banned')),
  CONSTRAINT chk_users_username_format CHECK (username ~ '^[a-zA-Z0-9_-]{3,24}$')
);

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  display_name VARCHAR(80) NOT NULL,
  bio VARCHAR(400) NOT NULL DEFAULT '',
  avatar_storage_key TEXT,
  avatar_url TEXT,
  country VARCHAR(60) NOT NULL DEFAULT '',
  preferred_language VARCHAR(8) NOT NULL DEFAULT 'en',
  favourite_team_slug VARCHAR(80),
  preferred_position VARCHAR(8) NOT NULL DEFAULT 'ST',
  preferred_formation VARCHAR(12) NOT NULL DEFAULT '4-3-3',
  favourite_game_mode VARCHAR(40) NOT NULL DEFAULT 'quick-match',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT chk_user_profiles_lang CHECK (preferred_language IN ('en', 'es', 'fr', 'de', 'ja'))
);

CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID PRIMARY KEY,
  appearance_theme VARCHAR(16) NOT NULL DEFAULT 'dark',
  product_announcements BOOLEAN NOT NULL DEFAULT FALSE,
  event_alerts BOOLEAN NOT NULL DEFAULT FALSE,
  community_alerts BOOLEAN NOT NULL DEFAULT FALSE,
  security_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_user_settings_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT chk_user_settings_theme CHECK (appearance_theme IN ('dark', 'light', 'system'))
);

CREATE TABLE IF NOT EXISTS public.user_privacy_settings (
  user_id UUID PRIMARY KEY,
  profile_visibility VARCHAR(16) NOT NULL DEFAULT 'public',
  show_bio_public BOOLEAN NOT NULL DEFAULT TRUE,
  show_preferences_public BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_user_privacy_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT chk_user_privacy_visibility CHECK (profile_visibility IN ('public', 'limited', 'private'))
);

CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  token_jti VARCHAR(64) NOT NULL UNIQUE,
  revoked BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_user_sessions_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.roles (
  id VARCHAR(32) PRIMARY KEY,
  label VARCHAR(64) NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.permissions (
  id VARCHAR(64) PRIMARY KEY,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id VARCHAR(32) NOT NULL,
  permission_id VARCHAR(64) NOT NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (role_id, permission_id),
  CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE,
  CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID NOT NULL,
  role_id VARCHAR(32) NOT NULL,
  assigned_by UUID,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE RESTRICT,
  CONSTRAINT fk_ur_assigned_by FOREIGN KEY (assigned_by) REFERENCES public.users(id) ON DELETE SET NULL
);

-- 2. Football Universe Domain
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(80) NOT NULL,
  short_code VARCHAR(4) NOT NULL,
  team_type VARCHAR(24) NOT NULL,
  country VARCHAR(60) NOT NULL,
  city VARCHAR(60) NOT NULL,
  founded_year SMALLINT,
  region VARCHAR(80) NOT NULL DEFAULT '',
  stadium_slug VARCHAR(80),
  primary_color CHAR(7) NOT NULL,
  secondary_color CHAR(7) NOT NULL DEFAULT '#080B09',
  rating SMALLINT NOT NULL,
  preferred_formation VARCHAR(12) NOT NULL DEFAULT '4-3-3',
  style VARCHAR(80) NOT NULL,
  description VARCHAR(600) NOT NULL,
  publication_status VARCHAR(20) NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_teams_type CHECK (team_type IN ('Club', 'National Team', 'Academy')),
  CONSTRAINT chk_teams_rating CHECK (rating BETWEEN 40 AND 99),
  CONSTRAINT chk_teams_pub_status CHECK (publication_status IN ('draft', 'published', 'archived')),
  CONSTRAINT chk_teams_primary_hex CHECK (primary_color ~ '^#[0-9A-Fa-f]{6}$')
);

CREATE TABLE IF NOT EXISTS public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(80) NOT NULL,
  display_name VARCHAR(80) NOT NULL,
  shirt_number SMALLINT NOT NULL,
  position VARCHAR(6) NOT NULL,
  secondary_positions TEXT[] NOT NULL DEFAULT '{}',
  position_group VARCHAR(4) NOT NULL,
  role VARCHAR(60) NOT NULL,
  team_id UUID NOT NULL,
  nationality VARCHAR(60) NOT NULL,
  age SMALLINT NOT NULL DEFAULT 24,
  height VARCHAR(20) NOT NULL DEFAULT '182 cm',
  preferred_foot VARCHAR(8) NOT NULL DEFAULT 'Right',
  card_category VARCHAR(24) NOT NULL DEFAULT 'Standard',
  overall_rating SMALLINT NOT NULL,
  accent_color CHAR(7) NOT NULL DEFAULT '#C6FF3D',
  model_path TEXT,
  bio VARCHAR(600) NOT NULL,
  publication_status VARCHAR(20) NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_players_team FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE RESTRICT,
  CONSTRAINT uq_players_team_number UNIQUE (team_id, shirt_number),
  CONSTRAINT chk_players_number CHECK (shirt_number BETWEEN 1 AND 99),
  CONSTRAINT chk_players_age CHECK (age BETWEEN 16 AND 45),
  CONSTRAINT chk_players_ovr CHECK (overall_rating BETWEEN 1 AND 99),
  CONSTRAINT chk_players_pos CHECK (position IN ('GK', 'CB', 'LB', 'RB', 'LWB', 'RWB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'CF', 'ST')),
  CONSTRAINT chk_players_group CHECK (position_group IN ('GK', 'DEF', 'MID', 'FWD')),
  CONSTRAINT chk_players_foot CHECK (preferred_foot IN ('Right', 'Left', 'Both')),
  CONSTRAINT chk_players_category CHECK (card_category IN ('Standard', 'Rising Star', 'Elite', 'Legendary', 'Special Edition')),
  CONSTRAINT chk_players_pub CHECK (publication_status IN ('draft', 'published', 'archived'))
);

CREATE TABLE IF NOT EXISTS public.player_attributes (
  player_id UUID PRIMARY KEY,
  pace SMALLINT NOT NULL,
  shooting SMALLINT NOT NULL,
  passing SMALLINT NOT NULL,
  dribbling SMALLINT NOT NULL,
  defending SMALLINT NOT NULL,
  physical SMALLINT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_pa_player FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE,
  CONSTRAINT chk_pa_pace CHECK (pace BETWEEN 1 AND 99),
  CONSTRAINT chk_pa_shooting CHECK (shooting BETWEEN 1 AND 99),
  CONSTRAINT chk_pa_passing CHECK (passing BETWEEN 1 AND 99),
  CONSTRAINT chk_pa_dribbling CHECK (dribbling BETWEEN 1 AND 99),
  CONSTRAINT chk_pa_defending CHECK (defending BETWEEN 1 AND 99),
  CONSTRAINT chk_pa_physical CHECK (physical BETWEEN 1 AND 99)
);

CREATE TABLE IF NOT EXISTS public.game_modes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(60) NOT NULL UNIQUE,
  title VARCHAR(80) NOT NULL,
  category VARCHAR(40) NOT NULL,
  tag VARCHAR(40) NOT NULL,
  players_label VARCHAR(60) NOT NULL,
  availability VARCHAR(40) NOT NULL,
  display_order SMALLINT NOT NULL DEFAULT 1,
  summary TEXT NOT NULL,
  highlights TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.formations (
  code VARCHAR(12) PRIMARY KEY,
  label VARCHAR(60) NOT NULL,
  tactical_shape VARCHAR(40) NOT NULL DEFAULT 'Balanced',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.formation_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_code VARCHAR(12) NOT NULL,
  slot_index SMALLINT NOT NULL,
  role_code VARCHAR(6) NOT NULL,
  position_group VARCHAR(4) NOT NULL,
  pitch_x NUMERIC(5,2) NOT NULL,
  pitch_y NUMERIC(5,2) NOT NULL,
  CONSTRAINT fk_fp_formation FOREIGN KEY (formation_code) REFERENCES public.formations(code) ON DELETE CASCADE,
  CONSTRAINT uq_fp_slot UNIQUE (formation_code, slot_index),
  CONSTRAINT chk_fp_slot CHECK (slot_index BETWEEN 0 AND 10),
  CONSTRAINT chk_fp_coords CHECK (pitch_x BETWEEN 0 AND 100 AND pitch_y BETWEEN 0 AND 100)
);

CREATE TABLE IF NOT EXISTS public.squads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name VARCHAR(60) NOT NULL,
  formation_code VARCHAR(12) NOT NULL,
  preferred_team_id UUID,
  mentality VARCHAR(20) NOT NULL DEFAULT 'Balanced',
  pressing VARCHAR(20) NOT NULL DEFAULT 'Balanced',
  overall_rating SMALLINT,
  attack_rating SMALLINT,
  midfield_rating SMALLINT,
  defence_rating SMALLINT,
  compatibility_percent SMALLINT NOT NULL DEFAULT 0,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_squads_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_squads_formation FOREIGN KEY (formation_code) REFERENCES public.formations(code) ON DELETE RESTRICT,
  CONSTRAINT fk_squads_team FOREIGN KEY (preferred_team_id) REFERENCES public.teams(id) ON DELETE SET NULL,
  CONSTRAINT chk_squads_mentality CHECK (mentality IN ('Defensive', 'Balanced', 'Attacking')),
  CONSTRAINT chk_squads_pressing CHECK (pressing IN ('Low Block', 'Balanced', 'High Press'))
);

CREATE TABLE IF NOT EXISTS public.squad_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  squad_id UUID NOT NULL,
  player_id UUID NOT NULL,
  role_type VARCHAR(12) NOT NULL,
  slot_index SMALLINT NOT NULL,
  slot_role VARCHAR(8) NOT NULL,
  is_captain BOOLEAN NOT NULL DEFAULT FALSE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_sp_squad FOREIGN KEY (squad_id) REFERENCES public.squads(id) ON DELETE CASCADE,
  CONSTRAINT fk_sp_player FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE RESTRICT,
  CONSTRAINT uq_squad_unique_player UNIQUE (squad_id, player_id),
  CONSTRAINT uq_squad_slot UNIQUE (squad_id, role_type, slot_index),
  CONSTRAINT chk_sp_role_type CHECK (role_type IN ('starter', 'substitute')),
  CONSTRAINT chk_sp_slot_bounds CHECK (
    (role_type = 'starter' AND slot_index BETWEEN 0 AND 10)
    OR (role_type = 'substitute' AND slot_index BETWEEN 0 AND 6)
  )
);

-- 3. Content & Media Domain
CREATE TABLE IF NOT EXISTS public.content_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(60) NOT NULL,
  slug VARCHAR(80) NOT NULL UNIQUE,
  content_type VARCHAR(16) NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_cat_content_type CHECK (content_type IN ('news', 'events', 'media'))
);

CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(40) NOT NULL UNIQUE,
  slug VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(80) NOT NULL UNIQUE,
  title VARCHAR(120) NOT NULL,
  category_id UUID,
  category_label VARCHAR(60) NOT NULL,
  format VARCHAR(80) NOT NULL,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  registration_deadline TIMESTAMPTZ,
  location VARCHAR(100) NOT NULL,
  is_online BOOLEAN NOT NULL DEFAULT TRUE,
  manual_status VARCHAR(20),
  rules VARCHAR(1000),
  rewards VARCHAR(400),
  eligibility VARCHAR(200),
  description VARCHAR(2000) NOT NULL,
  publication_status VARCHAR(20) NOT NULL DEFAULT 'draft',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_events_category FOREIGN KEY (category_id) REFERENCES public.content_categories(id) ON DELETE SET NULL,
  CONSTRAINT chk_events_date_range CHECK (end_at >= start_at),
  CONSTRAINT chk_events_deadline CHECK (registration_deadline IS NULL OR registration_deadline <= end_at),
  CONSTRAINT chk_events_manual_status CHECK (manual_status IS NULL OR manual_status IN ('Cancelled', 'Postponed')),
  CONSTRAINT chk_events_pub_status CHECK (publication_status IN ('draft', 'review', 'scheduled', 'published', 'archived'))
);

CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL,
  user_id UUID NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'registered',
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_er_event FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE,
  CONSTRAINT fk_er_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT uq_event_user_reg UNIQUE (event_id, user_id),
  CONSTRAINT chk_er_status CHECK (status IN ('registered', 'waitlisted', 'cancelled'))
);

CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(140) NOT NULL,
  author_id UUID,
  author_name VARCHAR(80) NOT NULL,
  category_id UUID,
  category_label VARCHAR(60) NOT NULL,
  excerpt VARCHAR(400) NOT NULL,
  body_paragraphs JSONB NOT NULL DEFAULT '[]'::JSONB,
  seo_title VARCHAR(160),
  seo_description VARCHAR(320),
  publication_status VARCHAR(20) NOT NULL DEFAULT 'draft',
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_articles_author FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL,
  CONSTRAINT fk_articles_category FOREIGN KEY (category_id) REFERENCES public.content_categories(id) ON DELETE SET NULL,
  CONSTRAINT chk_articles_pub_status CHECK (publication_status IN ('draft', 'review', 'scheduled', 'published', 'archived'))
);

CREATE TABLE IF NOT EXISTS public.article_tag_relationships (
  article_id UUID NOT NULL,
  tag_id UUID NOT NULL,
  PRIMARY KEY (article_id, tag_id),
  CONSTRAINT fk_atr_article FOREIGN KEY (article_id) REFERENCES public.articles(id) ON DELETE CASCADE,
  CONSTRAINT fk_atr_tag FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE,
  title VARCHAR(120) NOT NULL,
  category_id UUID,
  category_label VARCHAR(60) NOT NULL,
  media_type VARCHAR(16) NOT NULL,
  storage_provider VARCHAR(32) NOT NULL DEFAULT 'supabase-storage',
  storage_key TEXT,
  public_url TEXT,
  thumbnail_url TEXT,
  file_name VARCHAR(160),
  mime_type VARCHAR(64),
  file_size_bytes BIGINT,
  width_px INTEGER,
  height_px INTEGER,
  duration_seconds INTEGER,
  alt_text VARCHAR(240),
  caption VARCHAR(400),
  summary VARCHAR(400) NOT NULL,
  accent_color CHAR(7) NOT NULL DEFAULT '#C6FF3D',
  publication_status VARCHAR(20) NOT NULL DEFAULT 'draft',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_media_category FOREIGN KEY (category_id) REFERENCES public.content_categories(id) ON DELETE SET NULL,
  CONSTRAINT chk_media_type CHECK (media_type IN ('image', 'video')),
  CONSTRAINT chk_media_pub_status CHECK (publication_status IN ('draft', 'review', 'scheduled', 'published', 'archived')),
  CONSTRAINT chk_media_size CHECK (file_size_bytes IS NULL OR file_size_bytes >= 0)
);

CREATE TABLE IF NOT EXISTS public.media_attributions (
  media_asset_id UUID PRIMARY KEY,
  creator_name VARCHAR(120) NOT NULL,
  source_url TEXT,
  license_type VARCHAR(60) NOT NULL,
  commercial_use_allowed BOOLEAN NOT NULL DEFAULT FALSE,
  attribution_text TEXT NOT NULL DEFAULT '',
  verified_at TIMESTAMPTZ,
  CONSTRAINT fk_ma_asset FOREIGN KEY (media_asset_id) REFERENCES public.media_assets(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.media_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(80) NOT NULL UNIQUE,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.collection_media (
  collection_id UUID NOT NULL,
  media_asset_id UUID NOT NULL,
  display_order SMALLINT NOT NULL DEFAULT 0,
  PRIMARY KEY (collection_id, media_asset_id),
  CONSTRAINT fk_cm_collection FOREIGN KEY (collection_id) REFERENCES public.media_collections(id) ON DELETE CASCADE,
  CONSTRAINT fk_cm_asset FOREIGN KEY (media_asset_id) REFERENCES public.media_assets(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name VARCHAR(80) NOT NULL,
  email VARCHAR(120) NOT NULL,
  category VARCHAR(40) NOT NULL,
  message VARCHAR(2000) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_st_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL
);

-- 4. Admin, Audit & Migration Tracking
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

-- Updated-at triggers
DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_teams_updated_at ON public.teams;
CREATE TRIGGER trg_teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_players_updated_at ON public.players;
CREATE TRIGGER trg_players_updated_at BEFORE UPDATE ON public.players FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_squads_updated_at ON public.squads;
CREATE TRIGGER trg_squads_updated_at BEFORE UPDATE ON public.squads FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_events_updated_at ON public.events;
CREATE TRIGGER trg_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_articles_updated_at ON public.articles;
CREATE TRIGGER trg_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_media_updated_at ON public.media_assets;
CREATE TRIGGER trg_media_updated_at BEFORE UPDATE ON public.media_assets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

