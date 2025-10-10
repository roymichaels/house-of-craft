import Navigation from "./Navigation";
import HeroScene from "./hero/HeroScene";
import HeroOverlay from "./hero/HeroOverlay";
import { useHeroScene } from "@/hooks/useHeroScene";

const HeroSection = () => {
  const { data } = useHeroScene();

  const config = {
    rotationSpeed: data?.rotation_speed ?? 0.3,
    lightColor: data?.light_color ?? "#E8D5B7",
    accentColor: data?.accent_color ?? "#C4A661",
    cameraFov: data?.camera_fov ?? 50,
    cameraPosition: data?.camera_position ?? { x: 0, y: 0, z: 6 },
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      <Navigation />
      
      <div className="fixed inset-0 -z-10">
        <HeroScene {...config} />
      </div>

      <div className="scene-vignette" />
      
      <HeroOverlay 
        title={data?.title || "APOLLO"}
        subtitle={data?.subtitle || "Reliquary of Distinction"}
      />
    </div>
  );
};

export default HeroSection;
