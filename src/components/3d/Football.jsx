'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function Football({ position = [0, 0.35, 0], spin = true }) {
  const ballRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useFrame((_, delta) => {
    if (ballRef.current && spin && !reducedMotion) {
      ballRef.current.rotation.y += delta * 0.9;
      ballRef.current.rotation.x += delta * 0.35;
    }
  });

  return (
    <mesh ref={ballRef} position={position} castShadow name="rivalry-football">
      <icosahedronGeometry args={[0.32, 1]} />
      <meshStandardMaterial color="#f5f4ee" roughness={0.35} metalness={0.15} wireframe={false} />
    </mesh>
  );
}
