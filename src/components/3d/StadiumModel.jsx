'use client';

import StadiumRoof from '@/components/3d/StadiumRoof';
import StadiumStand from '@/components/3d/StadiumStand';
import StadiumTunnel from '@/components/3d/StadiumTunnel';

export default function StadiumModel() {
  return (
    <group name="stadium-model-scaffold">
      <StadiumStand />
      <StadiumRoof />
      <StadiumTunnel />
    </group>
  );
}
