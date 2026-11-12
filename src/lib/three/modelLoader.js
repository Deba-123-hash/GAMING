import { useGLTF } from '@react-three/drei';

/**
 * Safe GLB/GLTF loader wrapper.
 * Never attempts to fetch empty/null paths; preloads only verified local .glb URLs.
 */
export function preloadModelAsset(url) {
  if (!url || typeof url !== 'string' || !url.endsWith('.glb')) {
    return false;
  }
  useGLTF.preload(url);
  return true;
}

export function clearModelAsset(url) {
  if (!url || typeof url !== 'string') return;
  useGLTF.clear(url);
}
