import * as THREE from "three";

interface OrbitPathProps {
  radius: number;
  color?: string;
  opacity?: number;
}

const OrbitPath = ({ radius, color = "#FFFFFF", opacity = 0.15 }: OrbitPathProps) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.1, radius + 0.1, 128]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default OrbitPath;
