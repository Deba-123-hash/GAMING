'use client';

export default function GoalPost({ position = [12.7, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation} name="goal-post">
      {/* Left Post */}
      <mesh position={[0, 1.1, -1.8]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 2.2, 12]} />
        <meshStandardMaterial color="#f5f4ee" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Right Post */}
      <mesh position={[0, 1.1, 1.8]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 2.2, 12]} />
        <meshStandardMaterial color="#f5f4ee" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Crossbar */}
      <mesh position={[0, 2.2, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 3.7, 12]} />
        <meshStandardMaterial color="#f5f4ee" roughness={0.3} metalness={0.4} />
      </mesh>
    </group>
  );
}
