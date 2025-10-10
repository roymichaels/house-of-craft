import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { InteractiveRelic } from "@/components/3d/InteractiveRelic";
import { relics } from "@/data/relics";
import { TempleColumns } from "../3d/effects/TempleColumns";
import { LatinInscription } from "../3d/LatinInscription";

interface ChamberMasteryProps {
  lightColor: string;
  accentColor: string;
}

const ChamberMastery = ({ lightColor, accentColor }: ChamberMasteryProps) => {
  const groupRef = useRef<THREE.Group>(null);

  // Orbiting relics animation
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.rotation.y = time * 0.2;
    }
  });

  const relicConfigs = [
    { position: [3, 0, 0] as [number, number, number], data: relics.watch, color: "#C4A661", scale: 0.6 },
    { position: [0, 0, 3] as [number, number, number], data: relics.pen, color: "#7A6A4F", scale: 0.5 },
    { position: [-3, 0, 0] as [number, number, number], data: relics.ring, color: "#A08968", scale: 0.55 },
    { position: [0, 0, -3] as [number, number, number], data: relics.seal, color: "#D4B86A", scale: 0.65 }
  ];

  return (
    <group ref={groupRef}>
      {/* Roman Temple Columns - Circular layout for orbital relics */}
      <TempleColumns layout="circular" count={6} radius={10} height={11} lightColor={lightColor} />
      
      {/* Latin Inscription */}
      <LatinInscription mode="mindcraft" position={[0, 3.5, -4]} />
      
      {/* Orbiting Relics */}
      {relicConfigs.map((config) => (
        <InteractiveRelic
          key={config.data.id}
          geometry={new THREE.SphereGeometry(config.scale, 32, 32)}
          material={new THREE.MeshStandardMaterial({
            color: config.color,
            roughness: 0.3,
            metalness: 0.7,
            emissive: config.color,
            emissiveIntensity: 0.2
          })}
          position={config.position}
          scale={config.scale}
          userData={{
            title: config.data.title,
            category: config.data.category,
            description: config.data.description,
            image: config.data.image,
            story: config.data.story,
            price: config.data.price
          }}
          glowColor={lightColor}
        />
      ))}
    </group>
  );
};

export default ChamberMastery;
