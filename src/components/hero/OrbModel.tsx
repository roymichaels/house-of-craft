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
      // Slow continuous rotation of entire group
      groupRef.current.rotation.y += rotationSpeed * 0.005;
      
      // Breathing animation
      const breathe = Math.sin(state.clock.elapsedTime * (Math.PI / 2)) * 0.015;
      groupRef.current.scale.setScalar(1 + breathe);
    }

    // Individual ring rotations - creating dynamic movement
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += 0.003;
      ring1Ref.current.rotation.y += 0.002;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x -= 0.004;
      ring2Ref.current.rotation.z += 0.003;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y += 0.005;
      ring3Ref.current.rotation.z -= 0.002;
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
      {/* Central Orb - Core of mastery */}
      <mesh ref={orbRef} position={[0, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshPhysicalMaterial
          color={lightColor}
          metalness={0.9}
          roughness={0.2}
          envMapIntensity={2.5}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          emissive={lightColor}
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Obsidian inner sphere - depth */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshPhysicalMaterial
          color="#1a1a1a"
          metalness={0.95}
          roughness={0.3}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Ring 1 - Outer orbit (Gold) */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.5, 0.03, 16, 100]} />
        <meshPhysicalMaterial
          color={lightColor}
          metalness={0.95}
          roughness={0.15}
          envMapIntensity={2.0}
          emissive={lightColor}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Ring 2 - Middle orbit (Silver) */}
      <mesh ref={ring2Ref} rotation={[0, Math.PI / 3, Math.PI / 4]}>
        <torusGeometry args={[1.3, 0.025, 16, 100]} />
        <meshPhysicalMaterial
          color="#B9B9B9"
          metalness={0.98}
          roughness={0.1}
          envMapIntensity={2.5}
          emissive="#B9B9B9"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Ring 3 - Inner orbit (Gold, thinner) */}
      <mesh ref={ring3Ref} rotation={[Math.PI / 6, Math.PI / 2, 0]}>
        <torusGeometry args={[1.1, 0.02, 16, 100]} />
        <meshPhysicalMaterial
          color={lightColor}
          metalness={0.92}
          roughness={0.2}
          envMapIntensity={1.8}
          emissive={lightColor}
          emissiveIntensity={0.06}
        />
      </mesh>

      {/* Accent points - 8 orbiting particles */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * Math.PI) / 4;
        const radius = 1.8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <mesh key={i} position={[x, 0, z]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial
              color={lightColor}
              metalness={0.95}
              roughness={0.1}
              emissive={lightColor}
              emissiveIntensity={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default OrbModel;
