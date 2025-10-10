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

const DEFAULT_HERO_SCENE: HeroScene = {
  id: 'default',
  title: 'APOLLO',
  subtitle: 'Reliquary of Distinction',
  model_url: null,
  hdri_url: null,
  rotation_speed: 0.3,
  light_color: '#C7A869',
  accent_color: '#7A6A4F',
  camera_fov: 45,
  camera_position: { x: 0, y: 0, z: 5 },
  show_real_time: false,
  cta_text: 'Enter The House',
  cta_link: '/collections',
  is_active: true,
  movement_style: 'smooth',
  show_balance_wheel: false,
  show_gears: false,
  hand_style: 'classic',
  text_delay_ms: 0,
  show_logo: true,
  logo_text: 'APOLLO',
  cta_style: 'classic',
};

export const useHeroScene = () => {
  return useQuery({
    queryKey: ["hero-scene"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("hero_scenes")
          .select("*")
          .eq("is_active", true)
          .maybeSingle();

        if (error) {
          console.error('Error fetching hero scene:', error);
          return DEFAULT_HERO_SCENE;
        }

        if (!data) {
          console.warn('No active hero scene found, using default');
          return DEFAULT_HERO_SCENE;
        }

        const parsed = {
          ...data,
          camera_position: data.camera_position as { x: number; y: number; z: number },
        };

        return parsed as HeroScene;
      } catch (error) {
        console.error('Exception in hero scene query:', error);
        return DEFAULT_HERO_SCENE;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
