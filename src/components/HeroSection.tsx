import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { Suspense } from "react";
import { EffectComposer, Bloom, DepthOfField, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import HeroOverlay from "./hero/HeroOverlay";
import OrbModel from "./hero/OrbModel";
import GoldenParticles from "./hero/GoldenParticles";
import ApollonText3D from "./hero/ApollonText3D";
import FloatingGeometry from "./hero/FloatingGeometry";
import LightRays from "./hero/LightRays";
import ConstellationField from "./hero/ConstellationField";
import MouseLight from "./hero/MouseLight";
import ScrollIndicator from "./hero/ScrollIndicator";
import { useHeroScene } from "@/hooks/useHeroScene";
import Navigation from "./Navigation";
import { useIsMobile } from "@/hooks/use-mobile";

const HeroSection = () => {
  const { data: heroScene, isLoading } = useHeroScene();
  const isMobile = useIsMobile();

  // Default values while loading or if query fails
  const config = heroScene || {
    title: "APOLLON",
    subtitle: "Built to last decades. Forged for men who value time, not trends.",
    rotation_speed: 0.3,
    light_color: "#C4A661",
    accent_color: "#7A6A4F",
    camera_fov: 45,
    camera_position: { x: 0, y: 0, z: 5 },
    cta_text: "Explore Collections",
    cta_link: "#mindcraft",
    show_real_time: false,
    show_balance_wheel: true,
    show_gears: true,
    hand_style: "classic",
    text_delay_ms: 3000,
    show_logo: true,
    logo_text: "APOLLON",
    cta_style: "seal",
  };

  return (
    <div className="h-full flex flex-col justify-between">
      {/* Header */}
      <Navigation />

      {/* 3D Scene with Orb and APOLLON text */}
      <div className="flex-1 relative flex items-center justify-center">
        <Canvas className="absolute inset-0" dpr={[1, isMobile ? 1.5 : 2]}>
          <Suspense fallback={null}>
            <PerspectiveCamera
              makeDefault
              position={[
                config.camera_position.x,
                config.camera_position.y,
                config.camera_position.z,
              ]}
              fov={config.camera_fov}
            />
            
            {/* Lighting Setup */}
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1.2} color={config.light_color} />
            <pointLight position={[-10, -10, -10]} intensity={0.6} color="#7A6A4F" />
            <pointLight position={[0, 5, 5]} intensity={0.8} color="#D4AF37" />
            
            {/* Mouse-responsive lighting */}
            {!isMobile && <MouseLight />}
            
            {/* Background Elements */}
            <ConstellationField />
            <LightRays />
            {!isMobile && <FloatingGeometry />}
            
            {/* Main Orb */}
            <OrbModel
              rotationSpeed={config.rotation_speed}
              lightColor={config.light_color}
            />
            
            {/* APOLLON 3D Text */}
            <ApollonText3D />
            
            {/* Golden Particles */}
            <GoldenParticles count={isMobile ? 150 : 300} />
            
            <Environment preset="sunset" />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.5}
              enableDamping
              dampingFactor={0.05}
            />
            
            {/* Post-processing Effects */}
            <EffectComposer>
              <Bloom
                intensity={isMobile ? 0.8 : 1.2}
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
                mipmapBlur
              />
              {!isMobile && (
                <DepthOfField
                  focusDistance={0.01}
                  focalLength={0.05}
                  bokehScale={3}
                />
              )}
              <Vignette
                offset={0.3}
                darkness={0.7}
                blendFunction={BlendFunction.NORMAL}
              />
            </EffectComposer>
          </Suspense>
        </Canvas>

        {/* Sacred Geometry Vignette Overlay */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%23C4A661' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        {/* Scroll Indicator */}
        <ScrollIndicator />

        {/* Text Overlay with CTAs */}
        <HeroOverlay
          title={config.title}
          subtitle={config.subtitle || ""}
        />
      </div>
    </div>
  );
};

export default HeroSection;
