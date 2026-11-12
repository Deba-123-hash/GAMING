export const CINEMATIC_SEQUENCES = [
  {
    id: 'intro',
    label: '01 Brand Intro',
    headline: 'THE GAME. THE GLORY. THE RIVALRY.',
    caption: 'Stadium floodlights awaken across a dark atmospheric pitch.',
    cameraPreset: 'aerial',
    lightingPreset: 'night-stadium',
  },
  {
    id: 'stadium-reveal',
    label: '02 Stadium Reveal',
    headline: 'APEX ARENA FLOODLIGHTS',
    caption: 'Descending from the cantilevered roof halo toward the center circle.',
    cameraPreset: 'bowl-sweep',
    lightingPreset: 'matchday',
  },
  {
    id: 'player-entrance',
    label: '03 Tunnel Entrance',
    headline: 'STRIKER WALKOUT',
    caption: 'Fictional athlete stand-in emerging from the stadium tunnel into pitch spotlights.',
    cameraPreset: 'tunnel-exit',
    lightingPreset: 'tunnel-spot',
  },
  {
    id: 'matchday',
    label: '04 Matchday Presentation',
    headline: 'APEX UNITED vs VALKYRIE FC',
    caption: 'Broadcast kickoff framing with instanced supporter seating.',
    cameraPreset: 'broadcast',
    lightingPreset: 'matchday',
  },
  {
    id: 'celebration',
    label: '05 Goal Celebration',
    headline: 'STOPPAGE-TIME DRAMA',
    caption:
      'High-energy stadium celebration stage (using procedural stand-in until GLB clips arrive).',
    cameraPreset: 'pitch-low',
    lightingPreset: 'player-spot',
  },
  {
    id: 'trophy',
    label: '06 Trophy Reveal',
    headline: 'RIVALRY CUP FINALE',
    caption: 'Original RIVALRY 90 championship pedestal beneath dual rim lights.',
    cameraPreset: 'trophy-close',
    lightingPreset: 'trophy-spot',
  },
];

export const CINEMATIC_CAMERA_PRESETS = {
  aerial: { position: [0, 18, 28], target: [0, 0, 0] },
  'bowl-sweep': { position: [14, 9, 18], target: [0, 1, 0] },
  'tunnel-exit': { position: [0, 2.3, 10.5], target: [0, 1.2, 0] },
  broadcast: { position: [0, 11, 21], target: [0, 0.5, 0] },
  'pitch-low': { position: [3.2, 1.8, 5.2], target: [0, 1.1, 0] },
  'trophy-close': { position: [0, 1.8, 4.2], target: [0, 0.85, 0] },
};

export const CINEMATIC_LIGHTING_PRESETS = {
  'night-stadium': { ambient: 0.35, keyIntensity: 1.9, accentColor: '#c6ff3d' },
  matchday: { ambient: 0.5, keyIntensity: 2.3, accentColor: '#c6ff3d' },
  'tunnel-spot': { ambient: 0.25, keyIntensity: 1.7, accentColor: '#ff6b35' },
  'player-spot': { ambient: 0.4, keyIntensity: 2.1, accentColor: '#c6ff3d' },
  'trophy-spot': { ambient: 0.3, keyIntensity: 2.2, accentColor: '#ff6b35' },
};
