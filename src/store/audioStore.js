import { create } from 'zustand';
import { setGlobalMute, stopAllSounds } from '@/lib/audio';

export const useAudioStore = create((set) => ({
  isEnabled: false,
  isMuted: true,
  volume: 0.5,
  enableAudio: () => {
    setGlobalMute(false);
    set({ isEnabled: true, isMuted: false });
  },
  disableAudio: () => {
    setGlobalMute(true);
    stopAllSounds();
    set({ isEnabled: false, isMuted: true });
  },
  toggleAudio: () =>
    set((state) => {
      const nextEnabled = !state.isEnabled;
      setGlobalMute(!nextEnabled);
      if (!nextEnabled) {
        stopAllSounds();
      }
      return { isEnabled: nextEnabled, isMuted: !nextEnabled };
    }),
  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
}));
