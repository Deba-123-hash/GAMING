'use client';

export default function StadiumRoof() {
  return (
    <group position={[0, 8.2, 0]} name="stadium-roof">
      {/* Cantilevered Stadium Halo Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[21, 0.45, 10, 64]} />
        <meshStandardMaterial color="#182029" metalness={0.7} roughness={0.35} />
      </mesh>
      {/* Electric Lime Floodlight Trim */}
      <mesh position={[0, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[20.6, 0.08, 8, 64]} />
        <meshStandardMaterial color="#b8ff2c" emissive="#b8ff2c" emissiveIntensity={1.6} />
      </mesh>
    </group>
  );
}
