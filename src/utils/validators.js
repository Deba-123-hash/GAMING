import { z } from 'zod';

export const supportTicketSchema = z.object({
  name: z.string().trim().min(2, 'Please enter at least 2 characters.').max(80),
  email: z.string().trim().email('Please provide a valid email address.').max(120),
  category: z.enum(['general', '3d-performance', 'account-future', 'bug-report']),
  message: z
    .string()
    .trim()
    .min(12, 'Please describe your issue in at least 12 characters.')
    .max(2000),
});

export const squadPayloadSchema = z.object({
  name: z.string().trim().min(2, 'Squad name must be at least 2 characters.').max(60),
  formation: z.enum(['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '5-3-2']),
  slots: z
    .array(
      z.object({
        slotIndex: z.number().int().min(0).max(10),
        role: z.string().min(1).max(8),
        playerId: z.string().min(1).nullable(),
      })
    )
    .length(11, 'Squad must include exactly 11 formation slots.'),
});

export const playerQuerySchema = z.object({
  position: z.string().trim().max(10).optional(),
  search: z.string().trim().max(80).optional(),
  sort: z.enum(['ovr-desc', 'ovr-asc', 'name-asc', 'name-desc']).optional(),
});

export function isValidExternalUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}
