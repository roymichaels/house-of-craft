/*
  # Seed Apollo Brand Foundation

  ## Overview
  Populate core brand data:
  - Apollo color palette (Gold, Onyx, Ivory, Tobacco, Olive, Steel)
  - Premium materials taxonomy
  - Collection types (Modern, Classic, Vault)
  - AI image generation prompts for each category
  - Lifestyle looks for Shop by Look feature

  ## Brand Identity
  - Luxury minimalism + mythic discipline
  - Warm cinematic lighting
  - Leica 35mm-50mm aesthetic
  - Chiaroscuro depth
*/

-- ============================================================================
-- APOLLO COLOR PALETTE
-- ============================================================================

INSERT INTO public.brand_colors (name, slug, hex_value, description, color_family, usage_context, display_order)
VALUES
  ('Apollo Gold', 'apollo-gold', '#D4AF37', 'Primary brand color. Warm, refined, symbolic of mastery and light.', 'Gold', ARRAY['primary', 'accents', 'typography', 'icons'], 1),
  ('Onyx Black', 'onyx-black', '#0A0A0A', 'Deep black for backgrounds and foundations. Grounding and authoritative.', 'Black', ARRAY['backgrounds', 'text', 'products'], 2),
  ('Ivory', 'ivory', '#E5E0D8', 'Soft neutral for contrast and breathing space. Warm and refined.', 'Neutral', ARRAY['backgrounds', 'text', 'surfaces'], 3),
  ('Tobacco', 'tobacco', '#7A5A3A', 'Rich brown for leather goods and warmth. Earthy sophistication.', 'Brown', ARRAY['accents', 'products', 'leather'], 4),
  ('Olive', 'olive', '#3E4430', 'Subdued green for balance and natural elements. Military precision.', 'Green', ARRAY['accents', 'apparel', 'surfaces'], 5),
  ('Steel', 'steel', '#9C9C9C', 'Cool grey for technical elements and modern minimalism.', 'Grey', ARRAY['accents', 'metals', 'details'], 6)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- PREMIUM MATERIALS
-- ============================================================================

