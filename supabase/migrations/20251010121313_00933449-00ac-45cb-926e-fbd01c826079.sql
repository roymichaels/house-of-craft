-- Update hero scene with APOLLON branding
UPDATE hero_scenes 
SET 
  title = 'APOLLON',
  logo_text = 'APOLLON',
  cta_text = 'Enter The Order',
  subtitle = 'Where Light Becomes Order. A sanctuary for those who master time, mind, and presence.'
WHERE is_active = true;