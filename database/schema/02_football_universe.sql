-- ============================================================================
-- RIVALRY 90 — Phase 18 Schema: Players, Teams, Game Modes, Formations & Squads
-- ============================================================================

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

