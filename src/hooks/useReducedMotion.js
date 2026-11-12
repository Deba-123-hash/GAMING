'use client';

import useMediaQuery from '@/hooks/useMediaQuery';

export default function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
