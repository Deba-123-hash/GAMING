import * as THREE from 'three';

/**
 * Shared Three.js configuration helpers to prevent duplicate renderer constants
 * and simplify resource disposal across R3F scenes.
 */
export const DEFAULT_CAMERA_CONFIG = {
  position: [0, 9, 20],
  fov: 45,
  near: 0.1,
  far: 300,
};

export const RENDERER_GL_CONFIG = {
  antialias: true,
  powerPreference: 'high-performance',
  toneMapping: THREE.ACESFilmicToneMapping,
  toneMappingExposure: 1.05,
};

export function disposeObject3D(root) {
  if (!root) return;
  root.traverse((child) => {
    if (child.geometry) {
      child.geometry.dispose();
    }
    if (child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      for (const mat of materials) {
        if (mat && typeof mat.dispose === 'function') {
          mat.dispose();
        }
      }
    }
  });
}