INSERT INTO public.brand_materials (name, slug, description, properties, care_instructions, origin, display_order)
VALUES
  (
    'Italian Full-Grain Leather',
    'italian-full-grain-leather',
    'Vegetable-tanned leather from Italian tanneries. Ages beautifully over decades.',
    '{"texture": "smooth", "durability": "exceptional", "patina": "develops rich character", "weight": "substantial"}'::jsonb,
    'Clean with dry cloth. Condition quarterly with natural leather cream. Avoid water exposure.',
    'Tuscany, Italy',
    1
  ),
  (
    'Merino Wool',
    'merino-wool',
    '100% Merino wool from premium Italian mills. Temperature-regulating and naturally wrinkle-resistant.',
    '{"texture": "soft", "durability": "excellent", "breathability": "high", "weight": "medium"}'::jsonb,
    'Dry clean only. Store folded with cedar blocks.',
    'Italy',
    2
  ),
  (
    'Solid Brass',
    'solid-brass',
    'Unplated brass that develops natural patina. Used for hardware and decorative elements.',
    '{"texture": "smooth", "durability": "lifetime", "patina": "rich golden", "weight": "substantial"}'::jsonb,
    'Polish with brass cleaner or embrace natural patina development.',
    'Various',
    3
  ),
  (
    'Italian Cotton',
    'italian-cotton',
    'Premium long-staple cotton from Italian weavers. Soft, durable, and precisely woven.',
    '{"texture": "crisp", "durability": "excellent", "breathability": "high", "thread_count": "high"}'::jsonb,
    'Machine wash cold. Hang dry or tumble low. Iron while slightly damp.',
    'Italy',
    4
  ),
  (
    'Swiss Movement',
    'swiss-movement',
    'Precision mechanical movements from Swiss manufactures. COSC certified.',
    '{"accuracy": "exceptional", "durability": "lifetime", "craftsmanship": "hand-assembled"}'::jsonb,
    'Service every 5-7 years by certified watchmaker. Avoid magnetic fields and extreme temperatures.',
    'Switzerland',
    5
  ),
  (
    'Frosted Glass',
    'frosted-glass',
    'Hand-blown frosted glass for lighting and decor. Diffuses light beautifully.',
    '{"texture": "matte", "durability": "delicate", "light_diffusion": "soft", "weight": "medium"}'::jsonb,
    'Clean with microfiber cloth. Handle with care.',
    'Various',
    6
  ),
  (
    'Natural Stone',
    'natural-stone',
    'Marble, granite, and limestone for desk objects and decor.',
    '{"texture": "smooth", "durability": "excellent", "uniqueness": "each piece unique", "weight": "heavy"}'::jsonb,
    'Wipe with damp cloth. Seal annually to prevent staining.',
    'Various',
    7
  ),
  (
    'Grade 5 Titanium',
    'grade-5-titanium',
    'Aerospace-grade titanium. Incredibly strong yet lightweight.',
    '{"texture": "brushed", "durability": "exceptional", "weight": "lightweight", "corrosion_resistance": "complete"}'::jsonb,
    'Requires no maintenance. Naturally corrosion resistant.',
    'Various',
    8
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- COLLECTIONS
-- ============================================================================

INSERT INTO public.collections (name, slug, description, type, tagline, display_order)
VALUES
  (
    'Modern Line',
    'modern-line',
    'Contemporary pieces for daily command. Clean lines, modern materials, timeless design.',
    'modern',
    'Built for the present. Designed for permanence.',
    1
  ),
  (
    'Classic Line',
    'classic-line',
    'Heritage-inspired craftsmanship with modern precision. Traditional forms, contemporary execution.',
    'classic',
    'Tradition refined. Legacy continued.',
    2
  ),
  (
    'Vault Editions',
    'vault-editions',
    'Limited runs, numbered pieces, bespoke offerings. Reserved for those who have proven mastery.',
    'vault',
    'Scarcity by design. Mastery by invitation.',
    3
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- AI IMAGE PROMPTS BY CATEGORY
-- ============================================================================

INSERT INTO public.ai_image_prompts (name, category, base_prompt, style_parameters, lighting_specs, camera_specs, material_rendering, color_grading)
VALUES
  (
    'Timepiece Hero',
    'timepieces',
    'Luxury mechanical wristwatch photographed in cinematic lighting',
    '{"aesthetic": "luxury minimalism", "mood": "authoritative", "composition": "centered with negative space", "background": "gradient dark to mid-tone"}'::jsonb,
    'Chiaroscuro lighting with warm key light at 45 degrees. Rim light for separation. Subtle fill to maintain shadow detail. Color temperature: 3200K-4000K.',
    'Leica 50mm f/1.4 at f/4 for optimal sharpness. Shallow depth of field to isolate subject. Eye-level perspective.',
    'Show metal reflections with golden warmth. Emphasize mechanical details through selective focus. Leather strap should show texture and grain.',
    'Warm cinematic grade with lifted shadows. Golden highlights. Subtle vignette. Film-like grain texture.'
  ),
  (
    'Leather Goods Detail',
    'leather-goods',
    'Premium leather accessory shot on textured surface with natural materials',
    '{"aesthetic": "tactile luxury", "mood": "refined", "composition": "three-quarter view with context", "background": "natural textures - wood, stone, linen"}'::jsonb,
    'Soft directional natural light from window. North-facing quality. No harsh shadows. Emphasize texture and grain.',
    'Leica 35mm f/2 at f/2.8. Medium distance for context. Slightly elevated angle.',
    'Show leather grain, stitching detail, brass hardware patina. Materials should feel tangible and lived-in.',
    'Warm earth tones emphasized. Tobacco and caramel highlights. Crushed blacks for depth.'
  ),
  (
    'Apparel Lifestyle',
    'apparel',
    'Tailored menswear in architectural setting with natural light',
    '{"aesthetic": "refined minimalism", "mood": "powerful restraint", "composition": "environmental portrait style", "background": "modern architecture or natural stone"}'::jsonb,
    'Directional natural light with soft shadows. Golden hour quality but controlled. Emphasize fabric texture and drape.',
    'Leica 50mm f/1.4 at f/2 for subject isolation. Waist-to-head framing or full figure.',
    'Show fabric weave, button details, seam construction. Garment should appear sculptural on form.',
    'Neutral palette with warm undertones. Preserve fabric texture. Subtle film grain.'
  ),
  (
    'Accessories Detail',
    'accessories',
    'Small luxury object on minimal surface with dramatic lighting',
    '{"aesthetic": "modern stoic", "mood": "contemplative", "composition": "centered with geometry", "background": "solid or gradient - onyx to charcoal"}'::jsonb,
    'Dramatic side lighting with strong shadows. Single key light source. Deep blacks with golden highlights.',
    'Leica 90mm macro for detail. f/5.6 for front-to-back sharpness. Overhead or 45-degree angle.',
    'Emphasize material quality - brass weight, pen nib precision, ring engraving depth.',
    'High contrast with golden accents. Film noir quality. Preserve detail in shadows.'
  ),
  (
    'Home Ritual Ambiance',
    'home-ritual',
    'Candle or home object in atmospheric setting with soft glow',
    '{"aesthetic": "meditative luxury", "mood": "calm authority", "composition": "environmental with negative space", "background": "dark room with ambient light sources"}'::jsonb,
    'Ambient lighting with practical light sources (candle flame, window glow). Low key overall. Warm color temperature 2700K-3000K.',
    'Leica 35mm f/1.4 at f/2 for environmental context. Eye-level or slightly below.',
    'Show flame glow, wax texture, glass reflection. Emphasize warmth and material quality.',
    'Warm amber tones. Deep shadows. Glowing highlights. Intimate film quality.'
  ),
  (
    'Print Media Editorial',
    'print-media',
    'Book or journal on natural surface with soft directional light',
    '{"aesthetic": "intellectual luxury", "mood": "thoughtful", "composition": "flat lay or angled with context", "background": "wood desk, linen, leather surface"}'::jsonb,
    'Soft directional light from single source. North light quality. No harsh shadows. Emphasize paper texture.',
    'Leica 50mm f/2.8 at f/4. Overhead or 30-degree angle for depth.',
    'Show paper grain, leather binding texture, embossing detail, edge gilding.',
    'Neutral warm tones. Preserve paper whites. Subtle sepia warmth in shadows.'
  ),
  (
    'Shop by Look Lifestyle',
    'lifestyle-collections',
    'Curated product composition in lifestyle setting',
    '{"aesthetic": "aspirational realism", "mood": "confident sophistication", "composition": "styled tableau with breathing room", "background": "contextual environments - yacht, office, home, travel"}'::jsonb,
    'Natural environmental lighting enhanced with subtle fill. Golden hour exterior or soft directional interior.',
    'Leica 35mm f/2 at f/2.8-4. Environmental framing showing context and products.',
    'Show products in natural relationship. Emphasize complementary materials and colors.',
    'Location-appropriate color grading. Warm for intimate settings, cool for business, balanced for travel.'
  )
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- LIFESTYLE LOOKS (Shop by Look)
-- ============================================================================

INSERT INTO public.lifestyle_looks (name, slug, description, color_palette, styling_narrative, ideal_occasions, display_order)
VALUES
  (
    'Yacht',
    'yacht',
    'Refined nautical sophistication. Pieces that command respect on deck and in port.',
    '["#E5E0D8", "#3E4430", "#7A5A3A", "#9C9C9C"]'::jsonb,
    'The sea demands presence without pretense. This collection balances performance with refinement - breathable linens, salt-resistant metals, leather that weathers gracefully. Every piece serves a purpose while signaling mastery.',
    ARRAY['sailing', 'coastal gatherings', 'yacht club', 'waterfront dining'],
    1
  ),
  (
    'Golf',
    'golf',
    'Performance tailoring meets country club tradition.',
    '["#E5E0D8", "#3E4430", "#7A5A3A", "#D4AF37"]'::jsonb,
    'The course is a proving ground. This look combines athletic precision with understated luxury. Stretch fabrics that move with your swing, timepieces that withstand the elements, accessories that signal membership in an exclusive circle.',
    ARRAY['golf course', 'country club', 'tournament', 'clubhouse'],
    2
  ),
  (
    'Business',
    'business',
    'Power dressing for men who shape markets.',
    '["#0A0A0A", "#9C9C9C", "#E5E0D8", "#D4AF37"]'::jsonb,
    'The boardroom requires armor. Sharp tailoring, precise timepieces, leather that carries contracts and decisions. Every detail communicates competence and control. This is the uniform of those who move billions.',
    ARRAY['boardroom', 'client meetings', 'conferences', 'power lunch'],
    3
  ),
  (
    'Command',
    'command',
    'For men who lead without asking permission.',
    '["#0A0A0A", "#D4AF37", "#7A5A3A", "#9C9C9C"]'::jsonb,
    'True authority requires no announcement. This collection embodies quiet power - heavyweight fabrics, substantial accessories, pieces that command space through presence alone. Worn by those who set the standard.',
    ARRAY['leadership events', 'speaking engagements', 'power dinners', 'strategic meetings'],
    4
  ),
  (
    'House',
    'house',
    'Private sanctuary pieces for men of taste.',
    '["#7A5A3A", "#E5E0D8", "#3E4430", "#D4AF37"]'::jsonb,
    'Your home is your fortress. This collection brings ritual to the everyday - reading lamps that create atmosphere, journals for strategy, robes and loungewear that maintain dignity in solitude. Mastery begins at home.',
    ARRAY['home office', 'reading room', 'morning routine', 'evening wind-down'],
    5
  ),
  (
    'Evening',
    'evening',
    'For nights that demand excellence.',
    '["#0A0A0A", "#D4AF37", "#E5E0D8", "#9C9C9C"]'::jsonb,
    'Some occasions require formal command. This collection is for men who know the difference between dressed up and dressed right. Black tie with modern edge, accessories that catch light without seeking it, presence that lingers after departure.',
    ARRAY['black tie', 'gala', 'opera', 'exclusive dinner', 'ceremonial events'],
    6
  ),
  (
    'Traveler',
    'traveler',
    'For men who move through the world with purpose.',
    '["#3E4430", "#7A5A3A", "#9C9C9C", "#0A0A0A"]'::jsonb,
    'Travel is strategy, not vacation. This collection prioritizes intelligent versatility - bags that organize ambition, timepieces that track global markets, garments that maintain authority across time zones. Built for those who expand empires.',
    ARRAY['business travel', 'international trips', 'airport', 'hotel', 'remote work'],
    7
  )
ON CONFLICT (slug) DO NOTHING;
