import HeroOverlay from "./hero/HeroOverlay";
import { useHeroScene } from "@/hooks/useHeroScene";

const HeroSection = () => {
  const { data: heroScene, isLoading } = useHeroScene();

  // Default values while loading or if query fails
  const config = heroScene || {
    title: "APOLLON",
    subtitle: "Built to last decades. Forged for men who value time, not trends.",
    rotation_speed: 0.3,
    light_color: "#C4A661",
    accent_color: "#7A6A4F",
    camera_fov: 45,
    camera_position: { x: 0, y: 0, z: 5 },
    cta_text: "Explore Collections",
    cta_link: "#mindcraft",
    show_real_time: false,
    show_balance_wheel: true,
    show_gears: true,
    hand_style: "classic",
    text_delay_ms: 3000,
    show_logo: true,
    logo_text: "APOLLON",
    cta_style: "seal",
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* CSS Vignette - Depth enhancement (darkened to dim orb) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.75)_100%)] pointer-events-none z-10" />

      {/* Text Overlay */}
      <HeroOverlay
        title={config.title}
        subtitle={config.subtitle || ""}
      />
    </section>
  );
};

export default HeroSection;
