import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
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
import StructuredData from "@/components/StructuredData";
import { initChamberAudio } from "@/lib/chamberAudio";

const Index = () => {
  // Initialize chamber audio on mount
  useEffect(() => {
    initChamberAudio();
  }, []);

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <StructuredData type="Organization" />
      <StructuredData type="WebSite" />
      <RitualEntry />
      <CursorGlow />
      <VoiceOfHouse />

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
