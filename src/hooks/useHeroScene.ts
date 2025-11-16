import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface HeroScene {
  id: string;
  title: string;
  subtitle: string | null;
  model_url: string | null;
  hdri_url: string | null;
  rotation_speed: number;
  light_color: string;
  accent_color: string;
  camera_fov: number;
  camera_position: { x: number; y: number; z: number };
  show_real_time: boolean;
  cta_text: string;
  cta_link: string;
  is_active: boolean;
  movement_style: string;
  show_balance_wheel: boolean;
  show_gears: boolean;
  hand_style: string;
  text_delay_ms: number;
  show_logo: boolean;
  logo_text: string;
  cta_style: string;
}

export const useHeroScene = () => {
  return useQuery({
    queryKey: ["hero-scene"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_scenes")
        .select("*")
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        console.error("Failed to fetch hero scene:", error);
        throw error;
      }

      if (!data) {
        console.warn("No active hero scene found, using defaults");
        return {
          id: "default",
          title: "APOLLO",
          subtitle: "Reliquary of Distinction",
          model_url: null,
          hdri_url: null,
          rotation_speed: 0.3,
          light_color: "#C7A869",
          accent_color: "#7A6A4F",
          camera_fov: 45,
          camera_position: { x: 0, y: 0, z: 5 },
          show_real_time: false,
          cta_text: "Enter The Order",
          cta_link: "/collections",
          is_active: true,
          movement_style: "precision",
          show_balance_wheel: true,
          show_gears: true,
          hand_style: "classic",
          text_delay_ms: 3000,
          show_logo: true,
          logo_text: "APOLLO",
          cta_style: "seal",
        } as HeroScene;
      }

      return {
        ...data,
        camera_position: data.camera_position as { x: number; y: number; z: number },
      } as HeroScene;
    },
    staleTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
