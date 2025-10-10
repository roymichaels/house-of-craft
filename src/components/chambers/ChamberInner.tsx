import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ChamberInnerProps {
  lightColor: string;
}

const ChamberInner = ({ lightColor }: ChamberInnerProps) => {
  const sigilRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  // Slow rotation and pulsing glow
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (sigilRef.current) {
      sigilRef.current.rotation.z = time * 0.1;
    }
    
    if (glowRef.current) {
      glowRef.current.intensity = 2 + Math.sin(time * 0.8) * 0.5;
    }
  });

  return (
    <group>
      {/* Floor sigil */}
      <mesh
        ref={sigilRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2, 0]}
        receiveShadow
      >
        <circleGeometry args={[2, 64]} />
        <meshStandardMaterial 
          color={lightColor}
          roughness={0.2}
          metalness={0.8}
          emissive={lightColor}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Outer ring */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.95, 0]}
      >
        <ringGeometry args={[2.2, 2.5, 64]} />
        <meshBasicMaterial 
          color={lightColor}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Central pulsing light */}
      <pointLight 
        ref={glowRef}
        position={[0, -1, 0]}
        color={lightColor}
        intensity={2}
        distance={5}
      />
      
      {/* Ambient sanctum glow */}
      <ambientLight intensity={0.3} color={lightColor} />
    </group>
  );
};

export default ChamberInner;
