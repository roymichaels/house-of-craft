import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SolarHaloProps {
  radius: number;
  lightColor: string;
  intensity?: number;
}

export const SolarHalo = ({ 
  radius, 
  lightColor,
  intensity = 1.0 
}: SolarHaloProps) => {
  const haloRef = useRef<THREE.Mesh>(null);

  // Slow celestial rotation
  useFrame((state) => {
    if (haloRef.current) {
      const time = state.clock.getElapsedTime();
      haloRef.current.rotation.x = Math.PI / 4 + Math.sin(time * 0.1) * 0.1;
      haloRef.current.rotation.z = time * 0.05;
    }
  });

  return (
    <mesh ref={haloRef}>
      <torusGeometry args={[radius, 0.02, 16, 100]} />
      <meshStandardMaterial
        emissive="#fcd778"
        emissiveIntensity={2.0 * intensity}
        toneMapped={false}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};
