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
          <CameraController mode={mode} fov={cameraFov} position={cameraPosition} />
          <SceneLighting mode={mode} lightColor={lightColor} accentColor={accentColor} />
          
          {/* Conditional chamber rendering */}
          {mode === 'hero' && <ChamberAtrium lightColor={lightColor} />}
          {mode === 'mindcraft' && <ChamberMastery lightColor={lightColor} accentColor={accentColor} />}
          {mode === 'objects' && <ChamberVault lightColor={lightColor} />}
          {mode === 'doctrine' && <ChamberDoctrine lightColor={lightColor} />}
          {mode === 'circle' && <ChamberInner lightColor={lightColor} />}
          
          <Environment preset="city" />
          
          {/* Environmental particles - subtle gold sparkle */}
          <Stars 
            radius={50} 
            depth={50} 
            count={300} 
            factor={2} 
            saturation={0} 
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
