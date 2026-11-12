export function detectWebGLSupport() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { supported: true, version: 'ssr-deferred' };
  }

  try {
    const canvas = document.createElement('canvas');
    const gl2 = canvas.getContext('webgl2');
    if (gl2) {
      return { supported: true, version: 'webgl2' };
    }
    const gl1 = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl1) {
      return { supported: true, version: 'webgl1' };
    }
    return { supported: false, version: 'none' };
  } catch {
    return { supported: false, version: 'error' };
  }
}

export function isTouchDevice() {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
