'use client';

export default function FootballPitch({ length = 26, width = 16 }) {
  const halfLen = length / 2;
  const halfWidth = width / 2;

  return (
    <group name="football-pitch">
      {/* Main turf surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[length, width]} />
        <meshStandardMaterial color="#0f3d26" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Outer pitch apron */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[length + 6, width + 6]} />
        <meshStandardMaterial color="#0b1512" roughness={0.95} />
      </mesh>

      {/* Touchline markings */}
      <mesh position={[0, 0.015, halfWidth - 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[length - 0.4, 0.08]} />
        <meshBasicMaterial color="#f5f4ee" />
      </mesh>
      <mesh position={[0, 0.015, -(halfWidth - 0.1)]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[length - 0.4, 0.08]} />
        <meshBasicMaterial color="#f5f4ee" />
      </mesh>
      <mesh position={[halfLen - 0.2, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, width - 0.2]} />
        <meshBasicMaterial color="#f5f4ee" />
      </mesh>
      <mesh position={[-(halfLen - 0.2), 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, width - 0.2]} />
        <meshBasicMaterial color="#f5f4ee" />
      </mesh>

      {/* Halfway line & Center circle */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, width - 0.2]} />
        <meshBasicMaterial color="#f5f4ee" />
      </mesh>
      <mesh position={[0, 0.018, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.1, 2.2, 48]} />
        <meshBasicMaterial color="#f5f4ee" />
      </mesh>
    </group>
  );
}
