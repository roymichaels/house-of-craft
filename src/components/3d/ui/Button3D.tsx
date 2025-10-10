import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface Button3DProps {
  label: string;
  position: [number, number, number];
  onClick: () => void;
  color?: string;
  entranceDelay?: number;
}

export const Button3D = ({
  label,
  position,
  onClick,
  color = "#C4A661",
  entranceDelay = 0,
}: Button3DProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const plateRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Entrance animation
    if (animationProgress < 1) {
      const progress = Math.min(1, (time - entranceDelay) / 2);
      setAnimationProgress(Math.max(0, progress));
      
      if (groupRef.current) {
        groupRef.current.scale.setScalar(progress);
        groupRef.current.position.z = position[2] + (1 - progress) * 3;
      }
    }

    if (plateRef.current && plateRef.current.material) {
      // Pulse animation when visible
      const pulse = Math.sin(time * 2) * 0.1 + 0.3;
      // @ts-ignore
      plateRef.current.material.emissiveIntensity = hovered ? 0.8 : pulse;

      // Hover scale effect
      const targetScale = hovered ? 1.05 : clicked ? 0.95 : 1;
      groupRef.current?.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }

    // Reset click state
    if (clicked) {
      setTimeout(() => setClicked(false), 150);
    }
  });

  const handleClick = () => {
    setClicked(true);
    onClick();
  };

  return (
    <group ref={groupRef} position={position}>
      {/* Button plate */}
      <mesh
        ref={plateRef}
        onClick={handleClick}
        onPointerEnter={() => {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <boxGeometry args={[2.5, 0.5, 0.1]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.9}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Border glow */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(2.5, 0.5, 0.1)]} />
        <lineBasicMaterial color={color} transparent opacity={hovered ? 1 : 0.5} />
      </lineSegments>

      {/* Button text */}
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.15}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
        font="/fonts/Ancient_Medium.ttf"
      >
        {label}
      </Text>

      {/* Hover glow light */}
      {hovered && (
        <pointLight
          position={[0, 0, 0.5]}
          color={color}
          intensity={2}
          distance={3}
        />
      )}
    </group>
  );
};
