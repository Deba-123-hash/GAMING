'use client';

import { useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function CameraRig({
  enableOrbit = true,
  autoRotate = true,
  autoRotateSpeed = 0.45,
  target = [0, 0.5, 0],
  minDistance = 6,
  maxDistance = 38,
}) {
  const controlsRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  if (!enableOrbit) return null;

  return (
    <OrbitControls
      ref={controlsRef}
      target={target}
      enablePan={false}
      enableZoom={true}
      minDistance={minDistance}
      maxDistance={maxDistance}
      minPolarAngle={0.22}
      maxPolarAngle={Math.PI / 2.15}
      autoRotate={autoRotate && !reducedMotion}
      autoRotateSpeed={autoRotateSpeed}
      enableDamping
      dampingFactor={0.06}
    />
  );
}
