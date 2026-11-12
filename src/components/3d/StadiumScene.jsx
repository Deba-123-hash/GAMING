'use client';

import Lighting from '@/components/3d/Lighting';
import Environment from '@/components/3d/Environment';
import CameraRig from '@/components/3d/CameraRig';
import FootballPitch from '@/components/3d/FootballPitch';
import GoalPost from '@/components/3d/GoalPost';
import Football from '@/components/3d/Football';
import StadiumModel from '@/components/3d/StadiumModel';
import CrowdSystem from '@/components/3d/CrowdSystem';
import ParticleEffects from '@/components/3d/ParticleEffects';
import PlayerModel from '@/components/3d/PlayerModel';
import useDevicePerformance from '@/hooks/useDevicePerformance';

export default function StadiumScene({ showPlayer = true, activeAnimation = 'idle' }) {
  const perf = useDevicePerformance();

  return (
    <>
      <Environment />
      <Lighting enableShadows={perf.shadows} />
      <CameraRig target={[0, 0.8, 0]} minDistance={8} maxDistance={38} />
      <FootballPitch />
      <GoalPost position={[12.7, 0, 0]} />
      <GoalPost position={[-12.7, 0, 0]} />
      <Football position={[1.4, 0.35, 0.6]} />
      <StadiumModel />
      <CrowdSystem count={perf.crowdCount} />
      <ParticleEffects enabled={perf.enableParticles} />
      {showPlayer ? <PlayerModel position={[0, 0, 0]} activeAnimation={activeAnimation} /> : null}
    </>
  );
}
