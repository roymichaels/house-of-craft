import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SpaceNebula = () => {
  const nebula1Ref = useRef<THREE.Mesh>(null);
  const nebula2Ref = useRef<THREE.Mesh>(null);
  const nebula3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (nebula1Ref.current) {
      nebula1Ref.current.rotation.z = time * 0.02;
      const material = nebula1Ref.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.15 + Math.sin(time * 0.3) * 0.05;
    }
    
    if (nebula2Ref.current) {
      nebula2Ref.current.rotation.z = -time * 0.015;
      const material = nebula2Ref.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.12 + Math.sin(time * 0.4 + 1) * 0.04;
    }
    
    if (nebula3Ref.current) {
      nebula3Ref.current.rotation.z = time * 0.01;
      const material = nebula3Ref.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.1 + Math.sin(time * 0.5 + 2) * 0.03;
    }
  });

  // Create radial gradient texture
  const createNebulaTexture = (color1: string, color2: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(0.5, color2);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

  const purpleNebula = createNebulaTexture('rgba(147, 51, 234, 0.4)', 'rgba(107, 70, 193, 0.2)');
  const pinkNebula = createNebulaTexture('rgba(236, 72, 153, 0.3)', 'rgba(244, 114, 182, 0.15)');
  const blueNebula = createNebulaTexture('rgba(59, 130, 246, 0.35)', 'rgba(96, 165, 250, 0.18)');

  return (
    <group position={[0, 0, -15]}>
      {/* Purple Nebula Layer */}
      <mesh ref={nebula1Ref} position={[5, 3, 0]}>
        <planeGeometry args={[25, 25]} />
        <meshBasicMaterial
          map={purpleNebula}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Pink Nebula Layer */}
      <mesh ref={nebula2Ref} position={[-4, -2, -2]}>
        <planeGeometry args={[22, 22]} />
        <meshBasicMaterial
          map={pinkNebula}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Blue Nebula Layer */}
      <mesh ref={nebula3Ref} position={[0, 0, -4]}>
        <planeGeometry args={[28, 28]} />
        <meshBasicMaterial
          map={blueNebula}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export default SpaceNebula;
