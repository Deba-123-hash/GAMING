'use client';

/**
 * Environment wrapper for sky/atmosphere.
 * Uses lightweight procedural background + fog during Phase 1 so no external
 * HDRI network fetch is required before local HDRIs are placed in public/environments/hdri/.
 */
export default function Environment({ backgroundColor = '#090d10' }) {
  return (
    <>
      <color attach="background" args={[backgroundColor]} />
      <fog attach="fog" args={[backgroundColor, 20, 75]} />
    </>
  );
}
