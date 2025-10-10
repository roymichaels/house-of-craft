import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text3D, Center } from "@react-three/drei";
import * as THREE from "three";

interface Logo3DProps {
  lightColor: string;
}

const Logo3D = ({ lightColor }: Logo3DProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const lambdaRef = useRef<THREE.Mesh>(null);
  const piRef = useRef<THREE.Mesh>(null);

  // Gentle floating and rotation animation
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      // Gentle float
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.2;
      // Very slow rotation
      groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.1;
    }

    // Individual letter subtle animations
    if (lambdaRef.current) {
      const time = state.clock.getElapsedTime();
      lambdaRef.current.position.z = Math.sin(time * 0.3) * 0.05;
    }
    if (piRef.current) {
      const time = state.clock.getElapsedTime();
      piRef.current.position.z = Math.sin(time * 0.3 + Math.PI) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 3, 0]}>
      <Center>
        <group>
          {/* Lambda (Λ) */}
          <Text3D
            ref={lambdaRef}
            font="/fonts/Ancient_Medium.ttf"
            size={1.2}
            height={0.3}
            curveSegments={32}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.01}
            bevelOffset={0}
            bevelSegments={8}
            position={[-0.8, 0, 0]}
          >
            Λ
            <meshStandardMaterial
              color="#C4A661"
              emissive="#C4A661"
              emissiveIntensity={0.6}
              metalness={0.8}
              roughness={0.2}
            />
          </Text3D>

          {/* Pi (Π) */}
          <Text3D
            ref={piRef}
            font="/fonts/Ancient_Medium.ttf"
            size={1.2}
            height={0.3}
            curveSegments={32}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.01}
            bevelOffset={0}
            bevelSegments={8}
            position={[0.3, 0, 0]}
          >
            Π
            <meshStandardMaterial
              color="#C4A661"
              emissive="#C4A661"
              emissiveIntensity={0.6}
              metalness={0.8}
              roughness={0.2}
            />
          </Text3D>
        </group>
      </Center>

      {/* Glowing halo behind the logo */}
      <mesh position={[0, 0, -0.5]}>
        <circleGeometry args={[2, 64]} />
        <meshBasicMaterial
          color={lightColor}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Point lights for glow effect */}
      <pointLight
        position={[-0.8, 0, 0.5]}
        color="#C4A661"
        intensity={2}
        distance={3}
      />
      <pointLight
        position={[0.3, 0, 0.5]}
        color="#C4A661"
        intensity={2}
        distance={3}
      />
    </group>
  );
};

export default Logo3D;
