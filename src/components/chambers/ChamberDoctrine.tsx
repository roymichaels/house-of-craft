import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { LightColumns } from "../3d/effects/LightColumns";
import { LatinInscription } from "../3d/LatinInscription";

interface ChamberDoctrineProps {
  lightColor: string;
}

const ChamberDoctrine = ({ lightColor }: ChamberDoctrineProps) => {
  const tabletsRef = useRef<(THREE.Mesh | null)[]>([]);

  // Floating animation for tablets
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    tabletsRef.current.forEach((tablet, i) => {
      if (tablet) {
        tablet.position.y = i * 1.5 + Math.sin(time * 0.4 + i * 1.5) * 0.15;
        tablet.rotation.y = Math.sin(time * 0.2 + i) * 0.1;
      }
    });
  });

  // 3 floating marble tablets
  const tablets = Array.from({ length: 3 }, (_, i) => ({
    position: [
      (i - 1) * 2.5,
      i * 1.5,
      -2
    ] as [number, number, number],
    key: i
  }));

  return (
    <group>
      {/* Minimal Light Columns - Focus on tablets */}
      <LightColumns lightColor={lightColor} intensity={0.4} />
      
      {/* Latin Inscription */}
      <LatinInscription mode="doctrine" position={[0, 4, -3]} />
      
      {/* Floating Tablets */}
      {tablets.map((tablet) => (
        <group key={tablet.key}>
          <mesh 
            ref={(el) => tabletsRef.current[tablet.key] = el}
            position={tablet.position}
            castShadow
          >
            <boxGeometry args={[1.8, 2.4, 0.15]} />
            <meshStandardMaterial 
              color="#e8e4dc"
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
          
          {/* Golden edge glow */}
          <mesh position={tablet.position}>
            <boxGeometry args={[1.85, 2.45, 0.12]} />
            <meshBasicMaterial 
              color={lightColor}
              transparent
              opacity={0.2}
              side={THREE.BackSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default ChamberDoctrine;
