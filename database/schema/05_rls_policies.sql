-- ============================================================================
-- RIVALRY 90 — Phase 18/20 Schema: Supabase Row-Level Security (RLS) Policies
-- Design: Strict least privilege. Sensitive tables deny anonymous/client access.
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_modes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formation_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squad_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tag_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_attributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Note: Server-side Route Handlers using SUPABASE_SERVICE_ROLE_KEY bypass RLS safely
-- while enforcing application RBAC (`src/server/auth/rbac.js`). Client anon keys receive
-- ONLY explicitly published public catalogs and self-owned records.

CREATE POLICY "Public published teams read" ON public.teams
  FOR SELECT USING (publication_status = 'published');

CREATE POLICY "Public published players read" ON public.players
  FOR SELECT USING (publication_status = 'published');

CREATE POLICY "Public published player attributes read" ON public.player_attributes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.players p
      WHERE p.id = player_attributes.player_id AND p.publication_status = 'published'
    )
  );

CREATE POLICY "Public game modes and formations read" ON public.game_modes FOR SELECT USING (TRUE);
CREATE POLICY "Public formations read" ON public.formations FOR SELECT USING (TRUE);
CREATE POLICY "Public formation positions read" ON public.formation_positions FOR SELECT USING (TRUE);
CREATE POLICY "Public published events read" ON public.events FOR SELECT USING (publication_status = 'published');
CREATE POLICY "Public published articles read" ON public.articles FOR SELECT USING (publication_status = 'published');
CREATE POLICY "Public published media read" ON public.media_assets FOR SELECT USING (publication_status = 'published');

CREATE POLICY "Owner manage own profile" ON public.user_profiles
  FOR ALL USING (user_id IN (SELECT id FROM public.users WHERE auth_provider_id = auth.uid()));

CREATE POLICY "Owner manage own settings" ON public.user_settings
  FOR ALL USING (user_id IN (SELECT id FROM public.users WHERE auth_provider_id = auth.uid()));

CREATE POLICY "Owner manage own privacy" ON public.user_privacy_settings
  FOR ALL USING (user_id IN (SELECT id FROM public.users WHERE auth_provider_id = auth.uid()));

CREATE POLICY "Owner manage own squads" ON public.squads
  FOR ALL USING (user_id IN (SELECT id FROM public.users WHERE auth_provider_id = auth.uid()));

CREATE POLICY "Owner manage own squad players" ON public.squad_players
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.squads s
      JOIN public.users u ON u.id = s.user_id
      WHERE s.id = squad_players.squad_id AND u.auth_provider_id = auth.uid()
    )
  );

CREATE POLICY "Owner manage own event registrations" ON public.event_registrations
  FOR ALL USING (user_id IN (SELECT id FROM public.users WHERE auth_provider_id = auth.uid()));

