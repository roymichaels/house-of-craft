import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { SpotLight, PointLight } from "three";

interface SceneLightingProps {
  lightColor: string;
  accentColor: string;
}

const SceneLighting = ({ lightColor, accentColor }: SceneLightingProps) => {
  const keyLightRef = useRef<SpotLight>(null);
  const sweepLightRef = useRef<SpotLight>(null);
  const jewelLightRef = useRef<PointLight>(null);

  useFrame((state) => {
    if (keyLightRef.current) {
      // Gentle oscillation of key light
      const oscillation = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
      keyLightRef.current.position.x = 5 + oscillation;
    }

    // Sweeping sunlight effect (40s loop simulating day)
    if (sweepLightRef.current) {
      const sweepAngle = (state.clock.elapsedTime / 40) * Math.PI * 2;
      const sweepRadius = 6;
      sweepLightRef.current.position.x = Math.cos(sweepAngle) * sweepRadius;
      sweepLightRef.current.position.z = Math.sin(sweepAngle) * sweepRadius;
    }

    // Pulsating jewel light synced with heartbeat (every 3s)
    if (jewelLightRef.current) {
      const heartbeat = Math.sin(state.clock.elapsedTime * (Math.PI / 1.5));
      const pulse = 0.3 + heartbeat * 0.2;
      jewelLightRef.current.intensity = pulse;
    }
    
    // Sync key light intensity with heartbeat
    if (keyLightRef.current) {
      const flicker = 0.8 + Math.sin(state.clock.elapsedTime * (Math.PI / 3)) * 0.1;
      keyLightRef.current.intensity = flicker;
    }
  });

  return (
    <>
      {/* Key light - main golden spotlight */}
      <spotLight
        ref={keyLightRef}
        position={[5, 5, 5]}
        color={lightColor}
        intensity={0.8}
        angle={0.6}
        penumbra={0.5}
        castShadow
      />

      {/* Sweeping daylight - simulates sun movement */}
      <spotLight
        ref={sweepLightRef}
        position={[6, 4, 0]}
        color="#FFF4E0"
        intensity={0.5}
        angle={0.4}
        penumbra={0.8}
      />
      
      {/* Fill light - soft ambient (increased for fog compensation) */}
      <ambientLight intensity={0.35} />
      
      {/* Rim light - accent separation */}
      <directionalLight
        position={[-5, 2, -5]}
        color={accentColor}
        intensity={0.4}
      />
      
      {/* Top light for highlights */}
      <pointLight
        position={[0, 8, 0]}
        color="#ffffff"
        intensity={0.2}
      />

      {/* Jewel accent light - pulsating ruby glow */}
      <pointLight
        ref={jewelLightRef}
        position={[0, 1.2, 0.5]}
        color="#C73E3A"
        intensity={0.3}
        distance={1}
      />

      {/* Rim lighting behind watch for silhouette glow */}
      <pointLight
        position={[0, 0, -2]}
        color={lightColor}
        intensity={0.4}
        distance={5}
      />

      {/* Native Three.js fog for atmospheric depth */}
      <fog attach="fog" args={["#0C0C0C", 5, 15]} />
    </>
  );
};

export default SceneLighting;
