import { useEffect, useRef } from "react";
import Navigation from "./Navigation";
import HeroOverlay from "./hero/HeroOverlay";
import LavaBackground from "./effects/LavaBackground";
import { useHeroScene } from "@/hooks/useHeroScene";
import { initSolarSystem, cleanupSolarSystem } from "@/lib/solarSystem";

const HeroSection = () => {
  const { data } = useHeroScene();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cleanup = initSolarSystem(containerRef.current);

    return () => {
      cleanup();
      cleanupSolarSystem();
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#1a0a05]">
      {/* Navigation - Top layer */}
      <div className="relative z-30">
        <Navigation />
      </div>

      {/* Lava Background - Bottom layer */}
      <div className="absolute inset-0 z-0">
        <LavaBackground />
      </div>

      {/* Three.js Solar System - Hidden but kept for other sections */}
      <div ref={containerRef} className="absolute inset-0 z-0 opacity-0 pointer-events-none" />

      {/* Vignette effect - Middle layer */}
      <div className="scene-vignette pointer-events-none absolute inset-0 z-10" />

      {/* Hero Overlay - Middle-top layer */}
      <div className="relative z-20">
        <HeroOverlay
          title={data?.title || "APOLLO"}
          subtitle={data?.subtitle || "Reliquary of Distinction"}
        />
      </div>
    </div>
  );
};

export default HeroSection;
