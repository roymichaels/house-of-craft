import { useEffect, useRef } from "react";
import Navigation from "./Navigation";
import { initSolarSystem, cleanupSolarSystem } from "@/lib/solarSystem";

const HeroSection = () => {
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

      {/* Three.js Solar System - Full screen */}
      <div ref={containerRef} className="absolute inset-0 z-0" />
    </div>
  );
};

export default HeroSection;
