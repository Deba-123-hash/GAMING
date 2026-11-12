'use client';

export default function StadiumStand() {
  return (
    <group name="stadium-stands">
      {/* North & South Grandstands */}
      <mesh position={[0, 2.2, -13.5]} receiveShadow>
        <boxGeometry args={[30, 4.4, 5.5]} />
        <meshStandardMaterial color="#12171d" roughness={0.85} />
      </mesh>
      <mesh position={[0, 2.2, 13.5]} receiveShadow>
        <boxGeometry args={[30, 4.4, 5.5]} />
        <meshStandardMaterial color="#12171d" roughness={0.85} />
      </mesh>

      {/* East & West Stands */}
      <mesh position={[17.8, 2.2, 0]} receiveShadow>
        <boxGeometry args={[5.5, 4.4, 21]} />
        <meshStandardMaterial color="#12171d" roughness={0.85} />
      </mesh>
      <mesh position={[-17.8, 2.2, 0]} receiveShadow>
        <boxGeometry args={[5.5, 4.4, 21]} />
        <meshStandardMaterial color="#12171d" roughness={0.85} />
      </mesh>

      {/* Perimeter LED Advertising Boards */}
      <mesh position={[0, 0.38, -9.2]}>
        <boxGeometry args={[26.5, 0.65, 0.16]} />
        <meshStandardMaterial color="#b8ff2c" emissive="#b8ff2c" emissiveIntensity={0.65} />
      </mesh>
      <mesh position={[0, 0.38, 9.2]}>
        <boxGeometry args={[26.5, 0.65, 0.16]} />
        <meshStandardMaterial color="#ff6b1a" emissive="#ff6b1a" emissiveIntensity={0.55} />
      </mesh>
    </group>
  );
}
