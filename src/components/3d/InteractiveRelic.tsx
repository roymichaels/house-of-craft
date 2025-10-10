import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useModalStore } from "@/stores/modalStore";
import * as THREE from "three";
import { RelicLabel } from "./RelicLabel";

interface InteractiveRelicProps {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  position: [number, number, number];
  scale?: number;
  userData: {
    title: string;
    category: string;
    description: string;
    image: string;
    story?: string;
    price?: string;
  };
  glowColor?: string;
}

export const InteractiveRelic = ({ 
  geometry, 
  material, 
  position, 
  scale = 1,
  userData,
  glowColor = "#C4A661"
}: InteractiveRelicProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { openModal } = useModalStore();
  
  // Hover animation - subtle scale pulse
  useFrame((state) => {
    if (meshRef.current && hovered) {
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 3) * 0.05;
      meshRef.current.scale.setScalar(scale * pulse);
    } else if (meshRef.current) {
      const target = new THREE.Vector3(scale, scale, scale);
      meshRef.current.scale.lerp(target, 0.1);
    }
  });
  
  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        onClick={() => openModal('object', userData)}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
        castShadow
      />
      
      {/* Hover glow ring */}
      {hovered && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          <ringGeometry args={[scale * 1.2, scale * 1.5, 32]} />
          <meshBasicMaterial 
            color={glowColor}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      <RelicLabel text={userData.title} visible={hovered} />
    </group>
  );
};
