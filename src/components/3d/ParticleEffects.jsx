'use client';

import { Sparkles } from '@react-three/drei';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function ParticleEffects({ enabled = true, count = 48 }) {
  const reducedMotion = useReducedMotion();
  if (!enabled || reducedMotion) return null;

  return (
    <Sparkles
      count={count}
      scale={[24, 9, 16]}
      position={[0, 4.5, 0]}
      size={1.8}
      speed={0.35}
      opacity={0.45}
      color="#b8ff2c"
    />
  );
}
