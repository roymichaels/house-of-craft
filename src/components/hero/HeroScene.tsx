import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment, Stars } from "@react-three/drei";
import WatchModel from "./WatchModel";
import SceneLighting from "./SceneLighting";
import CameraController from "./CameraController";

interface HeroSceneProps {
  rotationSpeed: number;
  lightColor: string;
  accentColor: string;
  cameraFov: number;
  cameraPosition: { x: number; y: number; z: number };
  showRealTime: boolean;
  showBalanceWheel: boolean;
  showGears: boolean;
  handStyle: string;
}

const HeroScene = ({
  rotationSpeed,
  lightColor,
  accentColor,
  cameraFov,
  cameraPosition,
  showRealTime,
  showBalanceWheel,
  showGears,
  handStyle,
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
        shadows
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <CameraController fov={cameraFov} position={cameraPosition} />
          <SceneLighting lightColor={lightColor} accentColor={accentColor} />
          <WatchModel 
            rotationSpeed={rotationSpeed} 
            lightColor={lightColor}
            showRealTime={showRealTime}
            showBalanceWheel={showBalanceWheel}
            showGears={showGears}
            handStyle={handStyle}
          />
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
          
          {/* Native fog for depth (managed in SceneLighting) */}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroScene;
