/*
  # Add text timing and style controls to hero_scenes

  1. Changes
    - Add `text_delay_ms` for timing control
    - Add `show_logo` boolean flag
    - Add `logo_text` for customizable logo text
    - Add `cta_style` for call-to-action styling
*/

ALTER TABLE hero_scenes 
ADD COLUMN IF NOT EXISTS text_delay_ms INTEGER DEFAULT 3000,
ADD COLUMN IF NOT EXISTS show_logo BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS logo_text TEXT DEFAULT 'THE HOUSE',
ADD COLUMN IF NOT EXISTS cta_style TEXT DEFAULT 'seal';