import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import OrbModel from "../hero/OrbModel";
import { Pillars } from "../3d/effects/Pillars";
import { LatinInscription } from "../3d/LatinInscription";

interface ChamberAtriumProps {
  lightColor: string;
}

const ChamberAtrium = ({ lightColor }: ChamberAtriumProps) => {
  const pillarsRef = useRef<THREE.Group>(null);

  // Gentle pillar emergence animation
  useFrame((state) => {
    if (pillarsRef.current) {
      const time = state.clock.getElapsedTime();
      pillarsRef.current.children.forEach((pillar, i) => {
        pillar.position.y = Math.sin(time * 0.3 + i) * 0.1;
      });
    }
  });

  // Create 6 distant pillars in a circle
  const pillars = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2;
    const radius = 18;
    return {
      position: [
        Math.cos(angle) * radius,
        -3,
        Math.sin(angle) * radius
      ] as [number, number, number],
      key: i
    };
  });

  return (
    <group>
      {/* Central Orb */}
      <OrbModel rotationSpeed={0.3} lightColor={lightColor} />
      
      {/* Roman Pillars */}
      <Pillars count={8} radius={12} height={10} lightColor={lightColor} />
      
      {/* Latin Inscription */}
      <LatinInscription mode="hero" position={[0, 3, -8]} />
    </group>
  );
};

export default ChamberAtrium;
