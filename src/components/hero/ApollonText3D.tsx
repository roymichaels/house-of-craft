import { useRef } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ApolloText3D = () => {
  const textRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (textRef.current) {
      // Gentle floating
      textRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      
      // Subtle shimmer on material
      const material = textRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group position={[0, 3.5, 0]}>
      <Text
        ref={textRef}
        font="/fonts/Ancient-Medium.woff"
        fontSize={0.6}
        letterSpacing={0.08}
        position={[0, 0, 0]}
        anchorX="center"
        anchorY="middle"
      >
        APOLLO
        <meshStandardMaterial
          color="#D4AF37"
          emissive="#C4A661"
          emissiveIntensity={1}
          metalness={0.9}
          roughness={0.1}
          toneMapped={false}
        />
      </Text>
      
      {/* Glow halo behind text */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[3.5, 0.8]} />
        <meshBasicMaterial
          color="#D4AF37"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

export default ApolloText3D;
