'use client';

export default function StadiumTunnel({ position = [0, 1.3, 10.6] }) {
  return (
    <group position={position} name="stadium-tunnel">
      <mesh>
        <boxGeometry args={[2.8, 2.6, 2.4]} />
        <meshStandardMaterial color="#0b0e11" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.25, -1.2]}>
        <boxGeometry args={[2.9, 0.14, 0.14]} />
        <meshStandardMaterial color="#b8ff2c" emissive="#b8ff2c" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}
