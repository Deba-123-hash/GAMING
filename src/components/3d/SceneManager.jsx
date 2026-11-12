'use client';

import StadiumScene from '@/components/3d/StadiumScene';
import TrophyModel from '@/components/3d/TrophyModel';
import Lighting from '@/components/3d/Lighting';
import CameraRig from '@/components/3d/CameraRig';

export default function SceneManager({ activeScene = 'stadium', activeAnimation = 'idle' }) {
  if (activeScene === 'trophy') {
    return (
      <>
        <Lighting />
        <CameraRig target={[0, 0.8, 0]} minDistance={2.5} maxDistance={7} />
        <TrophyModel />
      </>
    );
  }

  return <StadiumScene activeAnimation={activeAnimation} />;
}
