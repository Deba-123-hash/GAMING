'use client';

import Environment from '@/components/3d/Environment';
import FootballPitch from '@/components/3d/FootballPitch';
import GoalPost from '@/components/3d/GoalPost';
import Football from '@/components/3d/Football';
import StadiumModel from '@/components/3d/StadiumModel';
import CrowdSystem from '@/components/3d/CrowdSystem';
import ParticleEffects from '@/components/3d/ParticleEffects';
import PlayerModel from '@/components/3d/PlayerModel';
import TrophyModel from '@/components/3d/TrophyModel';
import CinematicCamera from '@/cinematic/camera/CinematicCamera';
import { CINEMATIC_LIGHTING_PRESETS } from '@/cinematic/config/cinematicConfig';
import useDevicePerformance from '@/hooks/useDevicePerformance';

export default function CinematicSequences({ sequence, isPlaying = true }) {
  const perf = useDevicePerformance();
  const light =
    CINEMATIC_LIGHTING_PRESETS[sequence?.lightingPreset] ||
    CINEMATIC_LIGHTING_PRESETS['night-stadium'];

  const isTrophy = sequence?.id === 'trophy';
  const playerClip =
    sequence?.id === 'celebration'
      ? 'celebration'
      : sequence?.id === 'player-entrance'
        ? 'walking'
        : 'idle';

  return (
    <>
      <Environment backgroundColor="#080b09" />
      <ambientLight intensity={light.ambient} color="#dbe7f0" />
      <directionalLight
        position={[14, 24, 14]}
        intensity={light.keyIntensity}
        color="#f5f7f2"
        castShadow={perf.shadows}
      />
      <pointLight position={[0, 8, 4]} intensity={1.4} distance={32} color={light.accentColor} />

      <CinematicCamera presetId={sequence?.cameraPreset} isPlaying={isPlaying} />

      {isTrophy ? (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[3.5, 48]} />
            <meshStandardMaterial color="#0e1f18" roughness={0.85} />
          </mesh>
          <TrophyModel position={[0, 0, 0]} />
          <ParticleEffects enabled={perf.enableParticles} count={32} />
        </>
      ) : (
        <>
          <FootballPitch />
          <GoalPost position={[12.7, 0, 0]} />
          <GoalPost position={[-12.7, 0, 0]} />
          <Football position={[1.2, 0.35, 0.4]} spin={isPlaying} />
          <StadiumModel />
          <CrowdSystem count={perf.crowdCount} animateWave={isPlaying} />
          <ParticleEffects enabled={perf.enableParticles} count={40} />
          <PlayerModel position={[0, 0, 0]} activeAnimation={playerClip} />
        </>
      )}
    </>
  );
}
