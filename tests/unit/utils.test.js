import { describe, expect, it } from 'vitest';
import { formatRating, slugify } from '@/utils/formatters';
import { isValidExternalUrl, supportTicketSchema } from '@/utils/validators';
import { cn } from '@/lib/utils';

describe('Utility functions', () => {
  it('formats player ratings within 00-99 bounds', () => {
    expect(formatRating(91)).toBe('91');
    expect(formatRating(120)).toBe('99');
    expect(formatRating(5)).toBe('05');
  });

  it('slugifies titles deterministically', () => {
    expect(slugify('RIVALRY 90 Stadium Showcase!')).toBe('rivalry-90-stadium-showcase');
  });

  it('merges Tailwind classes cleanly', () => {
    expect(cn('px-2 py-2', 'px-4')).toBe('py-2 px-4');
  });

  it('validates external URLs safely', () => {
    expect(isValidExternalUrl('https://www.blender.org/')).toBe(true);
    expect(isValidExternalUrl('javascript:alert(1)')).toBe(false);
    expect(isValidExternalUrl('')).toBe(false);
  });

  it('validates support form payload with Zod', () => {
    const valid = supportTicketSchema.safeParse({
      name: 'Alex Rivera',
      email: 'alex@rivalry90.dev',
      category: '3d-performance',
      message: 'Testing WebGL stadium camera zoom on tablet viewport.',
    });
    expect(valid.success).toBe(true);

    const invalid = supportTicketSchema.safeParse({
      name: 'A',
      email: 'bad-email',
      category: 'general',
      message: 'short',
    });
    expect(invalid.success).toBe(false);
  });
});
