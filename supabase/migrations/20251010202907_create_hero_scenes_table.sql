/*
  # Create hero_scenes table

  1. New Tables
    - `hero_scenes`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `subtitle` (text)
      - `model_url` (text)
      - `hdri_url` (text)
      - `rotation_speed` (float)
      - `light_color` (text)
      - `accent_color` (text)
      - `camera_fov` (integer)
      - `camera_position` (jsonb)
      - `show_real_time` (boolean)
      - `cta_text` (text)
      - `cta_link` (text)
      - `is_active` (boolean)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on `hero_scenes` table
    - Add policy for public read access to active hero scenes
  
  3. Data
    - Seed with default hero scene configuration
*/

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

ALTER TABLE hero_scenes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active hero scene"
  ON hero_scenes
  FOR SELECT
  USING (is_active = true);

INSERT INTO hero_scenes (title, subtitle, show_real_time) 
VALUES (
  'APOLLO',
  'Reliquary of Distinction',
  false
)
ON CONFLICT DO NOTHING;