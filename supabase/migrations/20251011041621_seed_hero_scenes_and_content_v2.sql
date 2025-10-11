/*
  # Seed Hero Scenes and Content Blocks
  
  ## Hero Scenes
  Seeds various hero scene configurations for the 3D watch display
  
  ## Content Blocks  
  Seeds philosophy, mission statements, stories, and other content pages
*/

-- ============================================================================
-- Seed Hero Scenes
-- ============================================================================

INSERT INTO public.hero_scenes (
  title,
  subtitle,
  model_url,
  hdri_url,
  rotation_speed,
  light_color,
  accent_color,
  camera_fov,
  camera_position,
  show_real_time,
  cta_text,
  cta_link,
  cta_style,
  is_active,
  movement_style,
  show_balance_wheel,
  show_gears,
  hand_style,
  text_delay_ms,
  show_logo,
  logo_text
) VALUES 
  (
    'Time, Composed',
    'Swiss precision. Italian leather. Built for daily command.',
    '/models/watch.glb',
    '/hdri/studio.hdr',
    0.3,
    '#C7A869',
    '#7A6A4F',
    45,
    '{"x": 0, "y": 0, "z": 5}'::jsonb,
    true,
    'Enter The House',
    '/collections',
    'seal',
    true,
    'precision',
    true,
    true,
    'classic',
    3000,
    true,
    'THE HOUSE'
  ),
  (
    'Mastery of Hours',
    'For men who command time, not chase it.',
    '/models/watch.glb',
    '/hdri/sunset.hdr',
    0.2,
    '#D4AF37',
    '#8B7355',
    50,
    '{"x": 1, "y": 0.5, "z": 4}'::jsonb,
    false,
    'Explore Timepieces',
    '/collections/timepieces',
    'minimal',
    false,
    'eternal',
    false,
    false,
    'minimal',
    4000,
    true,
    'APOLLO'
  ),
  (
    'Heritage Refined',
    'Vintage soul. Modern discipline.',
    '/models/watch.glb',
    '/hdri/night.hdr',
    0.15,
    '#967969',
    '#6B5D52',
    40,
    '{"x": -0.5, "y": 0, "z": 6}'::jsonb,
    true,
    'Discover Collections',
    '/vault',
    'classic',
    false,
    'minimal',
    true,
    false,
    'light',
    2500,
    false,
    null
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Seed Content Blocks - Philosophy & Mission
-- ============================================================================

INSERT INTO public.content_blocks (slug, title, content_type, body, excerpt, is_published, published_at)
VALUES 
  (
    'philosophy',
    'Our Philosophy',
    'philosophy',
    'Philosophy of the House: Time is the ultimate currency. Not money. Not attention. Time. Everything we create serves to help you master your hours, not chase them. We pursue the sacred intersection of form and function: objects that serve a purpose and embody timeless aesthetics.',
    'Time is the ultimate currency. Everything we create serves to help you master your hours, not chase them.',
    true,
    NOW()
  ),
  (
    'mission',
    'Our Mission',
    'mission',
    'APOLLO exists to equip modern men with objects and garments that embody mastery, presence, and timeless design. We serve the modern stoic - the disciplined professional who chooses quality over quantity, values time over trends, and pursues mastery over mediocrity.',
    'Equipping modern men with objects and garments that embody mastery, presence, and timeless design.',
    true,
    NOW()
  ),
  (
    'about',
    'About Apollo',
    'page',
    'Founded on the principle that objects shape behavior, APOLLO creates timepieces, accessories, and apparel for men who understand that excellence is not an act, but a habit. Our catalog spans six domains: Timepieces, Accessories, Leather Goods, Apparel, Home & Ritual, and Print & Media.',
    'Founded on the principle that objects shape behavior, creating products for men who understand excellence is a habit.',
    true,
    NOW()
  ),
  (
    'craftsmanship',
    'Our Craftsmanship',
    'page',
    'We source only the finest materials: Swiss movements, Italian leather, Japanese steel, Scottish wool, and solid bronze. Every piece passes through rigorous quality control. We offer lifetime repair services for watches and leather goods.',
    'Materials sourced from the finest artisans. Construction that honors traditional methods. Quality that lasts generations.',
    true,
    NOW()
  ),
  (
    'sustainability',
    'Our Commitment',
    'page',
    'The most sustainable product is one that never needs replacing. We design for decades, not seasons. All our materials are ethically sourced, and we offer lifetime repair services. Before we release a product, we ask: Will this still be relevant in 50 years?',
    'The most sustainable product is one that never needs replacing. We design for decades, not seasons.',
    true,
    NOW()
  ),
  (
    'shipping-policy',
    'Shipping & Returns',
    'page',
    'Free shipping on orders over $500. Standard shipping 3-5 business days. 30-day return window with full refund. Lifetime exchange program available. Contact concierge@apollo.com for warranty claims - response within 24 hours guaranteed.',
    'Free shipping over $500. 30-day returns. Lifetime exchange program.',
    true,
    NOW()
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- Seed Journal / Blog Content
-- ============================================================================

INSERT INTO public.content_blocks (slug, title, content_type, body, excerpt, metadata, is_published, published_at)
VALUES 
  (
    'on-time-mastery',
    'On Time Mastery',
    'journal',
    'We do not have time. We ARE time. Every moment you spend is your life, converted into action. The question is not how do I find more time, but am I converting my life into things that matter? A mechanical watch is not about convenience - it is about presence. Every glance at your wrist is a memento mori, a reminder that the mechanism inside ticks down your finite hours.',
    'We do not have time. We are time. Every moment spent is your life converted into action.',
    '{"author": "The House", "reading_time": "4 min", "category": "Philosophy"}'::jsonb,
    true,
    NOW() - INTERVAL '7 days'
  ),
  (
    'minimalism-vs-simplicity',
    'Minimalism vs Simplicity',
    'journal',
    'There is a difference between owning nothing and owning only what matters. The Stoics were not minimalists - they were selective. Seneca owned a villa. Marcus Aurelius wore purple. What they rejected was dependency, not ownership. Simplicity is not about owning less. It is about owning better.',
    'Minimalism removes everything. Simplicity keeps only what matters.',
    '{"author": "The House", "reading_time": "3 min", "category": "Discipline"}'::jsonb,
    true,
    NOW() - INTERVAL '14 days'
  ),
  (
    'the-daily-carry',
    'The Philosophy of Daily Carry',
    'journal',
    'What you carry shapes how you move through the world. Every item in your pockets is a commitment. Before adding anything to your daily carry, ask: What problem does this solve? Will this last years, not months? Does this reflect who I am? What would break if I did not have this?',
    'What you carry shapes how you move through the world. Choose deliberately.',
    '{"author": "The House", "reading_time": "5 min", "category": "Practical Philosophy"}'::jsonb,
    true,
    NOW() - INTERVAL '21 days'
  ),
  (
    'on-discipline',
    'Discipline as Freedom',
    'journal',
    'The undisciplined man is a slave to his impulses. The disciplined man chooses his chains - and in choosing, becomes free. Daily rituals, consistent habits, deliberate choices. These are not restrictions. They are the architecture of freedom.',
    'The undisciplined man is a slave. The disciplined man chooses his chains and becomes free.',
    '{"author": "The House", "reading_time": "3 min", "category": "Philosophy"}'::jsonb,
    true,
    NOW() - INTERVAL '28 days'
  ),
  (
    'quality-compounds',
    'Why Quality Compounds',
    'journal',
    'Buy a cheap watch. It breaks in two years. Buy another. Then another. After a decade, you have spent more replacing mediocrity than you would have spent on excellence. Quality is not expensive when you factor in time. Quality is the only thing that makes economic sense.',
    'Quality is not expensive when you factor in time. It is the only thing that makes economic sense.',
    '{"author": "The House", "reading_time": "4 min", "category": "Practical Philosophy"}'::jsonb,
    true,
    NOW() - INTERVAL '35 days'
  )
ON CONFLICT (slug) DO NOTHING;
