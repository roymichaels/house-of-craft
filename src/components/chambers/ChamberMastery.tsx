import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { InteractiveRelic } from "@/components/3d/InteractiveRelic";
import { relics } from "@/data/relics";
import { LightColumns } from "../3d/effects/LightColumns";
import { SolarHalo } from "../3d/effects/SolarHalo";
import { LatinInscription } from "../3d/LatinInscription";

interface ChamberMasteryProps {
  lightColor: string;
  accentColor: string;
}

const ChamberMastery = ({ lightColor, accentColor }: ChamberMasteryProps) => {
  const relicRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Gentle floating animation for relics
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    relicRefs.current.forEach((relic, i) => {
      if (relic) {
        relic.position.y = Math.sin(time * 0.5 + i) * 0.1;
        relic.rotation.y = time * 0.3 + i;
      }
    });
  });

  // Linear arrangement facing camera
  const relicConfigs = [
    { position: [-2, 0, 0] as [number, number, number], data: relics.watch, color: "#C4A661", scale: 0.6 },
    { position: [-0.7, 0, 0] as [number, number, number], data: relics.pen, color: "#7A6A4F", scale: 0.5 },
    { position: [0.7, 0, 0] as [number, number, number], data: relics.ring, color: "#A08968", scale: 0.55 },
    { position: [2, 0, 0] as [number, number, number], data: relics.seal, color: "#D4B86A", scale: 0.65 }
  ];

  return (
    <group>
      {/* Volumetric Light Columns */}
      <LightColumns lightColor={lightColor} intensity={0.6} />
      
      {/* Solar Halo */}
      <SolarHalo radius={4.5} lightColor={lightColor} intensity={0.8} />
      
      {/* Latin Inscription */}
      <LatinInscription mode="mindcraft" position={[0, 3.5, -2]} />
      
      {/* Linear Relics Display */}
      {relicConfigs.map((config, i) => (
        <group key={config.data.id} position={config.position}>
          <InteractiveRelic
            geometry={new THREE.SphereGeometry(config.scale, 32, 32)}
            material={new THREE.MeshStandardMaterial({
              color: config.color,
              roughness: 0.3,
              metalness: 0.7,
              emissive: config.color,
              emissiveIntensity: 0.2
            })}
            position={[0, 0, 0]}
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
        </group>
      ))}
    </group>
  );
};

export default ChamberMastery;
