-- Add text timing and style controls to hero_scenes
ALTER TABLE hero_scenes 
ADD COLUMN IF NOT EXISTS text_delay_ms INTEGER DEFAULT 3000,
ADD COLUMN IF NOT EXISTS show_logo BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS logo_text TEXT DEFAULT 'THE HOUSE',
ADD COLUMN IF NOT EXISTS cta_style TEXT DEFAULT 'seal';