'use client';

import { useCallback } from 'react';
import { playSound, registerSound } from '@/lib/audio';
import { useAudioStore } from '@/store/audioStore';

export default function useAudio() {
  const isEnabled = useAudioStore((state) => state.isEnabled);
  const isMuted = useAudioStore((state) => state.isMuted);
  const toggleAudio = useAudioStore((state) => state.toggleAudio);

  const triggerSound = useCallback(
    (key, src, options) => {
      if (!isEnabled) return;
      if (src) {
        registerSound(key, src, options);
      }
      playSound(key, isEnabled);
    },
    [isEnabled]
  );

  return {
    isEnabled,
    isMuted,
    toggleAudio,
    triggerSound,
  };
}
