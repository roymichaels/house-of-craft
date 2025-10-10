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
}

export const useHeroScene = () => {
  return useQuery({
    queryKey: ["hero-scene"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_scenes")
        .select("*")
        .eq("is_active", true)
        .single();

      if (error) throw error;
      
      // Parse camera_position from JSONB
      const parsed = {
        ...data,
        camera_position: data.camera_position as { x: number; y: number; z: number },
      };
      
      return parsed as HeroScene;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
