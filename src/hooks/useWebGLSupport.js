'use client';

import { useSyncExternalStore } from 'react';
import { detectWebGLSupport } from '@/utils/deviceDetection';

const SERVER_SNAPSHOT = { supported: true, version: 'ssr-deferred' };
let cachedClientSnapshot = null;

function subscribe() {
  return () => {};
}

function getSnapshot() {
  if (!cachedClientSnapshot) {
    cachedClientSnapshot = detectWebGLSupport();
  }
  return cachedClientSnapshot;
}

function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export default function useWebGLSupport() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
