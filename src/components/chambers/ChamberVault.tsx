import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { InteractiveRelic } from "@/components/3d/InteractiveRelic";
import { relics } from "@/data/relics";
import { TempleColumns } from "../3d/effects/TempleColumns";
import { LatinInscription } from "../3d/LatinInscription";

interface ChamberVaultProps {
  lightColor: string;
}

const ChamberVault = ({ lightColor }: ChamberVaultProps) => {
  const relicGroupRefs = useRef<(THREE.Group | null)[]>([]);

  // Gentle floating animation for relics
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    relicGroupRefs.current.forEach((group, i) => {
      if (group) {
        group.position.y = 1.5 + Math.sin(time * 0.5 + i) * 0.05;
      }
    });
  });

  const vaultRelics = Object.values(relics).filter(r => r.chamber === 'vault');

  // 4 pedestals arranged in semi-circle
  const pedestalConfigs = Array.from({ length: 4 }, (_, i) => {
    const angle = (i / 3 - 0.5) * Math.PI * 0.6;
    const radius = 6;
    return {
      position: [
        Math.sin(angle) * radius,
        0,
        Math.cos(angle) * radius - 3
      ] as [number, number, number],
      relicColor: ["#C4A661", "#7A6A4F", "#A08968", "#D4B86A"][i],
      relicData: vaultRelics[i],
      key: i
    };
  });

  return (
    <group>
      {/* Roman Temple Columns - Entrance gateway */}
      <TempleColumns layout="entrance" height={12} lightColor={lightColor} />
      
      {/* Latin Inscription */}
      <LatinInscription mode="objects" position={[0, 3.5, -6]} />
      
      {/* Pedestals and Relics */}
      {pedestalConfigs.map((config) => (
        <group key={config.key} position={config.position}>
          {/* Glass pedestal */}
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.8, 1, 0.8]} />
            <meshPhysicalMaterial 
              color="#1a1a1a"
              transparent
              opacity={0.3}
              roughness={0.1}
              metalness={0.9}
              reflectivity={1}
              clearcoat={1}
            />
          </mesh>
          
          {/* Interactive relic on top */}
          <group ref={(el) => relicGroupRefs.current[config.key] = el} position={[0, 0, 0]}>
            <InteractiveRelic
              geometry={new THREE.SphereGeometry(0.3, 32, 32)}
              material={new THREE.MeshStandardMaterial({
                color: config.relicColor,
                roughness: 0.2,
                metalness: 0.8,
                emissive: config.relicColor,
                emissiveIntensity: 0.3
              })}
              position={[0, 0, 0]}
              scale={0.3}
              userData={{
                title: config.relicData.title,
                category: config.relicData.category,
                description: config.relicData.description,
                image: config.relicData.image,
                story: config.relicData.story,
                price: config.relicData.price
              }}
              glowColor={lightColor}
            />
          </group>
          
          {/* Spotlight base glow */}
          <pointLight 
            position={[0, 1.5, 0]} 
            color={lightColor}
            intensity={0.5}
            distance={3}
          />
        </group>
      ))}
    </group>
  );
};

export default ChamberVault;
