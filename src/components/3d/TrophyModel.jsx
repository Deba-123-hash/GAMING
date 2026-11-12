'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function TrophyModel({ position = [0, 0, 0] }) {
  const trophyRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useFrame((_, delta) => {
    if (trophyRef.current && !reducedMotion) {
      trophyRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={trophyRef} position={position} name="rivalry-trophy">
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.55, 0.5, 24]} />
        <meshStandardMaterial color="#12171d" metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.48, 0.18, 1.0, 24]} />
        <meshStandardMaterial color="#b8ff2c" metalness={0.9} roughness={0.18} />
      </mesh>
    </group>
  );
}
