'use client';

import PlayerRig from '@/components/3d/PlayerRig';
import PlayerAnimationController from '@/components/3d/PlayerAnimationController';

/**
 * Procedural athletic mannequin stand-in until production .glb characters are placed in public/models/players/.
 */
export default function PlayerModel({
  position = [0, 0, 0],
  kitColor = '#b8ff2c',
  activeAnimation = 'idle',
}) {
  return (
    <group position={position} name="fictional-player-model">
      <PlayerAnimationController activeAnimation={activeAnimation}>
        <PlayerRig>
          {/* Torso / Kit */}
          <mesh position={[0, 1.15, 0]} castShadow>
            <capsuleGeometry args={[0.24, 0.45, 6, 12]} />
            <meshStandardMaterial color={kitColor} roughness={0.45} metalness={0.15} />
          </mesh>
          {/* Head */}
          <mesh position={[0, 1.78, 0]} castShadow>
            <sphereGeometry args={[0.17, 16, 16]} />
            <meshStandardMaterial color="#d4a382" roughness={0.6} />
          </mesh>
          {/* Shorts & Legs */}
          <mesh position={[-0.11, 0.45, 0]} castShadow>
            <capsuleGeometry args={[0.09, 0.55, 4, 8]} />
            <meshStandardMaterial color="#12171d" roughness={0.6} />
          </mesh>
          <mesh position={[0.11, 0.45, 0]} castShadow>
            <capsuleGeometry args={[0.09, 0.55, 4, 8]} />
            <meshStandardMaterial color="#12171d" roughness={0.6} />
          </mesh>
          {/* Turf Ring Accent */}
          <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.55, 0.64, 32]} />
            <meshBasicMaterial color={kitColor} />
          </mesh>
        </PlayerRig>
      </PlayerAnimationController>
    </group>
  );
}
