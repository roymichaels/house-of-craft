import { useEffect, useRef } from "react";
import { useScroll } from "framer-motion";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import HeroScene from "@/components/hero/HeroScene";
import Mindcraft from "@/components/sections/Mindcraft";
import Objects from "@/components/sections/Objects";
import Doctrine from "@/components/sections/Doctrine";
import Circle from "@/components/sections/Circle";
import Footer from "@/components/Footer";
import EmailCaptureModal from "@/components/EmailCaptureModal";
import ObjectModal from "@/components/modals/ObjectModal";
import CursorGlow from "@/components/effects/CursorGlow";
import VoiceOfHouse from "@/components/effects/VoiceOfHouse";
import RitualEntry from "@/components/RitualEntry";
import { useSceneStore } from "@/contexts/SceneContext";
import { useHeroScene } from "@/hooks/useHeroScene";

const Index = () => {
  const { data } = useHeroScene();
  const { setMode, setScrollProgress } = useSceneStore();
  const { scrollYProgress } = useScroll();
  
  const mindcraftRef = useRef<HTMLElement>(null);
  const objectsRef = useRef<HTMLElement>(null);
  const doctrineRef = useRef<HTMLElement>(null);
  const circleRef = useRef<HTMLElement>(null);

  const config = {
    rotationSpeed: data?.rotation_speed ?? 0.3,
    lightColor: data?.light_color ?? "#E8D5B7",
    accentColor: data?.accent_color ?? "#C4A661",
    cameraFov: data?.camera_fov ?? 50,
    cameraPosition: data?.camera_position ?? { x: 0, y: 0, z: 6 },
  };

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      setScrollProgress(progress);

      // Determine which section is active based on scroll position
      if (progress < 0.15) {
        setMode('hero');
      } else if (progress < 0.35) {
        setMode('mindcraft');
      } else if (progress < 0.55) {
        setMode('objects');
      } else if (progress < 0.75) {
        setMode('doctrine');
      } else {
        setMode('circle');
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, setMode, setScrollProgress]);

  return (
    <>
      <RitualEntry />
      <CursorGlow />
      <VoiceOfHouse />
      
      {/* Persistent 3D Background */}
      <div className="fixed inset-0 z-0">
        <HeroScene {...config} />
      </div>

      {/* Content overlays */}
      <div className="relative z-10">
        <Navigation />
        <section id="hero" className="min-h-screen">
          <HeroSection />
        </section>
        <section ref={mindcraftRef} id="mindcraft" className="min-h-screen flex items-center bg-gradient-to-b from-transparent via-obsidian-smoke/50 to-transparent">
          <Mindcraft />
        </section>
        <section ref={objectsRef} id="objects" className="min-h-screen flex items-center bg-gradient-to-b from-transparent via-obsidian-smoke/30 to-transparent">
          <Objects />
        </section>
        <section ref={doctrineRef} id="doctrine" className="min-h-screen flex items-center bg-gradient-to-b from-transparent via-obsidian-smoke/50 to-transparent">
          <Doctrine />
        </section>
        <section ref={circleRef} id="circle" className="min-h-screen flex items-center bg-gradient-to-b from-transparent via-obsidian-smoke/30 to-transparent">
          <Circle />
        </section>
        <section id="footer" className="relative bg-card">
          <Footer />
        </section>
      </div>
      
      <EmailCaptureModal />
      <ObjectModal />
    </>
  );
};

export default Index;
