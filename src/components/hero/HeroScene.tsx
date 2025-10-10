import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment, Stars, Points } from "@react-three/drei";
import OrbModel from "./OrbModel";
import SceneLighting from "./SceneLighting";
import CameraController from "./CameraController";
import * as THREE from "three";

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
        shadows
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <CameraController fov={cameraFov} position={cameraPosition} />
          <SceneLighting lightColor={lightColor} accentColor={accentColor} />
          <OrbModel 
            rotationSpeed={rotationSpeed} 
            lightColor={lightColor}
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

          {/* Ambient dust particles */}
          <Points limit={250}>
            <pointsMaterial
              size={0.02}
              color="#C4A661"
              transparent
              opacity={0.3}
              sizeAttenuation
              blending={THREE.AdditiveBlending}
            />
            {Array.from({ length: 250 }).map((_, i) => (
              <point
                key={i}
                position={[
                  (Math.random() - 0.5) * 20,
                  (Math.random() - 0.5) * 20,
                  (Math.random() - 0.5) * 20,
                ]}
              />
            ))}
          </Points>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroScene;
