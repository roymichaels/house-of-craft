import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import WatchMovement from "./WatchMovement";

interface WatchModelProps {
  rotationSpeed: number;
  lightColor: string;
  showRealTime: boolean;
  showBalanceWheel: boolean;
  showGears: boolean;
  handStyle: string;
}

const WatchModel = ({ 
  rotationSpeed, 
  lightColor,
  showRealTime,
  showBalanceWheel,
  showGears,
  handStyle
}: WatchModelProps) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Slow continuous rotation
      meshRef.current.rotation.y += rotationSpeed * 0.01;
      
      // Enhanced breathing animation (4s cycle, synced with heartbeat)
      const breathe = Math.sin(state.clock.elapsedTime * (Math.PI / 2)) * 0.015;
      meshRef.current.scale.setScalar(1 + breathe);
    }
  });

  return (
    <group>
      {/* Watch case - torus bezel with enhanced material */}
      <mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[1.2, 0.4, 32, 100]} />
        <meshPhysicalMaterial
          color={lightColor}
          metalness={0.95}
          roughness={0.15}
          envMapIntensity={2.0}
          clearcoat={0.4}
          clearcoatRoughness={0.08}
          emissive={lightColor}
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Hour markers (12 positions) */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * Math.PI) / 6;
        const radius = 1.05;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const isMainMarker = i % 3 === 0;
        
        return (
          <mesh
            key={i}
            position={[x, y, 0.05]}
            rotation={[0, 0, -angle]}
          >
            <boxGeometry args={[0.03, isMainMarker ? 0.15 : 0.1, 0.02]} />
            <meshStandardMaterial
              color={lightColor}
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>
        );
      })}
      
      {/* Inner dial - deeper for more dimension */}
      <mesh position={[0, 0, 0.08]}>
        <circleGeometry args={[0.9, 64]} />
        <meshStandardMaterial
          color="#0C0C0C"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Watch Movement - hands, gears, jewels */}
      <WatchMovement 
        showRealTime={showRealTime}
        showBalanceWheel={showBalanceWheel}
        showGears={showGears}
        handStyle={handStyle}
        lightColor={lightColor}
      />
    </group>
  );
};

export default WatchModel;
