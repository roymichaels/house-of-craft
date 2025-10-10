import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import HeroScene from "@/components/hero/HeroScene";
import ObjectModal from "@/components/modals/ObjectModal";
import CollectionsModal from "@/components/modals/CollectionsModal";
import StoriesModal from "@/components/modals/StoriesModal";
import ConciergeModal from "@/components/modals/ConciergeModal";
import MissionModal from "@/components/modals/MissionModal";
import PhilosophyModal from "@/components/modals/PhilosophyModal";
import WishlistModal from "@/components/modals/WishlistModal";
import CartModal from "@/components/modals/CartModal";
import CursorGlow from "@/components/effects/CursorGlow";
import VoiceOfHouse from "@/components/effects/VoiceOfHouse";
import RitualEntry from "@/components/RitualEntry";
import { useHeroScene } from "@/hooks/useHeroScene";
import { initChamberAudio } from "@/lib/chamberAudio";

const Index = () => {
  const { data } = useHeroScene();

  // Initialize chamber audio on mount
  useEffect(() => {
    initChamberAudio();
  }, []);

  const config = {
    rotationSpeed: data?.rotation_speed ?? 0.3,
    lightColor: data?.light_color ?? "#E8D5B7",
    accentColor: data?.accent_color ?? "#C4A661",
    cameraFov: data?.camera_fov ?? 50,
    cameraPosition: data?.camera_position ?? { x: 0, y: 0, z: 6 },
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <RitualEntry />
      <CursorGlow />
      <VoiceOfHouse />
      
      {/* Persistent 3D Background */}
      <div className="fixed inset-0 -z-10">
        <HeroScene {...config} />
      </div>

      {/* Depth vignette for framing */}
      <div className="scene-vignette" />

      {/* Content overlays - h-full with proper spacing */}
      <div className="relative z-10 h-full flex flex-col">
        <HeroSection />
      </div>
      
      {/* Modals */}
      <ObjectModal />
      <CollectionsModal />
      <StoriesModal />
      <ConciergeModal />
      <MissionModal />
      <PhilosophyModal />
      <WishlistModal />
      <CartModal />
    </div>
  );
};

export default Index;
