import { QUALITY_PRESETS } from '@/lib/constants';

export function detectPerformanceTier() {
  if (typeof window === 'undefined') {
    return QUALITY_PRESETS.medium;
  }

  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  if (prefersReduced) {
    return QUALITY_PRESETS.low;
  }

  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  const isSmallScreen = window.innerWidth < 768;

  if (isSmallScreen || cores <= 2 || memory <= 2) {
    return QUALITY_PRESETS.low;
  }
  if (cores >= 8 && memory >= 8 && window.innerWidth >= 1024) {
    return QUALITY_PRESETS.high;
  }
  return QUALITY_PRESETS.medium;
}
