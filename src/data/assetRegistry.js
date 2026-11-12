/**
 * Central 3D & Media Asset Registry for RIVALRY 90.
 * Do NOT register files that do not exist on disk yet.
 * Placeholder records are explicitly flagged with status: 'procedural-fallback'.
 */
export const ASSET_REGISTRY = [
  {
    id: 'procedural-stadium-bowl',
    name: 'Procedural Stadium & Pitch Scaffold',
    filePath: 'src/components/3d/StadiumScene.jsx',
    category: 'stadium',
    format: 'R3F Procedural',
    fileSize: '0 KB (code)',
    source: 'Internal RIVALRY 90',
    creator: 'RIVALRY 90 Engineering',
    license: 'Proprietary / Project Internal',
    commercialUse: true,
    modificationAllowed: true,
    attributionRequired: false,
    addedDate: '2026-11-12',
    validationStatus: 'verified-procedural',
    optimizationStatus: 'instanced-ready',
    isPlaceholder: true,
  },
  {
    id: 'procedural-athlete-rig',
    name: 'Procedural Athlete Stand-In Rig',
    filePath: 'src/components/3d/PlayerModel.jsx',
    category: 'players',
    format: 'R3F Procedural',
    fileSize: '0 KB (code)',
    source: 'Internal RIVALRY 90',
    creator: 'RIVALRY 90 Engineering',
    license: 'Proprietary / Project Internal',
    commercialUse: true,
    modificationAllowed: true,
    attributionRequired: false,
    addedDate: '2026-11-12',
    validationStatus: 'verified-procedural',
    optimizationStatus: 'awaiting-glb',
    isPlaceholder: true,
  },
];
