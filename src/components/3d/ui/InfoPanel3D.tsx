import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface InfoPanel3DProps {
  content: string;
  position: [number, number, number];
  width?: number;
  height?: number;
  fontSize?: number;
  entranceDelay?: number;
}

export const InfoPanel3D = ({
  content,
  position,
  width = 4,
  height = 1,
  fontSize = 0.1,
  entranceDelay = 0,
}: InfoPanel3DProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const panelRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Entrance animation
    if (animationProgress < 1) {
      const progress = Math.min(1, (time - entranceDelay) / 2);
      setAnimationProgress(Math.max(0, progress));
      
      if (groupRef.current) {
        groupRef.current.position.y = position[1] - (1 - progress) * 2;
      }

      if (panelRef.current && panelRef.current.material) {
        // @ts-ignore
        panelRef.current.material.opacity = progress * 0.2;
      }
    }

    // Gentle floating
    if (groupRef.current && animationProgress === 1) {
      groupRef.current.position.y = position[1] + Math.sin(time * 0.3 + entranceDelay) * 0.05;
    }

    // Hover glow effect
    if (panelRef.current && panelRef.current.material) {
      // @ts-ignore
      const targetEmissive = hovered ? 0.3 : 0.05;
      // @ts-ignore
      const currentEmissive = panelRef.current.material.emissiveIntensity || 0;
      // @ts-ignore
      panelRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        currentEmissive,
        targetEmissive,
        0.1
      );
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Glass panel */}
      <mesh
        ref={panelRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <planeGeometry args={[width, height]} />
        <meshPhysicalMaterial
          color="#1a1a1a"
          transparent
          opacity={0.2}
          roughness={0.1}
          metalness={0.9}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive="#C4A661"
          emissiveIntensity={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Border frame */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(width, height)]} />
        <lineBasicMaterial color="#C4A661" transparent opacity={0.4} />
      </lineSegments>

      {/* Text content */}
      <Text
        position={[0, 0, 0.01]}
        fontSize={fontSize}
        color="#E8E8E8"
        maxWidth={width - 0.4}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {content}
        <meshStandardMaterial
          color="#E8E8E8"
          emissive="#E8E8E8"
          emissiveIntensity={0.2}
          transparent
          opacity={0.9}
          toneMapped={false}
        />
      </Text>
    </group>
  );
};
