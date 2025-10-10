import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { Suspense } from "react";
import HeroOverlay from "./hero/HeroOverlay";
import OrbModel from "./hero/OrbModel";
import { useHeroScene } from "@/hooks/useHeroScene";
import Navigation from "./Navigation";

const HeroSection = () => {
  const { data: heroScene, isLoading } = useHeroScene();

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
        <Canvas className="absolute inset-0">
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
            
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1} color={config.light_color} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            
            <OrbModel
              rotationSpeed={config.rotation_speed}
              lightColor={config.light_color}
            />
            
            <Environment preset="sunset" />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.5}
            />
          </Suspense>
        </Canvas>

        {/* CSS Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.75)_100%)] pointer-events-none z-10" />

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
