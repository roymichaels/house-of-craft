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
    <div className="relative h-screen w-full overflow-hidden bg-background">
      <Navigation />
      
      {/* Vanilla Three.js container */}
      <div ref={containerRef} className="fixed inset-0 -z-10" />

      <div className="scene-vignette" />
      
      <HeroOverlay 
        title={data?.title || "APOLLO"}
        subtitle={data?.subtitle || "Reliquary of Distinction"}
      />
    </div>
  );
};

export default HeroSection;
