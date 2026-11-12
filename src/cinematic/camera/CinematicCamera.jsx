'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { CINEMATIC_CAMERA_PRESETS } from '@/cinematic/config/cinematicConfig';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function CinematicCamera({ presetId = 'aerial', isPlaying = true }) {
  const { camera } = useThree();
  const reducedMotion = useReducedMotion();
  const targetVec = useRef(new THREE.Vector3(0, 0, 0));
  const desiredPos = useRef(new THREE.Vector3(0, 18, 28));

  useFrame(({ clock }, delta) => {
    const preset = CINEMATIC_CAMERA_PRESETS[presetId] || CINEMATIC_CAMERA_PRESETS.aerial;
    const t = clock.getElapsedTime();
    const sway = isPlaying && !reducedMotion ? Math.sin(t * 0.45) * 0.85 : 0;

    desiredPos.current.set(preset.position[0] + sway, preset.position[1], preset.position[2]);
    targetVec.current.set(preset.target[0], preset.target[1], preset.target[2]);

    const lerpFactor = reducedMotion ? 1 : Math.min(1, delta * 2.4);
    camera.position.lerp(desiredPos.current, lerpFactor);
    camera.lookAt(targetVec.current);
  });

  return null;
}
