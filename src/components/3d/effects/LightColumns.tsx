import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LightColumnsProps {
  lightColor: string;
  intensity?: number;
}

export const LightColumns = ({ 
  lightColor, 
  intensity = 1.0 
}: LightColumnsProps) => {
  const leftColumnRef = useRef<THREE.Mesh>(null);
  const rightColumnRef = useRef<THREE.Mesh>(null);

  // Subtle breathing animation - light pulses like temple atmosphere
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const breathe = 1.0 + Math.sin(time * 0.4) * 0.02;
    
    if (leftColumnRef.current) {
      leftColumnRef.current.scale.set(breathe, 1, breathe);
    }
    if (rightColumnRef.current) {
      rightColumnRef.current.scale.set(breathe, 1, breathe);
    }
  });

  return (
    <group>
      {/* Left Light Column */}
      <mesh ref={leftColumnRef} position={[-8, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 15, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#f4d26a"
          emissiveIntensity={1.2 * intensity}
          transparent
          opacity={0.2 * intensity}
        />
      </mesh>

      {/* Right Light Column */}
      <mesh ref={rightColumnRef} position={[8, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 15, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#f4d26a"
          emissiveIntensity={1.2 * intensity}
          transparent
          opacity={0.2 * intensity}
        />
      </mesh>

      {/* Point lights to enhance glow */}
      <pointLight 
        position={[-8, 0, 0]} 
        color="#f4d26a" 
        intensity={0.8 * intensity} 
        distance={8} 
      />
      <pointLight 
        position={[8, 0, 0]} 
        color="#f4d26a" 
        intensity={0.8 * intensity} 
        distance={8} 
      />
    </group>
  );
};
