import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Group } from "three";

interface OrbModelProps {
  rotationSpeed: number;
  lightColor: string;
}

const OrbModel = ({ rotationSpeed, lightColor }: OrbModelProps) => {
  const groupRef = useRef<Group>(null);
  const orbRef = useRef<Mesh>(null);
  const ring1Ref = useRef<Mesh>(null);
  const ring2Ref = useRef<Mesh>(null);
  const ring3Ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Slower rotation for ancient mechanical feel
      groupRef.current.rotation.y += rotationSpeed * 0.003;
      
      // Breathing animation
      const breathe = Math.sin(state.clock.elapsedTime * (Math.PI / 2)) * 0.015;
      groupRef.current.scale.setScalar(1 + breathe);
    }

    // Pulsing glow on orb
    if (orbRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.02 + 0.05;
      // @ts-ignore
      orbRef.current.material.emissiveIntensity = pulse;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Astrolabe Core - Dark Bronze */}
      <mesh ref={orbRef} position={[0, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshPhysicalMaterial
          color="#4A4035"
          metalness={0.85}
          roughness={0.35}
          envMapIntensity={1.8}
          clearcoat={0.6}
          clearcoatRoughness={0.25}
          emissive="#4A4035"
          emissiveIntensity={0.03}
        />
      </mesh>

      {/* Obsidian inner sphere - Ancient core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshPhysicalMaterial
          color="#0a0a0a"
          metalness={0.95}
          roughness={0.4}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Ring 1 - Outer bronze astrolabe band - removed individual ref */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.5, 0.04, 16, 100]} />
        <meshPhysicalMaterial
          color="#5A5040"
          metalness={0.9}
          roughness={0.25}
          envMapIntensity={1.5}
          emissive="#5A5040"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Ring 2 - Middle brass band - removed individual ref */}
      <mesh rotation={[0, Math.PI / 3, Math.PI / 4]}>
        <torusGeometry args={[1.3, 0.03, 16, 100]} />
        <meshPhysicalMaterial
          color="#B8860B"
          metalness={0.88}
          roughness={0.2}
          envMapIntensity={1.7}
          emissive="#B8860B"
          emissiveIntensity={0.06}
        />
      </mesh>

      {/* Ring 3 - Inner oxidized copper - removed individual ref */}
      <mesh rotation={[Math.PI / 6, Math.PI / 2, 0]}>
        <torusGeometry args={[1.1, 0.025, 16, 100]} />
        <meshPhysicalMaterial
          color="#7A6A4F"
          metalness={0.85}
          roughness={0.3}
          envMapIntensity={1.4}
          emissive="#7A6A4F"
          emissiveIntensity={0.04}
        />
      </mesh>

      {/* Vita flames - 4 red accent spheres at cardinal points */}
      {[...Array(4)].map((_, i) => {
        const angle = (i * Math.PI) / 2;
        const radius = 1.65;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <mesh key={i} position={[x, 0, z]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial
              color="#C73E3A"
              metalness={0.9}
              roughness={0.15}
              emissive="#C73E3A"
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default OrbModel;
