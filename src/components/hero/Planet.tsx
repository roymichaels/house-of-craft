import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MoonData } from "@/data/solarSystemConfig";

interface PlanetProps {
  name: string;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  color: string;
  emissive?: string;
  rings?: boolean;
  moons?: MoonData[];
  speedMultiplier?: number;
}

const Planet = ({
  radius,
  orbitRadius,
  orbitSpeed,
  rotationSpeed,
  color,
  emissive,
  rings = false,
  moons = [],
  speedMultiplier = 1,
}: PlanetProps) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const moonRefs = useRef<THREE.Mesh[]>([]);
  
  // Initialize orbital angle randomly for variety
  const initialAngle = useMemo(() => Math.random() * Math.PI * 2, []);
  const orbitAngleRef = useRef(initialAngle);

  useFrame((state, delta) => {
    // Update orbital position
    orbitAngleRef.current += orbitSpeed * speedMultiplier * delta * 0.1;
    
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(orbitAngleRef.current) * orbitRadius;
      groupRef.current.position.z = Math.sin(orbitAngleRef.current) * orbitRadius;
    }

    // Rotate planet on its axis
    if (planetRef.current) {
      planetRef.current.rotation.y += rotationSpeed * speedMultiplier;
    }

    // Rotate moons around planet
    moons.forEach((moon, index) => {
      if (moonRefs.current[index]) {
        const moonAngle = state.clock.getElapsedTime() * moon.orbitSpeed * speedMultiplier;
        moonRefs.current[index].position.x = Math.cos(moonAngle) * moon.orbitRadius;
        moonRefs.current[index].position.z = Math.sin(moonAngle) * moon.orbitRadius;
        moonRefs.current[index].rotation.y += 0.01 * speedMultiplier;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Planet */}
      <mesh ref={planetRef} castShadow receiveShadow>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={15}
          roughness={0.1}
          metalness={0.9}
          envMapIntensity={10}
          toneMapped={false}
        />
      </mesh>

      {/* Individual planet light source - extremely bright */}
      <pointLight
        position={[0, 0, 0]}
        color={color}
        intensity={radius * 50}
        distance={radius * 30}
        decay={0.5}
      />

      {/* Secondary planet glow */}
      <pointLight
        position={[0, 0, 0]}
        color={color}
        intensity={radius * 30}
        distance={radius * 20}
        decay={0.3}
      />

      {/* Saturn's rings */}
      {rings && (
        <>
          <mesh rotation={[Math.PI / 2.5, 0, 0]} castShadow receiveShadow>
            <ringGeometry args={[radius * 1.5, radius * 2.2, 64]} />
            <meshStandardMaterial
              color="#D4B896"
              emissive="#D4B896"
              emissiveIntensity={8}
              transparent
              opacity={1}
              side={THREE.DoubleSide}
              roughness={0.2}
              metalness={0.6}
              toneMapped={false}
            />
          </mesh>
          {/* Ring glow light */}
          <pointLight
            position={[0, 0, 0]}
            color="#D4B896"
            intensity={radius * 25}
            distance={radius * 15}
          />
        </>
      )}

      {/* Moons */}
      {moons.map((moon, index) => (
        <group key={moon.name}>
          <mesh
            ref={(el) => {
              if (el) moonRefs.current[index] = el;
            }}
            castShadow
            receiveShadow
          >
            <sphereGeometry args={[moon.radius, 32, 32]} />
            <meshStandardMaterial
              color={moon.color}
              emissive={moon.color}
              emissiveIntensity={12}
              roughness={0.2}
              metalness={0.8}
              toneMapped={false}
            />
          </mesh>
          <pointLight
            position={[0, 0, 0]}
            color={moon.color}
            intensity={moon.radius * 40}
            distance={moon.radius * 25}
            decay={0.4}
          />
        </group>
      ))}
    </group>
  );
};

export default Planet;
