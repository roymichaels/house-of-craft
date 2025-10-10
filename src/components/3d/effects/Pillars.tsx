import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PillarsProps {
  count?: number;
  radius?: number;
  height?: number;
  lightColor?: string;
}

export const Pillars = ({ 
  count = 8, 
  radius = 12, 
  height = 10,
  lightColor = "#C4A661" 
}: PillarsProps) => {
  const groupRef = useRef<THREE.Group>(null);

  // Gentle emergence animation
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.children.forEach((pillar, i) => {
        pillar.position.y = Math.sin(time * 0.3 + i) * 0.15;
      });
    }
  });

  const pillars = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    return {
      position: [
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ] as [number, number, number],
      key: i
    };
  });

  return (
    <group ref={groupRef}>
      {pillars.map((pillar) => (
        <mesh key={pillar.key} position={pillar.position} castShadow>
          <cylinderGeometry args={[0.4, 0.5, height, 12]} />
          <meshStandardMaterial 
            color="#E8E4DC"
            roughness={0.8}
            metalness={0.1}
            emissive={lightColor}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
};
