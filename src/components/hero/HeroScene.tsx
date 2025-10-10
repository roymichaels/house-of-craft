import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment } from "@react-three/drei";
import WatchModel from "./WatchModel";
import SceneLighting from "./SceneLighting";
import CameraController from "./CameraController";

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
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <CameraController fov={cameraFov} position={cameraPosition} />
          <SceneLighting lightColor={lightColor} accentColor={accentColor} />
          <WatchModel rotationSpeed={rotationSpeed} lightColor={lightColor} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroScene;
