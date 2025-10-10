import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Stars } from "@react-three/drei";
import { Suspense } from "react";
import HeroOverlay from "./hero/HeroOverlay";
import SolarSystem from "./hero/SolarSystem";
import SpaceNebula from "./hero/SpaceNebula";
import { useHeroScene } from "@/hooks/useHeroScene";
import Navigation from "./Navigation";
import { useIsMobile } from "@/hooks/use-mobile";

const HeroSection = () => {
  const { data: heroScene, isLoading } = useHeroScene();
  const isMobile = useIsMobile();

  // Default values while loading or if query fails
  const config = heroScene || {
    title: "APOLLO",
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
    logo_text: "APOLLO",
    cta_style: "seal",
  };

  return (
    <div className="h-full flex flex-col justify-between">
      {/* Header */}
      <Navigation />

      {/* 3D Solar System Background */}
      <div className="flex-1 relative flex items-center justify-center">
        <Canvas className="absolute inset-0" dpr={[1, isMobile ? 1.5 : 2]}>
          <Suspense fallback={null}>
            <PerspectiveCamera
              makeDefault
              position={[0, 50, 150]}
              fov={50}
            />
            
            {/* Lighting Setup */}
            <ambientLight intensity={0.1} />
            
            {/* Background Elements */}
            <SpaceNebula />
            <Stars 
              radius={300} 
              depth={50} 
              count={5000} 
              factor={4} 
              saturation={0} 
              fade 
              speed={0.5}
            />
            
            {/* Solar System */}
            <SolarSystem rotationSpeed={config.rotation_speed} />
            
            <Environment preset="night" />
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              minDistance={20}
              maxDistance={300}
              enableDamping
              dampingFactor={0.05}
            />
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
