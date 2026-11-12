-- ============================================================================
-- RIVALRY 90 — Phase 18 Schema: Identity, Profile, Preferences & RBAC Domain
-- ============================================================================

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

