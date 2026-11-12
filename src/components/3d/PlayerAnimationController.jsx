'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import useReducedMotion from '@/hooks/useReducedMotion';

function GltfClipDriver({ animations, activeAnimation, children }) {
  const groupRef = useRef(null);
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;
    const clip = actions[activeAnimation] || Object.values(actions)[0];
    if (clip) {
      Object.values(actions).forEach((action) => action?.fadeOut?.(0.2));
      clip.reset().fadeIn(0.25).play();
    }
  }, [actions, activeAnimation]);

  return <group ref={groupRef}>{children}</group>;
}

function ProceduralClipDriver({ activeAnimation, children }) {
  const groupRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useFrame(({ clock }) => {
    const node = groupRef.current;
    if (!node) return;

    if (reducedMotion) {
      node.position.y = 0;
      node.rotation.z = 0;
      return;
    }

    const t = clock.getElapsedTime();
    switch (activeAnimation) {
      case 'walking':
        node.position.y = Math.abs(Math.sin(t * 4)) * 0.08;
        node.rotation.z = Math.sin(t * 4) * 0.04;
        break;
      case 'running':
        node.position.y = Math.abs(Math.sin(t * 9)) * 0.16;
        node.rotation.x = 0.14;
        node.rotation.z = Math.sin(t * 9) * 0.08;
        break;
      case 'dribbling':
        node.position.y = Math.abs(Math.sin(t * 7)) * 0.11;
        node.rotation.y = Math.sin(t * 3) * 0.28;
        break;
      case 'shooting':
        node.position.y = Math.max(0, Math.sin(t * 5)) * 0.18;
        node.rotation.x = -0.15 + Math.sin(t * 5) * 0.2;
        break;
      case 'celebration':
        node.position.y = Math.abs(Math.sin(t * 6)) * 0.35;
        node.rotation.y += 0.03;
        break;
      case 'idle':
      default:
        node.position.y = Math.sin(t * 2) * 0.03;
        node.rotation.x = THREE.MathUtils.lerp(node.rotation.x, 0, 0.1);
        node.rotation.z = THREE.MathUtils.lerp(node.rotation.z, 0, 0.1);
        break;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

/**
 * Supports real Three.js AnimationMixer clips via drei's useAnimations when a GLB
 * provides animations, and drives procedural stand-in motion when clips are absent.
 */
export default function PlayerAnimationController({
  animations = [],
  activeAnimation = 'idle',
  children = null,
}) {
  if (animations && animations.length > 0) {
    return (
      <GltfClipDriver animations={animations} activeAnimation={activeAnimation}>
        {children}
      </GltfClipDriver>
    );
  }

  return <ProceduralClipDriver activeAnimation={activeAnimation}>{children}</ProceduralClipDriver>;
}
