import { z } from 'zod';
import { SUPPORTED_FORMATION_CODES } from '@/lib/formations';

const safeSlug = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9-]+$/, 'Slug must contain lowercase letters, numbers, and hyphens only.');

const safeUrlOrNull = z
  .string()
  .trim()
  .max(300)
  .refine(
    (val) => val.startsWith('/') || val.startsWith('https://') || val.startsWith('http://'),
    'URL must be a relative path or http/https URL.'
  )
  .nullable()
  .optional();

// Phase 13 — Profile
export const profileUpdateSchema = z.object({
  displayName: z.string().trim().min(2).max(80).optional(),
  username: z
    .string()
    .trim()
    .min(3)
    .max(24)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .optional(),
  bio: z.string().trim().max(400).optional(),
  country: z.string().trim().max(60).optional(),
  preferredLanguage: z.enum(['en', 'es', 'fr', 'de', 'ja']).optional(),
  favouriteTeamId: z.string().trim().max(60).optional(),
  preferredPosition: z.string().trim().max(8).optional(),
  preferredFormation: z.enum(SUPPORTED_FORMATION_CODES).optional(),
  favouriteGameMode: z.string().trim().max(40).optional(),
});

export const preferencesUpdateSchema = z.object({
  appearanceTheme: z.enum(['dark', 'light', 'system']).optional(),
  profileVisibility: z.enum(['public', 'limited', 'private']).optional(),
  showBioPublic: z.boolean().optional(),
  showPreferencesPublic: z.boolean().optional(),
  notificationPreferences: z
    .object({
      productAnnouncements: z.boolean().optional(),
      eventAlerts: z.boolean().optional(),
      communityAlerts: z.boolean().optional(),
      securityAlerts: z.boolean().optional(),
    })
    .optional(),
});

// Phase 14 — Players & Teams
export const playerMutationSchema = z.object({
  name: z.string().trim().min(2).max(80),
  number: z.number().int().min(1).max(99),
  position: z.enum([
    'GK',
    'CB',
    'LB',
    'RB',
    'LWB',
    'RWB',
    'CDM',
    'CM',
    'CAM',
    'LM',
    'RM',
    'LW',
    'RW',
    'CF',
    'ST',
  ]),
  secondaryPositions: z.array(z.string().max(6)).max(4).optional(),
  role: z.string().trim().min(2).max(60),
  teamId: z.string().trim().min(2).max(80),
  nationality: z.string().trim().min(2).max(60),
  age: z.number().int().min(16).max(45).optional(),
  height: z.string().trim().max(20).optional(),
  preferredFoot: z.enum(['Right', 'Left', 'Both']).optional(),
  cardCategory: z
    .enum(['Standard', 'Rising Star', 'Elite', 'Legendary', 'Special Edition'])
    .optional(),
  bio: z.string().trim().min(8).max(600),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  stats: z.object({
    pace: z.number().int().min(1).max(99),
    shooting: z.number().int().min(1).max(99),
    passing: z.number().int().min(1).max(99),
    dribbling: z.number().int().min(1).max(99),
    defending: z.number().int().min(1).max(99),
    physical: z.number().int().min(1).max(99),
  }),
});

export const teamMutationSchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: safeSlug.optional(),
  shortCode: z.string().trim().min(2).max(4).toUpperCase(),
  type: z.enum(['Club', 'National Team', 'Academy']),
  country: z.string().trim().min(2).max(60),
  city: z.string().trim().min(2).max(60),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  rating: z.number().int().min(40).max(99),
  preferredFormation: z.enum(SUPPORTED_FORMATION_CODES).optional(),
  style: z.string().trim().min(2).max(80),
  description: z.string().trim().min(8).max(600),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

// Phase 15 — Squads
const squadSlotInput = z.object({
  slotIndex: z.number().int().min(0).max(10),
  role: z.string().min(1).max(8),
  playerId: z.string().min(1).nullable(),
});

export const squadCreateSchema = z.object({
  name: z.string().trim().min(2).max(60),
  formation: z.enum(SUPPORTED_FORMATION_CODES),
  preferredTeamId: z.string().trim().max(80).optional(),
  slots: z.array(squadSlotInput).length(11),
  substitutes: z.array(z.string().min(1)).max(7).optional(),
  captainPlayerId: z.string().min(1).nullable().optional(),
  tactics: z
    .object({
      mentality: z.enum(['Defensive', 'Balanced', 'Attacking']).optional(),
      pressing: z.enum(['Low Block', 'Balanced', 'High Press']).optional(),
    })
    .optional(),
});

export const squadUpdateSchema = squadCreateSchema.partial();

// Phase 16 — Events, News, Media, Categories
export const eventMutationSchema = z
  .object({
    title: z.string().trim().min(3).max(120),
    slug: safeSlug.optional(),
    category: z.string().trim().min(2).max(60),
    format: z.string().trim().min(2).max(80),
    startAt: z.string().datetime(),
    endAt: z.string().datetime(),
    registrationDeadline: z.string().datetime().optional(),
    location: z.string().trim().min(2).max(100),
    rules: z.string().trim().max(1000).optional(),
    rewards: z.string().trim().max(400).optional(),
    eligibility: z.string().trim().max(200).optional(),
    description: z.string().trim().min(10).max(2000),
    publicationStatus: z.enum(['draft', 'review', 'scheduled', 'published', 'archived']).optional(),
    isFeatured: z.boolean().optional(),
  })
  .refine((d) => new Date(d.endAt) >= new Date(d.startAt), {
    path: ['endAt'],
    message: 'Event end date cannot precede start date.',
  });

export const newsMutationSchema = z.object({
  title: z.string().trim().min(4).max(140),
  slug: safeSlug.optional(),
  category: z.string().trim().min(2).max(60),
  excerpt: z.string().trim().min(10).max(400),
  body: z.array(z.string().trim().min(1)).min(1),
  tags: z.array(z.string().trim().max(30)).max(8).optional(),
  publicationStatus: z.enum(['draft', 'review', 'scheduled', 'published', 'archived']).optional(),
  isFeatured: z.boolean().optional(),
});

export const mediaMutationSchema = z.object({
  title: z.string().trim().min(3).max(120),
  category: z.string().trim().min(2).max(60),
  mediaType: z.enum(['image', 'video']),
  summary: z.string().trim().min(6).max(400),
  assetUrl: safeUrlOrNull,
  publicationStatus: z.enum(['draft', 'review', 'scheduled', 'published', 'archived']).optional(),
  isFeatured: z.boolean().optional(),
});

export const categoryMutationSchema = z.object({
  name: z.string().trim().min(2).max(60),
  slug: safeSlug.optional(),
  contentType: z.enum(['news', 'events', 'media']),
  enabled: z.boolean().optional(),
});

// Phase 17 — Admin
export const adminUserUpdateSchema = z.object({
  displayName: z.string().trim().min(2).max(80).optional(),
  role: z.enum(['super_admin', 'admin', 'content_manager', 'moderator', 'user']).optional(),
});

export const adminSettingsUpdateSchema = z.object({
  platformName: z.string().trim().min(2).max(60).optional(),
  platformDescription: z.string().trim().min(4).max(240).optional(),
  defaultLanguage: z.enum(['en', 'es', 'fr', 'de', 'ja']).optional(),
  defaultTheme: z.enum(['dark', 'light']).optional(),
});
