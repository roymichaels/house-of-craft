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
      <Navigation />
      
      {/* Vanilla Three.js container - behind everything */}
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* Vignette effect */}
      <div className="scene-vignette pointer-events-none" />
      
      {/* Overlay content - on top with transparent background */}
      <HeroOverlay 
        title={data?.title || "APOLLO"}
        subtitle={data?.subtitle || "Reliquary of Distinction"}
      />
    </div>
  );
};

export default HeroSection;
