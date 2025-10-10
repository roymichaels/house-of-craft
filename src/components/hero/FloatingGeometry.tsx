import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const FloatingGeometry = () => {
  const shapes = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (shapes.current) {
      shapes.current.rotation.y += 0.001;
      shapes.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        mesh.rotation.x += 0.002 * (i % 2 === 0 ? 1 : -1);
        mesh.rotation.y += 0.001 * (i % 2 === 0 ? -1 : 1);
        mesh.position.y += Math.sin(state.clock.elapsedTime + i) * 0.0005;
      });
    }
  });

  return (
    <group ref={shapes}>
      {/* Dodecahedrons */}
      {[...Array(5)].map((_, i) => {
        const angle = (i * Math.PI * 2) / 5;
        const radius = 5 + Math.random() * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 3;
        
        return (
          <mesh key={i} position={[x, y, z]} scale={0.15}>
            <dodecahedronGeometry />
            <meshStandardMaterial
              color="#7A6A4F"
              wireframe
              transparent
              opacity={0.2}
              emissive="#C4A661"
              emissiveIntensity={0.1}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default FloatingGeometry;
