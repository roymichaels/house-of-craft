-- Add text timing and style controls to hero_scenes
ALTER TABLE hero_scenes 
ADD COLUMN text_delay_ms INTEGER DEFAULT 3000,
ADD COLUMN show_logo BOOLEAN DEFAULT true,
ADD COLUMN logo_text TEXT DEFAULT 'THE HOUSE',
ADD COLUMN cta_style TEXT DEFAULT 'seal';