import { useRef, useState } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Text3DProps {
  content: string;
  position: [number, number, number];
  fontSize?: number;
  color?: string;
  opacity?: number;
  maxWidth?: number;
  onClick?: () => void;
  align?: "left" | "center" | "right";
  entrance?: boolean;
  entranceDelay?: number;
}

export const Text3D = ({
  content,
  position,
  fontSize = 0.2,
  color = "#E8E8E8",
  opacity = 1,
  maxWidth = 10,
  onClick,
  align = "center",
  entrance = true,
  entranceDelay = 0,
}: Text3DProps) => {
  const textRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(entrance ? 0 : 1);

  useFrame((state) => {
    if (textRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Entrance animation
      if (entrance && animationProgress < 1) {
        const progress = Math.min(1, (time - entranceDelay) / 2);
        setAnimationProgress(Math.max(0, progress));
        textRef.current.position.z = position[2] + (1 - progress) * 2;
        // @ts-ignore
        textRef.current.material.opacity = progress * opacity;
      }

      // Subtle float animation
      textRef.current.position.y = position[1] + Math.sin(time * 0.5 + entranceDelay) * 0.02;

      // Hover glow effect
      if (hovered && textRef.current.material) {
        // @ts-ignore
        const currentEmissive = textRef.current.material.emissiveIntensity || 0;
        // @ts-ignore
        textRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
          currentEmissive,
          0.4,
          0.1
        );
      } else if (textRef.current.material) {
        // @ts-ignore
        const currentEmissive = textRef.current.material.emissiveIntensity || 0;
        // @ts-ignore
        textRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
          currentEmissive,
          0,
          0.1
        );
      }
    }
  });

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={fontSize}
      color={color}
      maxWidth={maxWidth}
      textAlign={align}
      anchorX={align}
      anchorY="middle"
      onClick={onClick}
      onPointerEnter={() => {
        setHovered(true);
        if (onClick) document.body.style.cursor = "pointer";
      }}
      onPointerLeave={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {content}
      <meshStandardMaterial
        color={color}
        transparent
        opacity={entrance ? 0 : opacity}
        emissive={color}
        emissiveIntensity={0}
        toneMapped={false}
      />
    </Text>
  );
};
