import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ChamberVaultProps {
  lightColor: string;
}

const ChamberVault = ({ lightColor }: ChamberVaultProps) => {
  const relicsRef = useRef<(THREE.Mesh | null)[]>([]);

  // Gentle floating animation for relics
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    relicsRef.current.forEach((relic, i) => {
      if (relic) {
        relic.position.y = 1.5 + Math.sin(time * 0.5 + i) * 0.05;
        relic.rotation.y = time * 0.3 + i;
      }
    });
  });

  // 4 pedestals arranged in semi-circle
  const pedestals = Array.from({ length: 4 }, (_, i) => {
    const angle = (i / 3 - 0.5) * Math.PI * 0.6;
    const radius = 6;
    return {
      position: [
        Math.sin(angle) * radius,
        0,
        Math.cos(angle) * radius - 3
      ] as [number, number, number],
      relicColor: ["#C4A661", "#7A6A4F", "#A08968", "#D4B86A"][i],
      key: i
    };
  });

  return (
    <group>
      {pedestals.map((pedestal) => (
        <group key={pedestal.key} position={pedestal.position}>
          {/* Glass pedestal */}
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.8, 1, 0.8]} />
            <meshPhysicalMaterial 
              color="#1a1a1a"
              transparent
              opacity={0.3}
              roughness={0.1}
              metalness={0.9}
              reflectivity={1}
              clearcoat={1}
            />
          </mesh>
          
          {/* Relic on top */}
          <mesh 
            ref={(el) => relicsRef.current[pedestal.key] = el}
            position={[0, 1.5, 0]}
            castShadow
          >
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial 
              color={pedestal.relicColor}
              roughness={0.2}
              metalness={0.8}
              emissive={pedestal.relicColor}
              emissiveIntensity={0.3}
            />
          </mesh>
          
          {/* Spotlight base glow */}
          <pointLight 
            position={[0, 1.5, 0]} 
            color={lightColor}
            intensity={0.5}
            distance={3}
          />
        </group>
      ))}
    </group>
  );
};

export default ChamberVault;
