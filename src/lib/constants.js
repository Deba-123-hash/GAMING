import { FORMATIONS_CONFIG } from '@/lib/formations';

export const BRAND = {
  name: 'RIVALRY 90',
  tagline: 'Next-Generation 3D Football Universe',
  version: '0.1.0-foundation',
};

export const PLAYER_ANIMATION_STATES = [
  { id: 'idle', label: 'Idle Stance', clipName: 'Idle' },
  { id: 'walking', label: 'Tunnel Walk', clipName: 'Walk' },
  { id: 'running', label: 'Sprint Run', clipName: 'Run' },
  { id: 'dribbling', label: 'Close Dribble', clipName: 'Dribble' },
  { id: 'shooting', label: 'Power Strike', clipName: 'Shoot' },
  { id: 'celebration', label: 'Goal Celebration', clipName: 'Celebrate' },
];

export const FORMATIONS = Object.fromEntries(
  Object.entries(FORMATIONS_CONFIG).map(([key, item]) => [
    key,
    {
      label: item.label,
      slots: item.slots.map((s) => s.role),
    },
  ])
);

export const QUALITY_PRESETS = {
  high: {
    tier: 'high',
    dpr: [1, 2],
    shadows: true,
    crowdCount: 1800,
    enablePostprocessing: true,
    enableParticles: true,
  },
  medium: {
    tier: 'medium',
    dpr: [1, 1.5],
    shadows: true,
    crowdCount: 800,
    enablePostprocessing: false,
    enableParticles: true,
  },
  low: {
    tier: 'low',
    dpr: [1, 1],
    shadows: false,
    crowdCount: 300,
    enablePostprocessing: false,
    enableParticles: false,
  },
};
