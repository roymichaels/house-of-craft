import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ChamberMasteryProps {
  lightColor: string;
  accentColor: string;
}

const ChamberMastery = ({ lightColor, accentColor }: ChamberMasteryProps) => {
  const relicsRef = useRef<THREE.Group>(null);

  // Orbiting relics animation
  useFrame((state) => {
    if (relicsRef.current) {
      const time = state.clock.getElapsedTime();
      relicsRef.current.rotation.y = time * 0.2;
    }
  });

  // 4 relics: Watch, Pen, Ring, Seal
  const relics = [
    { position: [3, 0, 0], color: "#C4A661", scale: 0.6, name: "watch" },
    { position: [0, 0, 3], color: "#7A6A4F", scale: 0.5, name: "pen" },
    { position: [-3, 0, 0], color: "#A08968", scale: 0.55, name: "ring" },
    { position: [0, 0, -3], color: "#D4B86A", scale: 0.65, name: "seal" }
  ];

  return (
    <group ref={relicsRef}>
      {relics.map((relic, i) => (
        <group key={relic.name} position={relic.position as [number, number, number]}>
          {/* Relic sphere placeholder */}
          <mesh castShadow>
            <sphereGeometry args={[relic.scale, 32, 32]} />
            <meshStandardMaterial 
              color={relic.color}
              roughness={0.3}
              metalness={0.7}
              emissive={relic.color}
              emissiveIntensity={0.2}
            />
          </mesh>
          
          {/* Subtle glow ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
            <ringGeometry args={[relic.scale * 1.2, relic.scale * 1.4, 32]} />
            <meshBasicMaterial 
              color={lightColor}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default ChamberMastery;
