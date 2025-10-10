import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import SolarSystem from "./SolarSystem";
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
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        shadows="soft"
        className="w-full h-full"
      >
        <color attach="background" args={['#000814']} />
        <fog attach="fog" args={['#000814', 180, 250]} />
        
        <Suspense fallback={null}>
          <PerspectiveCamera 
            makeDefault 
            position={[0, 20, 80]} 
            fov={75}
            near={0.1}
            far={1000}
          />
          
          {/* Lighting matching original repo */}
          <ambientLight intensity={0.5} color={new THREE.Color(0.13, 0.13, 0.13)} />
          <pointLight 
            position={[0, 0, 0]} 
            intensity={10} 
            distance={1000} 
            decay={0.5}
            color={new THREE.Color(1.0, 1.0, 1.0)}
          />
          <pointLight
            position={[50, 50, -100]}
            intensity={2}
            distance={100}
            decay={1}
            color={new THREE.Color(0.2, 0.4, 1.0)}
          />
          
          {/* Solar System */}
          <SolarSystem rotationSpeed={rotationSpeed} />
          
          {/* Post-processing effects */}
          <EffectComposer>
            <Bloom 
              intensity={1.5}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
          </EffectComposer>
          
          {/* Interactive controls */}
          <OrbitControls
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.3}
            zoomSpeed={0.8}
            panSpeed={0.5}
            minDistance={10}
            maxDistance={300}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroScene;
