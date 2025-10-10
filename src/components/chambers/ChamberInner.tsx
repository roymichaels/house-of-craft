import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ChamberInnerProps {
  lightColor: string;
}

const ChamberInner = ({ lightColor }: ChamberInnerProps) => {
  const glowRef = useRef<THREE.PointLight>(null);

  // Pulsing glow
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (glowRef.current) {
      glowRef.current.intensity = 2 + Math.sin(time * 0.8) * 0.5;
    }
  });

  return (
    <group>
      {/* Central pulsing light */}
      <pointLight 
        ref={glowRef}
        position={[0, 0, 0]}
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
