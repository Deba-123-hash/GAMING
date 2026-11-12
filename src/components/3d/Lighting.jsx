'use client';

export default function Lighting({ enableShadows = true }) {
  return (
    <>
      <ambientLight intensity={0.45} color="#dbe7f0" />
      <hemisphereLight intensity={0.55} color="#b8ff2c" groundColor="#0e1f18" />

      {/* Primary Floodlight Key */}
      <directionalLight
        position={[18, 28, 16]}
        intensity={2.2}
        color="#f5f4ee"
        castShadow={enableShadows}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={70}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
      />

      {/* Opposite Rim Floodlight */}
      <directionalLight position={[-18, 20, -14]} intensity={0.95} color="#b8ff2c" />
      <pointLight position={[0, 12, 0]} intensity={1.1} distance={40} color="#ff6b1a" />
    </>
  );
}
