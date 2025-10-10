import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment, Stars } from "@react-three/drei";
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
          {/* Apollinean atmosphere - fog for depth */}
          <fog attach="fog" args={['#000000', 5, 25]} />
          
          <CameraController mode={mode} fov={cameraFov} position={cameraPosition} />
          <SceneLighting mode={mode} lightColor={lightColor} accentColor={accentColor} />
          
          {/* Unified Temple - All chambers always rendered in 3D space */}
          <group name="apollon-temple">
            <group position={[0, 0, 0]}>
              <ChamberAtrium lightColor={lightColor} />
            </group>
            <group position={[15, 2, -5]}>
              <ChamberMastery lightColor={lightColor} accentColor={accentColor} />
            </group>
            <group position={[-12, -1, -10]}>
              <ChamberVault lightColor={lightColor} />
            </group>
            <group position={[-15, 3, 5]}>
              <ChamberDoctrine lightColor={lightColor} />
            </group>
            <group position={[0, 10, -8]}>
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
