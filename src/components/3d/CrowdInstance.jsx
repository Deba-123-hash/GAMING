'use client';

/**
 * Helper utility returning deterministic seat coordinates around the stadium bowl
 * for consumption by CrowdSystem's THREE.InstancedMesh.
 */
export function buildCrowdTransforms(count = 600) {
  const transforms = [];
  const rows = 4;
  const perRow = Math.max(1, Math.floor(count / rows));

  for (let r = 0; r < rows; r += 1) {
    const radiusX = 16.5 + r * 1.45;
    const radiusZ = 11.2 + r * 1.25;
    const heightY = 1.6 + r * 0.9;

    for (let i = 0; i < perRow; i += 1) {
      const angle = (i / perRow) * Math.PI * 2;
      transforms.push({
        x: Math.cos(angle) * radiusX,
        y: heightY,
        z: Math.sin(angle) * radiusZ,
        rotY: -angle,
        phase: (i + r * 7) * 0.35,
      });
    }
  }

  return transforms;
}

export default function CrowdInstance() {
  return null;
}
