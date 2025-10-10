import { useEffect, useRef } from "react";
import Navigation from "./Navigation";
import HeroOverlay from "./hero/HeroOverlay";
import { useHeroScene } from "@/hooks/useHeroScene";
import { initSolarSystem, cleanupSolarSystem } from "@/lib/solarSystem";

const HeroSection = () => {
  const { data } = useHeroScene();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize the vanilla Three.js solar system
    const cleanup = initSolarSystem(containerRef.current);

    // Cleanup on unmount
    return () => {
      cleanup();
      cleanupSolarSystem();
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#000814]">
      {/* Navigation - Top layer */}
      <div className="relative z-30">
        <Navigation />
      </div>
      
      {/* Three.js Solar System - Bottom layer */}
      <div ref={containerRef} className="absolute inset-0 z-0" />

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
