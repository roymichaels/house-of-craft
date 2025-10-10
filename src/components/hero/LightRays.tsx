import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const LightRays = () => {
  const raysRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (raysRef.current) {
      raysRef.current.rotation.z += 0.0005;
      
      // Pulsing effect
      const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
      raysRef.current.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = pulse * 0.15;
      });
    }
  });

  return (
    <group ref={raysRef} position={[0, 0, -3]}>
      {[...Array(12)].map((_, i) => {
        const angle = (i * Math.PI * 2) / 12;
        return (
          <mesh key={i} rotation={[0, 0, angle]}>
            <planeGeometry args={[0.08, 8]} />
            <meshBasicMaterial
              color="#D4AF37"
              transparent
              opacity={0.12}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default LightRays;
