-- ============================================================================
-- RIVALRY 90 — Phase 18 Schema: Targeted Indexes, Partial Uniques & GIN FTS
-- ============================================================================

-- Users & Sessions
CREATE INDEX IF NOT EXISTS idx_users_role_status ON public.users (primary_role, status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_active ON public.user_sessions (user_id) WHERE revoked = FALSE;

-- Players & Teams (Filter, Sort, Roster & Full-Text Search)
CREATE INDEX IF NOT EXISTS idx_players_pub_ovr ON public.players (publication_status, overall_rating DESC);
CREATE INDEX IF NOT EXISTS idx_players_team_id ON public.players (team_id);
CREATE INDEX IF NOT EXISTS idx_players_position_group ON public.players (position_group, overall_rating DESC);
CREATE INDEX IF NOT EXISTS idx_players_fts ON public.players USING GIN (
  to_tsvector('english', coalesce(name, '') || ' ' || coalesce(role, '') || ' ' || coalesce(nationality, ''))
);

CREATE INDEX IF NOT EXISTS idx_teams_pub_type_rating ON public.teams (publication_status, team_type, rating DESC);

-- Squads & Strict Single-Captain Partial Unique Index
CREATE INDEX IF NOT EXISTS idx_squads_user_updated ON public.squads (user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_squads_formation ON public.squads (formation_code);
CREATE INDEX IF NOT EXISTS idx_squad_players_squad ON public.squad_players (squad_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_squad_single_captain ON public.squad_players (squad_id) WHERE is_captain = TRUE;

-- Events, News, Media
CREATE INDEX IF NOT EXISTS idx_events_pub_start ON public.events (publication_status, start_at ASC);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events (category_label);
CREATE INDEX IF NOT EXISTS idx_event_regs_user ON public.event_registrations (user_id);

CREATE INDEX IF NOT EXISTS idx_articles_pub_published_at ON public.articles (publication_status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles (category_label);
CREATE INDEX IF NOT EXISTS idx_articles_author ON public.articles (author_id);
CREATE INDEX IF NOT EXISTS idx_articles_fts ON public.articles USING GIN (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, ''))
);

CREATE INDEX IF NOT EXISTS idx_media_pub_type_cat ON public.media_assets (publication_status, media_type, category_label);
CREATE INDEX IF NOT EXISTS idx_media_featured ON public.media_assets (is_featured) WHERE publication_status = 'published';

-- Immutable Audit Logs & Security Events
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_role ON public.audit_logs (action, actor_role);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs (actor_user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_created_severity ON public.security_events (created_at DESC, severity);

