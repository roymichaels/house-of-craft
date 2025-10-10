import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { SpotLight } from "three";

interface SceneLightingProps {
  lightColor: string;
  accentColor: string;
}

const SceneLighting = ({ lightColor, accentColor }: SceneLightingProps) => {
  const keyLightRef = useRef<SpotLight>(null);

  useFrame((state) => {
    if (keyLightRef.current) {
      // Gentle oscillation of key light
      const oscillation = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
      keyLightRef.current.position.x = 5 + oscillation;
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
      
      {/* Fill light - soft ambient */}
      <ambientLight intensity={0.3} />
      
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
    </>
  );
};

export default SceneLighting;
