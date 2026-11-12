import { create } from 'zustand';

export const PLAYER_CAMERA_PRESETS = {
  'full-body': { label: 'Full Body', position: [0, 1.5, 4.8], target: [0, 1.0, 0] },
  'close-up': { label: 'Close-Up', position: [0, 1.85, 2.2], target: [0, 1.72, 0] },
  kit: { label: 'Kit View', position: [1.4, 1.35, 2.6], target: [0, 1.15, 0] },
  boots: { label: 'Boots View', position: [1.1, 0.45, 2.1], target: [0, 0.3, 0] },
};

export const useThreeDStore = create((set) => ({
  cameraPreset: 'full-body',
  isPlaying: true,
  rotationOffset: 0,
  setCameraPreset: (cameraPreset) => set({ cameraPreset }),
  togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),
  rotateBy: (delta) => set((state) => ({ rotationOffset: state.rotationOffset + delta })),
  resetViewer: () => set({ cameraPreset: 'full-body', isPlaying: true, rotationOffset: 0 }),
}));
