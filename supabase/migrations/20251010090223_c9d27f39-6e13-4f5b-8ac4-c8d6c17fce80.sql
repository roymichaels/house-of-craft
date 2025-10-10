-- Create hero_scenes table for CMS control of 3D hero
CREATE TABLE IF NOT EXISTS hero_scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Time, Composed',
  subtitle TEXT,
  model_url TEXT,
  hdri_url TEXT,
  rotation_speed FLOAT DEFAULT 0.3,
  light_color TEXT DEFAULT '#C7A869',
  accent_color TEXT DEFAULT '#7A6A4F',
  camera_fov INTEGER DEFAULT 45,
  camera_position JSONB DEFAULT '{"x":0,"y":0,"z":5}'::jsonb,
  show_real_time BOOLEAN DEFAULT false,
  cta_text TEXT DEFAULT 'Enter The House',
  cta_link TEXT DEFAULT '/collections',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE hero_scenes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active hero scene
CREATE POLICY "Anyone can view active hero scene"
  ON hero_scenes
  FOR SELECT
  USING (is_active = true);

-- Seed with default configuration
INSERT INTO hero_scenes (title, subtitle, show_real_time) VALUES (
  'Time, Composed',
  'A curated maison for collectors who appreciate the art of living well. Timepieces, tailoring, and timeless objects, selected with uncompromising intent.',
  false
);