import HeroOverlay from "./hero/HeroOverlay";
import { useHeroScene } from "@/hooks/useHeroScene";

const HeroSection = () => {
  const { data: heroScene, isLoading } = useHeroScene();

  // Default values while loading or if query fails
  const config = heroScene || {
    title: "APOLLON",
    subtitle: "Where Light Becomes Order. A sanctuary for those who master time, mind, and presence.",
    rotation_speed: 0.3,
    light_color: "#C4A661",
    accent_color: "#7A6A4F",
    camera_fov: 45,
    camera_position: { x: 0, y: 0, z: 5 },
    cta_text: "Enter The Order",
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-[6vh]">
      {/* CSS Vignette - Depth enhancement */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none z-10" />

      {/* Text Overlay */}
      <HeroOverlay
        title={config.title}
        subtitle={config.subtitle || ""}
        ctaLink={config.cta_link}
        ctaStyle={config.cta_style}
        showLogo={config.show_logo}
        logoText={config.logo_text}
        textDelayMs={config.text_delay_ms}
      />
    </section>
  );
};

export default HeroSection;
