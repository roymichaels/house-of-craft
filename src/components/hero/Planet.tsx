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
          emissive={emissive || color}
          emissiveIntensity={emissive ? 0.6 : 0.4}
          roughness={0.5}
          metalness={0.4}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Saturn's rings */}
      {rings && (
        <mesh rotation={[Math.PI / 2.5, 0, 0]} castShadow receiveShadow>
          <ringGeometry args={[radius * 1.5, radius * 2.2, 64]} />
          <meshStandardMaterial
            color="#D4B896"
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      )}

      {/* Moons */}
      {moons.map((moon, index) => (
        <mesh
          key={moon.name}
          ref={(el) => {
            if (el) moonRefs.current[index] = el;
          }}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[moon.radius, 32, 32]} />
          <meshStandardMaterial
            color={moon.color}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
};

export default Planet;
