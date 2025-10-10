import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import * as THREE from "three";

interface Logo3DProps {
  lightColor: string;
}

const Logo3D = ({ lightColor }: Logo3DProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const lambdaRef = useRef<THREE.Group>(null);
  const piRef = useRef<THREE.Group>(null);

  // Gentle floating and rotation animation
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      // Gentle float
      groupRef.current.position.y = 3 + Math.sin(time * 0.5) * 0.2;
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

  // Refined material for elegant look
  const material = new THREE.MeshStandardMaterial({
    color: "#D4B56D",
    emissive: "#C4A661",
    emissiveIntensity: 0.8,
    metalness: 0.9,
    roughness: 0.15,
  });

  // Edge highlight material
  const edgeMaterial = new THREE.MeshStandardMaterial({
    color: "#FFE5A0",
    emissive: "#FFE5A0",
    emissiveIntensity: 1.2,
    metalness: 1.0,
    roughness: 0.1,
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Center>
        <group>
          {/* Lambda (Λ) - Made from elegant cylinders */}
          <group ref={lambdaRef} position={[-0.9, 0, 0]}>
            {/* Left leg of Lambda */}
            <mesh position={[-0.28, 0, 0]} rotation={[0, 0, 0.38]}>
              <cylinderGeometry args={[0.08, 0.06, 1.4, 32]} />
              <primitive object={material} attach="material" />
            </mesh>
            {/* Left leg edge highlight */}
            <mesh position={[-0.28, 0, 0.05]} rotation={[0, 0, 0.38]}>
              <cylinderGeometry args={[0.02, 0.015, 1.42, 16]} />
              <primitive object={edgeMaterial} attach="material" />
            </mesh>
            
            {/* Right leg of Lambda */}
            <mesh position={[0.28, 0, 0]} rotation={[0, 0, -0.38]}>
              <cylinderGeometry args={[0.08, 0.06, 1.4, 32]} />
              <primitive object={material} attach="material" />
            </mesh>
            {/* Right leg edge highlight */}
            <mesh position={[0.28, 0, 0.05]} rotation={[0, 0, -0.38]}>
              <cylinderGeometry args={[0.02, 0.015, 1.42, 16]} />
              <primitive object={edgeMaterial} attach="material" />
            </mesh>
          </group>

          {/* Pi (Π) - Made from refined cylinders */}
          <group ref={piRef} position={[0.9, 0, 0]}>
            {/* Top horizontal bar */}
            <mesh position={[0, 0.55, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.08, 0.08, 1.15, 32]} />
              <primitive object={material} attach="material" />
            </mesh>
            {/* Top bar edge highlight */}
            <mesh position={[0, 0.55, 0.05]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, 1.17, 16]} />
              <primitive object={edgeMaterial} attach="material" />
            </mesh>
            
            {/* Left vertical bar */}
            <mesh position={[-0.42, -0.08, 0]}>
              <cylinderGeometry args={[0.08, 0.06, 1.15, 32]} />
              <primitive object={material} attach="material" />
            </mesh>
            {/* Left bar edge highlight */}
            <mesh position={[-0.42, -0.08, 0.05]}>
              <cylinderGeometry args={[0.02, 0.015, 1.17, 16]} />
              <primitive object={edgeMaterial} attach="material" />
            </mesh>
            
            {/* Right vertical bar */}
            <mesh position={[0.42, -0.08, 0]}>
              <cylinderGeometry args={[0.08, 0.06, 1.15, 32]} />
              <primitive object={material} attach="material" />
            </mesh>
            {/* Right bar edge highlight */}
            <mesh position={[0.42, -0.08, 0.05]}>
              <cylinderGeometry args={[0.02, 0.015, 1.17, 16]} />
              <primitive object={edgeMaterial} attach="material" />
            </mesh>
          </group>
        </group>
      </Center>

      {/* Glowing halo behind the logo */}
      <mesh position={[0, 0, -0.5]}>
        <circleGeometry args={[2.5, 64]} />
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
        position={[0.8, 0, 0.5]}
        color="#C4A661"
        intensity={2}
        distance={3}
      />
    </group>
  );
};

export default Logo3D;
