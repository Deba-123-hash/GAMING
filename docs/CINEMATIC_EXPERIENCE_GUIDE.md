# Cinematic Experience Guide (Phase 10)

## Architecture (`src/cinematic/`)
- `src/cinematic/config/cinematicConfig.js`: Defines 6 sequences (`intro`, `stadium-reveal`, `player-entrance`, `matchday`, `celebration`, `trophy`), camera presets, and lighting presets.
- `src/cinematic/camera/CinematicCamera.jsx`: Smooth frame-rate-independent `camera.position.lerp` and `lookAt` transitions with `prefers-reduced-motion` bypass.
- `src/cinematic/sequences/CinematicSequences.jsx`: Renders the selected sequence using existing `StadiumModel`, `FootballPitch`, `CrowdSystem`, `PlayerModel`, and `TrophyModel` components.
- `src/cinematic/components/CinematicDirectorStage.jsx`: User-facing theater controls (**Play/Pause**, **Next**, **Replay**, **Skip**, sequence selector).

## Prototype Boundaries & Assets
- Currently renders **procedural Three.js stand-in geometry** for the stadium bowl, athlete mannequin, and trophy until final compressed `.glb` models and Mixamo/Cascadeur clips are imported into `public/models/` and `public/animations/`.
- Audio remains muted/off by default via `audioStore` (`Howler.js` never autoplays).

