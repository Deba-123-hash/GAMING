'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { buildCrowdTransforms } from '@/components/3d/CrowdInstance';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function CrowdSystem({ count = 600, animateWave = true }) {
  const meshRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const seats = useMemo(() => buildCrowdTransforms(count), [count]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    const palette = [
      new THREE.Color('#b8ff2c'),
      new THREE.Color('#ff6b1a'),
      new THREE.Color('#f5f4ee'),
      new THREE.Color('#38bdf8'),
    ];

    seats.forEach((seat, idx) => {
      dummy.position.set(seat.x, seat.y, seat.z);
      dummy.rotation.set(0, seat.rotY, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(idx, dummy.matrix);
      meshRef.current.setColorAt(idx, palette[idx % palette.length]);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [seats, dummy]);

  useFrame(({ clock }) => {
    if (!meshRef.current || !animateWave || reducedMotion) return;
    const t = clock.getElapsedTime();
    for (let i = 0; i < seats.length; i += 1) {
      const seat = seats[i];
      const bounce = Math.max(0, Math.sin(t * 2.2 + seat.phase)) * 0.12;
      dummy.position.set(seat.x, seat.y + bounce, seat.z);
      dummy.rotation.set(0, seat.rotY, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (seats.length === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[null, null, seats.length]} name="instanced-crowd">
      <capsuleGeometry args={[0.14, 0.34, 4, 6]} />
      <meshStandardMaterial roughness={0.7} />
    </instancedMesh>
  );
}
