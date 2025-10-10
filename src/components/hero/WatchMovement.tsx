import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Group } from "three";

interface WatchMovementProps {
  showRealTime: boolean;
  showBalanceWheel: boolean;
  showGears: boolean;
  handStyle: string;
  lightColor: string;
}

const WatchMovement = ({ 
  showRealTime, 
  showBalanceWheel, 
  showGears,
  handStyle,
  lightColor 
}: WatchMovementProps) => {
  const hourHandRef = useRef<Mesh>(null);
  const minuteHandRef = useRef<Mesh>(null);
  const secondHandRef = useRef<Mesh>(null);
  const balanceWheelRef = useRef<Group>(null);
  const gearRef1 = useRef<Mesh>(null);
  const gearRef2 = useRef<Mesh>(null);

  useFrame((state) => {
    if (showRealTime) {
      // Real-time clock mode
      const now = new Date();
      const hours = now.getHours() % 12;
      const minutes = now.getMinutes();
      const seconds = now.getSeconds() + now.getMilliseconds() / 1000;

      if (hourHandRef.current) {
        hourHandRef.current.rotation.z = -(hours * Math.PI / 6) - (minutes * Math.PI / 360);
      }
      if (minuteHandRef.current) {
        minuteHandRef.current.rotation.z = -(minutes * Math.PI / 30) - (seconds * Math.PI / 1800);
      }
      if (secondHandRef.current) {
        secondHandRef.current.rotation.z = -(seconds * Math.PI / 30);
      }
    } else {
      // Art loop mode (30-second cycle)
      const loopTime = (state.clock.elapsedTime % 30) / 30;
      
      if (hourHandRef.current) {
        hourHandRef.current.rotation.z = -loopTime * Math.PI * 2;
      }
      if (minuteHandRef.current) {
        minuteHandRef.current.rotation.z = -loopTime * Math.PI * 24;
      }
      if (secondHandRef.current) {
        secondHandRef.current.rotation.z = -loopTime * Math.PI * 120;
      }
    }

    // Balance wheel oscillation (4Hz watchmaker rhythm)
    if (balanceWheelRef.current && showBalanceWheel) {
      const oscillation = Math.sin(state.clock.elapsedTime * 8 * Math.PI) * 0.4;
      balanceWheelRef.current.rotation.z = oscillation;
    }

    // Gears rotation
    if (gearRef1.current && showGears) {
      gearRef1.current.rotation.z += 0.005;
    }
    if (gearRef2.current && showGears) {
      gearRef2.current.rotation.z -= 0.003;
    }
  });

  // Material settings based on hand style
  const getHandMaterial = () => {
    if (handStyle === 'light') {
      return {
        color: lightColor,
        emissive: lightColor,
        emissiveIntensity: 0.5,
        metalness: 0.2,
        roughness: 0.3,
      };
    }
    return {
      color: lightColor,
      metalness: 0.95,
      roughness: 0.1,
    };
  };

  const handMaterial = getHandMaterial();

  return (
    <group position={[0, 0, 0.15]}>
      {/* Skeleton gears (background layer) */}
      {showGears && (
        <>
          <mesh ref={gearRef1} position={[0.4, 0.3, -0.05]}>
            <torusGeometry args={[0.15, 0.02, 16, 32]} />
            <meshStandardMaterial
              color={lightColor}
              metalness={0.8}
              roughness={0.3}
              opacity={0.4}
              transparent
            />
          </mesh>
          <mesh ref={gearRef2} position={[-0.3, -0.25, -0.05]}>
            <torusGeometry args={[0.12, 0.015, 16, 32]} />
            <meshStandardMaterial
              color={lightColor}
              metalness={0.8}
              roughness={0.3}
              opacity={0.3}
              transparent
            />
          </mesh>
        </>
      )}

      {/* Hour hand */}
      <mesh ref={hourHandRef} position={[0, 0, 0.02]}>
        <boxGeometry args={[0.03, 0.5, 0.02]} />
        <meshStandardMaterial {...handMaterial} />
      </mesh>

      {/* Minute hand */}
      <mesh ref={minuteHandRef} position={[0, 0, 0.03]}>
        <boxGeometry args={[0.025, 0.7, 0.02]} />
        <meshStandardMaterial {...handMaterial} />
      </mesh>

      {/* Second hand (thinner, slightly different color) */}
      {handStyle !== 'minimal' && (
        <mesh ref={secondHandRef} position={[0, 0, 0.04]}>
          <boxGeometry args={[0.015, 0.75, 0.015]} />
          <meshStandardMaterial
            color="#C73E3A"
            metalness={0.9}
            roughness={0.1}
            emissive="#C73E3A"
            emissiveIntensity={0.2}
          />
        </mesh>
      )}

      {/* Balance wheel (oscillating jewel at 12 o'clock) */}
      {showBalanceWheel && (
        <group ref={balanceWheelRef} position={[0, 0.6, 0.05]}>
          <mesh>
            <torusGeometry args={[0.08, 0.015, 16, 32]} />
            <meshStandardMaterial
              color="#C73E3A"
              metalness={0.7}
              roughness={0.2}
              emissive="#C73E3A"
              emissiveIntensity={0.3}
            />
          </mesh>
          {/* Ruby jewel center */}
          <mesh position={[0, 0, 0.01]}>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshPhysicalMaterial
              color="#8B0000"
              metalness={0.1}
              roughness={0.05}
              transmission={0.9}
              thickness={0.5}
              ior={2.4}
              emissive="#C73E3A"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      )}

      {/* Center jewel bearing */}
      <mesh position={[0, 0, 0.08]}>
        <sphereGeometry args={[0.04, 32, 32]} />
        <meshPhysicalMaterial
          color="#4A4A4A"
          metalness={0.3}
          roughness={0.05}
          transmission={0.8}
          thickness={0.3}
          ior={2.0}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </group>
  );
};

export default WatchMovement;
