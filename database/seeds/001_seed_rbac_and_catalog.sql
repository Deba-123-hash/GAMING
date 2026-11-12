-- ============================================================================
-- Deterministic Seed 001: RBAC Roles, Permissions & Global Platform Settings
-- Idempotent (ON CONFLICT DO NOTHING) — safe across repeated executions
-- ============================================================================

INSERT INTO public.roles (id, label, description) VALUES
  ('super_admin', 'Super Admin', 'Unrestricted platform & security governance role'),
  ('admin', 'Admin', 'Operations, catalog, and user management role'),
  ('content_manager', 'Content Manager', 'Events, news, media, and taxonomy curator'),
  ('moderator', 'Moderator', 'Account moderation and read-only user inspection'),
  ('user', 'User', 'Standard RIVALRY 90 community member')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.permissions (id, description) VALUES
  ('users.read', 'View user accounts and statuses'),
  ('users.update', 'Edit user profile fields and roles'),
  ('users.suspend', 'Suspend or reactivate user accounts'),
  ('users.ban', 'Ban user accounts permanently'),
  ('roles.read', 'View role definitions and permission matrix'),
  ('roles.manage', 'Modify custom role permissions'),
  ('players.read', 'View all players including drafts'),
  ('players.create', 'Create master player records'),
  ('players.update', 'Update master player records'),
  ('players.delete', 'Delete master player records'),
  ('teams.manage', 'Create, update, and delete master team records'),
  ('events.manage', 'Create, edit, publish, and delete events'),
  ('news.manage', 'Create, edit, publish, and delete news articles'),
  ('media.manage', 'Create, edit, publish, and delete media items'),
  ('categories.manage', 'Manage content categories'),
  ('analytics.read', 'View platform overview analytics'),
  ('audit.read', 'View immutable administrative audit logs'),
  ('security.manage', 'Manage platform security & session revocations'),
  ('settings.manage', 'Update general and content platform settings')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.platform_settings (
  key, platform_name, platform_description, default_language, default_timezone, default_theme, featured_event_slug
) VALUES (
  'global',
  'RIVALRY 90',
  'Next-Generation 3D Football Gaming Universe',
  'en',
  'UTC',
  'dark',
  'rivalry-cup'
)
ON CONFLICT (key) DO NOTHING;

