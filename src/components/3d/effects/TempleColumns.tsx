import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TempleColumnsProps {
  count?: number;
  layout?: 'temple-framing' | 'circular' | 'entrance';
  radius?: number;
  height?: number;
  lightColor?: string;
}

export const TempleColumns = ({ 
  count = 6, 
  layout = 'temple-framing',
  radius = 12, 
  height = 12,
  lightColor = "#C4A661" 
}: TempleColumnsProps) => {
  const groupRef = useRef<THREE.Group>(null);

  // Subtle swaying animation - architectural solidity
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.children.forEach((column, i) => {
        // Gentle swaying instead of aggressive floating
        const mesh = column as THREE.Mesh;
        mesh.rotation.z = Math.sin(time * 0.2 + i * 0.3) * 0.003;
      });
    }
  });

  // Generate column positions based on layout
  const getColumnPositions = () => {
    switch (layout) {
      case 'temple-framing':
        // Left colonnade (3) + Right colonnade (3)
        return [
          [-10, 0, -2], [-10, 0, 0], [-10, 0, 2],  // Left
          [10, 0, -2], [10, 0, 0], [10, 0, 2]       // Right
        ];
      
      case 'entrance':
        // Minimal gateway columns
        return [
          [-8, 0, -2], [8, 0, -2]
        ];
      
      case 'circular':
      default:
        // Traditional circular layout
        return Array.from({ length: count }, (_, i) => {
          const angle = (i / count) * Math.PI * 2;
          return [
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
          ];
        });
    }
  };

  const columns = getColumnPositions();

  // Three-part column: Base, Fluted Shaft, Capital
  const ColumnPart = ({ position }: { position: number[] }) => (
    <group position={position as [number, number, number]}>
      {/* Base - wider platform */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.65, 0.6, 32]} />
        <meshStandardMaterial 
          color="#EAE4D8"
          roughness={0.6}
          metalness={0.15}
        />
      </mesh>

      {/* Fluted Shaft - main column with entasis */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.4, height, 32]} />
        <meshStandardMaterial 
          color="#EAE4D8"
          roughness={0.5}
          metalness={0.15}
          emissive={lightColor}
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Capital - Corinthian-style top with golden accents */}
      <mesh position={[0, height + 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.4, 0.5, 32]} />
        <meshStandardMaterial 
          color="#D4C5A9"
          roughness={0.3}
          metalness={0.2}
          emissive={lightColor}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Golden trim ring at capital */}
      <mesh position={[0, height + 0.65, 0]}>
        <torusGeometry args={[0.48, 0.03, 16, 32]} />
        <meshStandardMaterial 
          color={lightColor}
          roughness={0.2}
          metalness={0.9}
          emissive={lightColor}
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );

  return (
    <group ref={groupRef}>
      {columns.map((position, i) => (
        <ColumnPart key={i} position={position} />
      ))}
    </group>
  );
};
