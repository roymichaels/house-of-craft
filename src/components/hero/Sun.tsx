import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SunProps {
  radius: number;
  glowIntensity?: number;
}

const Sun = ({ radius, glowIntensity = 2.5 }: SunProps) => {
  const sunRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Gentle pulsing glow
    if (glowRef.current) {
      const pulseFactor = 1 + Math.sin(time * 0.5) * 0.1;
      glowRef.current.scale.setScalar(pulseFactor);
    }

    // Slow rotation
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      {/* Main sun body */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          color="#FDB813"
          emissive="#FFA500"
          emissiveIntensity={glowIntensity}
          toneMapped={false}
        />
      </mesh>

      {/* Outer glow/corona */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 1.3, 32, 32]} />
        <meshBasicMaterial
          color="#FFA500"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Point light source */}
      <pointLight
        position={[0, 0, 0]}
        intensity={2}
        distance={200}
        decay={2}
        color="#FDB813"
      />
    </group>
  );
};

export default Sun;
