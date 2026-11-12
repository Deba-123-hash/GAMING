import { PLAYERS } from '@/data/players';
import { TEAMS } from '@/data/teams';
import { GAME_MODES } from '@/data/gameModes';
import { EVENTS } from '@/data/events';
import { NEWS_ARTICLES } from '@/data/news';
import { MEDIA_ITEMS } from '@/data/mediaData';
import { CONTENT_CATEGORIES } from '@/data/categories';
import { FORMATIONS_CONFIG } from '@/lib/formations';
import { PERMISSIONS, ROLE_DEFINITIONS } from '@/server/auth/rbac';

/**
 * Builds deterministic, production-safe seed payloads from canonical codebase fixtures.
 * Never embeds hardcoded demo user passwords or private credentials.
 */
export function buildDeterministicSeedPayload() {
  const roles = Object.values(ROLE_DEFINITIONS).map((r) => ({
    id: r.id,
    label: r.label,
    permissions: [...r.permissions],
  }));

  const permissions = Object.entries(PERMISSIONS).map(([id, description]) => ({
    id,
    description,
  }));

  const formations = Object.values(FORMATIONS_CONFIG).map((f) => ({
    code: f.code,
    label: f.label,
    slots: f.slots.map((s) => ({
      slot_index: s.slotIndex,
      role_code: s.role,
      position_group: s.group,
      pitch_x: s.x,
      pitch_y: s.y,
    })),
  }));

  return {
    roles,
    permissions,
    formations,
    formationPositionsCount: formations.reduce((sum, f) => sum + f.slots.length, 0),
    gameModes: GAME_MODES.map((m) => ({
      slug: m.slug,
      title: m.title,
      category: m.category,
      tag: m.tag,
      players_label: m.players,
      availability: m.availability,
      display_order: m.displayOrder,
      summary: m.summary,
      highlights: m.highlights,
    })),
    teams: TEAMS.map((t) => ({
      slug: t.slug,
      name: t.name,
      short_code: t.shortCode,
      team_type: t.type,
      country: t.country,
      city: t.city,
      founded_year: t.foundedYear || null,
      region: t.region || '',
      stadium_slug: t.stadiumId || null,
      primary_color: t.primaryColor,
      secondary_color: t.secondaryColor || '#080B09',
      rating: t.rating,
      preferred_formation: t.preferredFormation || '4-3-3',
      style: t.style,
      description: t.description,
      publication_status: t.status || 'published',
    })),
    players: PLAYERS.map((p) => ({
      slug: p.slug,
      name: p.name,
      display_name: p.displayName,
      shirt_number: p.number,
      position: p.position,
      secondary_positions: p.secondaryPositions || [],
      position_group: p.positionGroup,
      role: p.role,
      team_slug: p.teamId,
      nationality: p.nationality,
      age: p.age,
      height: p.height,
      preferred_foot: p.preferredFoot,
      card_category: p.cardCategory,
      overall_rating: p.ovr,
      accent_color: p.accentColor,
      bio: p.bio,
      publication_status: p.status || 'published',
      stats: p.stats,
    })),
    categories: CONTENT_CATEGORIES,
    events: EVENTS,
    news: NEWS_ARTICLES,
    media: MEDIA_ITEMS,
  };
}

