'use client';

import { useSyncExternalStore } from 'react';
import { QUALITY_PRESETS } from '@/lib/constants';
import { detectPerformanceTier } from '@/utils/performance';

let cachedPreset = null;

function subscribe(callback) {
  if (typeof window === 'undefined') return () => {};
  const onResize = () => {
    cachedPreset = detectPerformanceTier();
    callback();
  };
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}

function getSnapshot() {
  if (!cachedPreset) {
    cachedPreset = detectPerformanceTier();
  }
  return cachedPreset;
}

function getServerSnapshot() {
  return QUALITY_PRESETS.medium;
}

export default function useDevicePerformance() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
