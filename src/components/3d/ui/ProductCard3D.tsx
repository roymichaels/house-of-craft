import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface ProductCard3DProps {
  title: string;
  category: string;
  image?: string;
  position: [number, number, number];
  onClick: () => void;
  color?: string;
  entranceDelay?: number;
}

export const ProductCard3D = ({
  title,
  category,
  image,
  position,
  onClick,
  color = "#C4A661",
  entranceDelay = 0,
}: ProductCard3DProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const cardRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Entrance animation
    if (animationProgress < 1) {
      const progress = Math.min(1, (time - entranceDelay) / 2.5);
      setAnimationProgress(Math.max(0, progress));
      
      if (groupRef.current) {
        groupRef.current.scale.setScalar(progress);
        groupRef.current.rotation.y = (1 - progress) * Math.PI;
      }
    }

    // Floating animation
    if (groupRef.current && animationProgress === 1) {
      groupRef.current.position.y = position[1] + Math.sin(time * 0.4 + entranceDelay) * 0.08;
    }

    // Hover rotation effect
    if (groupRef.current) {
      const targetRotation = hovered ? Math.PI * 0.05 : 0;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation,
        0.1
      );

      const targetScale = hovered ? 1.1 : 1;
      const currentScale = groupRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
      groupRef.current.scale.setScalar(newScale);
    }

    // Glow effect
    if (cardRef.current && cardRef.current.material) {
      // @ts-ignore
      const targetEmissive = hovered ? 0.4 : 0.1;
      // @ts-ignore
      const currentEmissive = cardRef.current.material.emissiveIntensity || 0;
      // @ts-ignore
      cardRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        currentEmissive,
        targetEmissive,
        0.1
      );
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Product card mesh */}
      <mesh
        ref={cardRef}
        onClick={onClick}
        onPointerEnter={() => {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <planeGeometry args={[1.2, 1.6]} />
        <meshPhysicalMaterial
          color="#1a1a1a"
          transparent
          opacity={0.8}
          metalness={0.9}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Border glow */}
      <lineSegments position={[0, 0, 0.01]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(1.2, 1.6)]} />
        <lineBasicMaterial color={color} transparent opacity={hovered ? 1 : 0.6} />
      </lineSegments>

      {/* Category label */}
      <Text
        position={[0, 0.9, 0.02]}
        fontSize={0.06}
        color={color}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        {category.toUpperCase()}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
          toneMapped={false}
        />
      </Text>

      {/* Title */}
      <Text
        position={[0, -0.9, 0.02]}
        fontSize={0.09}
        color="#E8E8E8"
        maxWidth={1}
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {title}
        <meshStandardMaterial
          color="#E8E8E8"
          emissive="#E8E8E8"
          emissiveIntensity={0.3}
          transparent
          opacity={0.95}
          toneMapped={false}
        />
      </Text>

      {/* Hover spotlight */}
      {hovered && (
        <pointLight
          position={[0, 0, 1]}
          color={color}
          intensity={1.5}
          distance={2}
        />
      )}
    </group>
  );
};
