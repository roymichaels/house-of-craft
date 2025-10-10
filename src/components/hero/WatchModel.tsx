import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

interface WatchModelProps {
  rotationSpeed: number;
  lightColor: string;
}

const WatchModel = ({ rotationSpeed, lightColor }: WatchModelProps) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Slow continuous rotation
      meshRef.current.rotation.y += rotationSpeed * 0.01;
      
      // Subtle breathing animation
      const breathe = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      meshRef.current.scale.setScalar(1 + breathe);
    }
  });

  return (
    <group>
      {/* Watch case - torus for elegant ring shape */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <torusGeometry args={[1.2, 0.4, 32, 100]} />
        <meshStandardMaterial
          color={lightColor}
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1.2}
        />
      </mesh>
      
      {/* Inner dial */}
      <mesh position={[0, 0, 0.05]}>
        <circleGeometry args={[0.9, 64]} />
        <meshStandardMaterial
          color="#0C0C0C"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Center crown */}
      <mesh position={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 32]} />
        <meshStandardMaterial
          color={lightColor}
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>
    </group>
  );
};

export default WatchModel;
