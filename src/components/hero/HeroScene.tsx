import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment, Stars } from "@react-three/drei";
import * as THREE from "three";
import SceneLighting from "./SceneLighting";
import CameraController from "./CameraController";
import AmbientDust from "./AmbientDust";
import { useSceneStore } from "@/contexts/SceneContext";
import ChamberAtrium from "@/components/chambers/ChamberAtrium";
import ChamberMastery from "@/components/chambers/ChamberMastery";
import ChamberVault from "@/components/chambers/ChamberVault";
import ChamberDoctrine from "@/components/chambers/ChamberDoctrine";
import ChamberInner from "@/components/chambers/ChamberInner";

interface HeroSceneProps {
  rotationSpeed: number;
  lightColor: string;
  accentColor: string;
  cameraFov: number;
  cameraPosition: { x: number; y: number; z: number };
}

const HeroScene = ({
  rotationSpeed,
  lightColor,
  accentColor,
  cameraFov,
  cameraPosition,
}: HeroSceneProps) => {
  const mode = useSceneStore(state => state.mode);
  
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        shadows
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          {/* Apollinean atmosphere - extended fog for unified temple (dimmer) */}
          <fog attach="fog" args={['#000000', 8, 30]} />
          
          <CameraController mode={mode} fov={cameraFov} position={cameraPosition} />
          <SceneLighting mode={mode} lightColor={lightColor} accentColor={accentColor} />
          
          {/* Unified Temple - All chambers in one connected space */}
          <group name="apollon-temple">
            {/* Central Atrium */}
            <group position={[0, 1.5, 0]}>
              <ChamberAtrium lightColor={lightColor} />
            </group>

            {/* East Wing - Mastery */}
            <group position={[8, 0, -3]}>
              <ChamberMastery lightColor={lightColor} accentColor={accentColor} />
            </group>

            {/* West Gallery - Vault */}
            <group position={[-8, 0, -3]}>
              <ChamberVault lightColor={lightColor} />
            </group>

            {/* Upper Terrace - Doctrine */}
            <group position={[0, 4, -6]}>
              <ChamberDoctrine lightColor={lightColor} />
            </group>

            {/* Inner Sanctum - Circle */}
            <group position={[0, 8, -4]}>
              <ChamberInner lightColor={lightColor} />
            </group>
          </group>
          
          <Environment preset="city" />
          
          {/* Environmental particles - subtle golden tint for Apollinean atmosphere */}
          <Stars 
            radius={50} 
            depth={50} 
            count={500} 
            factor={2} 
            saturation={0.1} 
            fade 
            speed={0.3}
          />

          {/* Ambient dust particles */}
          <AmbientDust />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroScene;
