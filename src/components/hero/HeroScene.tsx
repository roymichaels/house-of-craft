import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment } from "@react-three/drei";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";
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
          <EffectComposer>
            <DepthOfField
              focusDistance={0}
              focalLength={0.02}
              bokehScale={2}
              height={480}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroScene;
