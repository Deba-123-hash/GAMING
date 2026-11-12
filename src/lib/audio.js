import { Howl, Howler } from 'howler';

const soundRegistry = new Map();

/**
 * Reusable Howler.js audio manager.
 * Audio never autoplays; callers must check audioStore.isEnabled before playing.
 */
export function registerSound(key, src, options = {}) {
  if (typeof window === 'undefined' || !src) return null;
  if (soundRegistry.has(key)) return soundRegistry.get(key);

  const howl = new Howl({
    src: Array.isArray(src) ? src : [src],
    volume: options.volume ?? 0.5,
    loop: options.loop ?? false,
    preload: options.preload ?? false,
  });

  soundRegistry.set(key, howl);
  return howl;
}

export function playSound(key, isEnabled = false) {
  if (!isEnabled || typeof window === 'undefined') return;
  const howl = soundRegistry.get(key);
  if (howl) {
    howl.play();
  }
}

export function stopAllSounds() {
  if (typeof window === 'undefined') return;
  Howler.stop();
}

export function setGlobalMute(muted) {
  if (typeof window === 'undefined') return;
  Howler.mute(Boolean(muted));
}
