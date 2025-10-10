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
      {/* Planet - using basic material for maximum brightness */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial
          color={color}
          toneMapped={false}
        />
      </mesh>

      {/* Massive planet light sources */}
      <pointLight
        position={[0, 0, 0]}
        color={color}
        intensity={radius * 200}
        distance={radius * 100}
        decay={0.1}
      />

      <pointLight
        position={[0, 0, 0]}
        color={color}
        intensity={radius * 150}
        distance={radius * 80}
        decay={0.2}
      />

      <pointLight
        position={[0, 0, 0]}
        color={color}
        intensity={radius * 100}
        distance={radius * 60}
        decay={0.3}
      />

      {/* Saturn's rings */}
      {rings && (
        <>
          <mesh rotation={[Math.PI / 2.5, 0, 0]}>
            <ringGeometry args={[radius * 1.5, radius * 2.2, 64]} />
            <meshBasicMaterial
              color="#FFE4B5"
              transparent
              opacity={1}
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          </mesh>
          <pointLight
            position={[0, 0, 0]}
            color="#FFE4B5"
            intensity={radius * 120}
            distance={radius * 50}
            decay={0.2}
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
          >
            <sphereGeometry args={[moon.radius, 32, 32]} />
            <meshBasicMaterial
              color={moon.color}
              toneMapped={false}
            />
          </mesh>
          <pointLight
            position={[0, 0, 0]}
            color={moon.color}
            intensity={moon.radius * 180}
            distance={moon.radius * 80}
            decay={0.2}
          />
          <pointLight
            position={[0, 0, 0]}
            color={moon.color}
            intensity={moon.radius * 120}
            distance={moon.radius * 60}
            decay={0.3}
          />
        </group>
      ))}
    </group>
  );
};

export default Planet;
