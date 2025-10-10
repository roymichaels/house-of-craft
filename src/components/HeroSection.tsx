import { Suspense } from "react";
import heroImage from "@/assets/hero-watch.jpg";
import HeroScene from "./hero/HeroScene";
import HeroOverlay from "./hero/HeroOverlay";
import { useHeroScene } from "@/hooks/useHeroScene";

const HeroSection = () => {
  const { data: heroScene, isLoading } = useHeroScene();

  // Default values while loading or if query fails
  const config = heroScene || {
    title: "Time, Composed",
    subtitle: "A curated maison for collectors who appreciate the art of living well. Timepieces, tailoring, and timeless objects, selected with uncompromising intent.",
    rotation_speed: 0.3,
    light_color: "#C7A869",
    accent_color: "#7A6A4F",
    camera_fov: 45,
    camera_position: { x: 0, y: 0, z: 5 },
    cta_text: "Enter The House",
    cta_link: "/collections",
    show_real_time: false,
    show_balance_wheel: true,
    show_gears: true,
    hand_style: "classic",
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grain">
      {/* Fallback Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury timepiece collection"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background" />
      </div>

      {/* 3D Scene Layer */}
      {!isLoading && (
        <Suspense fallback={null}>
          <HeroScene
            rotationSpeed={config.rotation_speed}
            lightColor={config.light_color}
            accentColor={config.accent_color}
            cameraFov={config.camera_fov}
            cameraPosition={config.camera_position}
            showRealTime={config.show_real_time}
            showBalanceWheel={config.show_balance_wheel}
            showGears={config.show_gears}
            handStyle={config.hand_style}
          />
        </Suspense>
      )}

      {/* Text Overlay */}
      <HeroOverlay
        title={config.title}
        subtitle={config.subtitle || ""}
        ctaText={config.cta_text}
        ctaLink={config.cta_link}
      />
    </section>
  );
};

export default HeroSection;
