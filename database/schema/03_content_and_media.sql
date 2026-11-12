-- ============================================================================
-- RIVALRY 90 — Phase 18 Schema: Events, News, Media & Support Domain
-- ============================================================================

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

