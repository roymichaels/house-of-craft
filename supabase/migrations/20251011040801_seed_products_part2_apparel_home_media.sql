/*
  # Seed Products Part 2 - Apparel, Home & Ritual, Print & Media
  
  ## Products Seeded (continued)
  - Apparel: 24 products
  - Home & Ritual: 16 products  
  - Print & Media: 8 products
*/

-- ============================================================================
-- APPAREL - Tailoring
-- ============================================================================

INSERT INTO public.products (name, description, price, image_url, category, subcategory, in_stock, specs)
VALUES 
  (
    'Apollo Suit - Navy',
    'Italian wool. Peak lapel. Tailored presence.',
    2800.00,
    '/src/assets/collection-tailoring.jpg',
    'apparel',
    'tailoring',
    true,
    '{"Fabric": "Super 120s Wool", "Origin": "Italian", "Details": "Peak Lapel, Working Buttonholes", "Fit": "Modern Slim"}'::jsonb
  ),
  (
    'Consul Sport Coat - Grey',
    'Versatile elegance. Unconstructed. Italian cashmere blend.',
    1650.00,
    '/src/assets/collection-tailoring.jpg',
    'apparel',
    'tailoring',
    true,
    '{"Fabric": "Cashmere Wool Blend", "Construction": "Unconstructed", "Buttons": "Horn", "Fit": "Relaxed"}'::jsonb
  ),
  (
    'Senator Tuxedo',
    'Peak lapel. Silk facing. Black tie authority.',
    3200.00,
    '/src/assets/collection-tailoring.jpg',
    'apparel',
    'tailoring',
    true,
    '{"Fabric": "Super 150s Wool", "Lapel": "Peak, Silk Grosgrain", "Buttons": "Covered", "Fit": "Classic"}'::jsonb
  ),
  (
    'Tribune Trousers - Charcoal',
    'Wool gabardine. Flat front. Dress with purpose.',
    420.00,
    '/src/assets/collection-tailoring.jpg',
    'apparel',
    'tailoring',
    true,
    '{"Fabric": "Wool Gabardine", "Front": "Flat", "Pockets": "Slash, Back Welt", "Hem": "Unfinished"}'::jsonb
  ),
  (
    'Philosopher Vest',
    'Three-piece essential. Shawl collar. Refined layers.',
    580.00,
    '/src/assets/collection-tailoring.jpg',
    'apparel',
    'tailoring',
    true,
    '{"Fabric": "Matching Suit Wool", "Collar": "Shawl", "Back": "Silk", "Buttons": "6 Front"}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- APPAREL - Outerwear
INSERT INTO public.products (name, description, price, image_url, category, subcategory, in_stock, specs)
VALUES 
  (
    'Imperium Overcoat',
    'Camel hair. Single breasted. Timeless protection.',
    1850.00,
    '/src/assets/collection-tailoring.jpg',
    'apparel',
    'outerwear',
    true,
    '{"Fabric": "Camel Hair", "Length": "Knee", "Lining": "Full Silk", "Origin": "Italian"}'::jsonb
  ),
  (
    'Field Jacket - Olive',
    'Waxed canvas. Multiple pockets. Modern military.',
    680.00,
    '/src/assets/collection-tailoring.jpg',
    'apparel',
    'outerwear',
    true,
    '{"Fabric": "Waxed Canvas", "Lining": "Quilted", "Pockets": "6 Total", "Hardware": "Brass"}'::jsonb
  ),
  (
    'Leather Bomber',
    'Italian lamb leather. Knit collar. Aviation heritage.',
    1450.00,
    '/src/assets/collection-leather.jpg',
    'apparel',
    'outerwear',
    true,
    '{"Leather": "Lambskin", "Collar": "Knit", "Lining": "Quilted Nylon", "Hardware": "YKK Zips"}'::jsonb
  ),
  (
    'Cashmere Topcoat',
    'Pure cashmere. Herringbone. Investment piece.',
    2400.00,
    '/src/assets/collection-tailoring.jpg',
    'apparel',
    'outerwear',
    true,
    '{"Fabric": "100% Cashmere", "Pattern": "Herringbone", "Origin": "Scottish", "Buttons": "Horn"}'::jsonb
  ),
  (
    'Rain Mac - Navy',
    'Technical fabric. Classic cut. Function meets form.',
    780.00,
    '/src/assets/collection-tailoring.jpg',
    'apparel',
    'outerwear',
    true,
    '{"Fabric": "Bonded Cotton", "Features": "Waterproof, Breathable", "Details": "Hidden Hood", "Fit": "Regular"}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- APPAREL - Shirting
INSERT INTO public.products (name, description, price, image_url, category, subcategory, in_stock, specs)
VALUES 
  (
    'Oxford Shirt - White',
    'Egyptian cotton. Button-down collar. Foundation piece.',
    185.00,
    '/src/assets/collection-tailoring.jpg',
    'apparel',
    'shirting',
    true,
    '{"Fabric": "Egyptian Cotton Oxford", "Collar": "Button-Down", "Fit": "Classic", "Made": "Portugal"}'::jsonb
  ),
  (
    'Dress Shirt - Blue',
    'Italian poplin. Spread collar. Boardroom ready.',
    220.00,
    '/src/assets/collection-tailoring.jpg',
    'apparel',
    'shirting',
    true,
    '{"Fabric": "Italian Poplin", "Collar": "Spread", "Cuffs": "French", "Fit": "Slim"}'::jsonb
  ),
  (
    'Linen Shirt - Natural',
    'Irish linen. Relaxed fit. Summer sophistication.',
    195.00,
    '/src/assets/collection-tailoring.jpg',
    'apparel',
    'shirting',
    true,
    '{"Fabric": "Irish Linen", "Collar": "Camp", "Fit": "Relaxed", "Buttons": "Mother of Pearl"}'::jsonb
  ),
  (
    'Flannel Shirt - Charcoal',
    'Wool flannel. Substantial weight. Autumn essential.',
    245.00,
    '/src/assets/collection-tailoring.jpg',
    'apparel',
    'shirting',
    true,
    '{"Fabric": "Wool Flannel", "Pattern": "Solid", "Details": "Elbow Patches", "Origin": "Scottish"}'::jsonb
  ),
  (
    'Henley - Black',
    'Supima cotton. Three-button placket. Casual authority.',
    120.00,
    '/src/assets/collection-tailoring.jpg',
    'apparel',
    'shirting',
    true,
    '{"Fabric": "Supima Cotton", "Weight": "Medium", "Buttons": "3", "Fit": "Modern"}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- APPAREL - Loungewear
INSERT INTO public.products (name, description, price, image_url, category, subcategory, in_stock, specs)
VALUES 
  (
    'Cashmere Robe',
    'Pure cashmere. Shawl collar. Private luxury.',
    680.00,
    '/src/assets/collection-tailoring.jpg',
    'apparel',
    'loungewear',
    true,
    '{"Fabric": "100% Cashmere", "Length": "Knee", "Collar": "Shawl", "Pockets": "2"}'::jsonb
  ),
  (
    'Silk Pajama Set',
    'Mulberry silk. Contrast piping. Sleep in elegance.',
    420.00,
    '/src/assets/collection-tailoring.jpg',
    'apparel',
    'loungewear',
    true,
    '{"Fabric": "Mulberry Silk", "Pieces": "Top & Bottoms", "Details": "Contrast Piping", "Colors": "Navy, Charcoal"}'::jsonb
  ),
  (
    'Merino Lounge Pants',
    'Fine merino. Tapered fit. Sophisticated comfort.',
    180.00,
    '/src/assets/collection-tailoring.jpg',
    'apparel',
    'loungewear',
    true,
    '{"Fabric": "Merino Wool", "Fit": "Tapered", "Waist": "Drawstring", "Pockets": "Side & Back"}'::jsonb
  ),
  (
    'Cotton Polo - Navy',
    'Pique cotton. Ribbed collar. Elevated basics.',
    145.00,
    '/src/assets/collection-tailoring.jpg',
    'apparel',
    'loungewear',
    true,
    '{"Fabric": "Cotton Pique", "Collar": "Ribbed", "Buttons": "3", "Fit": "Regular"}'::jsonb
  ),
  (
    'Cashmere Sweater',
    'Crew neck. Lightweight. Year-round layering.',
    480.00,
    '/src/assets/collection-tailoring.jpg',
    'apparel',
    'loungewear',
    true,
    '{"Fabric": "100% Cashmere", "Neck": "Crew", "Weight": "Lightweight", "Origin": "Scottish"}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- HOME & RITUAL - Desk Objects
-- ============================================================================

INSERT INTO public.products (name, description, price, image_url, category, subcategory, in_stock, specs)
VALUES 
  (
    'Apollo Fountain Pen',
    'German resin. Gold nib. Your signature instrument.',
    580.00,
    '/src/assets/object-pen.jpg',
    'home-ritual',
    'desk-objects',
    true,
    '{"Material": "Premium Resin", "Nib": "18K Gold", "Fill": "Cartridge/Converter", "Origin": "German"}'::jsonb
  ),
  (
    'Marble Desk Set',
    'Pen holder. Card stand. Letter opener. Command center.',
    420.00,
    '/src/assets/object-pen.jpg',
    'home-ritual',
    'desk-objects',
    true,
    '{"Material": "Carrara Marble", "Pieces": "3", "Base": "Brass", "Finish": "Polished"}'::jsonb
  ),
  (
    'Leather Desk Pad',
    'Italian leather. Protects, elevates. Daily ritual.',
    280.00,
    '/src/assets/collection-leather.jpg',
    'home-ritual',
    'desk-objects',
    true,
    '{"Leather": "Full Grain", "Size": "24x18 inches", "Backing": "Non-slip", "Colors": "Black, Cognac"}'::jsonb
  ),
  (
    'Bronze Bookends',
    'Solid bronze. Roman columns. Hold your library.',
    340.00,
    '/src/assets/object-accessories.jpg',
    'home-ritual',
    'desk-objects',
    true,
    '{"Material": "Solid Bronze", "Weight": "Heavy", "Finish": "Patina", "Height": "8 inches"}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- HOME & RITUAL - Spirits & Barware
INSERT INTO public.products (name, description, price, image_url, category, subcategory, in_stock, specs)
VALUES 
  (
    'Crystal Decanter Set',
    'Lead-free crystal. Four glasses. Ritual refreshment.',
    680.00,
    '/src/assets/object-accessories.jpg',
    'home-ritual',
    'spirits-barware',
    true,
    '{"Material": "Lead-Free Crystal", "Pieces": "Decanter + 4 Glasses", "Capacity": "750ml", "Origin": "Czech"}'::jsonb
  ),
  (
    'Cocktail Tool Set',
    'Stainless steel. Leather case. Master mixology.',
    320.00,
    '/src/assets/object-accessories.jpg',
    'home-ritual',
    'spirits-barware',
    true,
    '{"Pieces": "Shaker, Strainer, Jigger, Spoon", "Material": "Stainless Steel", "Case": "Leather Roll"}'::jsonb
  ),
  (
    'Whiskey Stones',
    'Soapstone. Chill without dilution. Set of 9.',
    85.00,
    '/src/assets/object-accessories.jpg',
    'home-ritual',
    'spirits-barware',
    true,
    '{"Material": "Soapstone", "Quantity": "9 Cubes", "Storage": "Wooden Box", "Feature": "No Dilution"}'::jsonb
  ),
  (
    'Bar Cart - Brass',
    'Brass frame. Smoked glass. Mobile elegance.',
    1450.00,
    '/src/assets/object-accessories.jpg',
    'home-ritual',
    'spirits-barware',
    true,
    '{"Frame": "Solid Brass", "Shelves": "2 Tiers, Smoked Glass", "Wheels": "Casters", "Finish": "Polished"}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- HOME & RITUAL - Grooming
INSERT INTO public.products (name, description, price, image_url, category, subcategory, in_stock, specs)
VALUES 
  (
    'Safety Razor Set',
    'Chrome finish. Badger brush. Traditional mastery.',
    280.00,
    '/src/assets/object-accessories.jpg',
    'home-ritual',
    'grooming',
    true,
    '{"Pieces": "Razor, Brush, Stand", "Finish": "Chrome", "Brush": "Badger Hair", "Blades": "10 Included"}'::jsonb
  ),
  (
    'Grooming Kit',
    'Leather case. Scissors, comb, tweezers. Travel ready.',
    185.00,
    '/src/assets/collection-leather.jpg',
    'home-ritual',
    'grooming',
    true,
    '{"Case": "Leather Roll", "Tools": "Scissors, Comb, Tweezers, Nail File", "Material": "Stainless Steel"}'::jsonb
  ),
  (
    'Cologne - House Signature',
    'Bergamot, leather, smoke. Your olfactory signature.',
    195.00,
    '/src/assets/object-accessories.jpg',
    'home-ritual',
    'grooming',
    true,
    '{"Notes": "Bergamot, Leather, Smoke", "Size": "100ml", "Type": "Eau de Parfum", "Origin": "French"}'::jsonb
  ),
  (
    'Hair Pomade',
    'Medium hold. Natural finish. Daily discipline.',
    42.00,
    '/src/assets/object-accessories.jpg',
    'home-ritual',
    'grooming',
    true,
    '{"Hold": "Medium", "Finish": "Natural", "Scent": "Sandalwood", "Size": "4oz"}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- HOME & RITUAL - Books & Learning
INSERT INTO public.products (name, description, price, image_url, category, subcategory, in_stock, specs)
VALUES 
  (
    'Meditations - Leather Bound',
    'Marcus Aurelius. Gold gilt. Your philosophical foundation.',
    120.00,
    '/src/assets/object-pen.jpg',
    'home-ritual',
    'books-learning',
    true,
    '{"Binding": "Leather", "Pages": "Gold Gilt", "Size": "Pocket", "Translation": "Modern English"}'::jsonb
  ),
  (
    'Letters from a Stoic',
    'Seneca. Cloth binding. Practical wisdom.',
    85.00,
    '/src/assets/object-pen.jpg',
    'home-ritual',
    'books-learning',
    true,
    '{"Binding": "Cloth", "Edition": "Annotated", "Size": "Standard", "Introduction": "Modern Commentary"}'::jsonb
  ),
  (
    'The Manual - Epictetus',
    'Pocket edition. Daily carry. Essential teachings.',
    65.00,
    '/src/assets/object-pen.jpg',
    'home-ritual',
    'books-learning',
    true,
    '{"Size": "Pocket", "Binding": "Flexible", "Pages": "240", "Format": "Portable"}'::jsonb
  ),
  (
    'Apollo Library Collection',
    '10 essential volumes. Curated philosophy. Foundation set.',
    850.00,
    '/src/assets/object-pen.jpg',
    'home-ritual',
    'books-learning',
    true,
    '{"Books": "10 Volumes", "Authors": "Marcus Aurelius, Seneca, Epictetus, Others", "Binding": "Mixed", "Box": "Wooden"}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- PRINT & MEDIA
-- ============================================================================

INSERT INTO public.products (name, description, price, image_url, category, subcategory, in_stock, specs)
VALUES 
  (
    'Apollo Journal',
    'Leather cover. Numbered pages. Document your mastery.',
    95.00,
    '/src/assets/object-pen.jpg',
    'print-media',
    'journals',
    true,
    '{"Cover": "Leather", "Pages": "240 Numbered", "Paper": "Acid-Free", "Ribbon": "Bookmark Included"}'::jsonb
  ),
  (
    'Daily Reflection Journal',
    'Morning and evening prompts. Structured introspection.',
    78.00,
    '/src/assets/object-pen.jpg',
    'print-media',
    'journals',
    true,
    '{"Format": "Guided Prompts", "Duration": "365 Days", "Binding": "Hardcover", "Size": "A5"}'::jsonb
  ),
  (
    'Commonplace Book',
    'Blank pages. Your intellectual repository. Unstructured wisdom.',
    120.00,
    '/src/assets/object-pen.jpg',
    'print-media',
    'journals',
    true,
    '{"Pages": "300 Blank", "Cover": "Leather", "Paper": "Fountain Pen Friendly", "Closure": "Elastic"}'::jsonb
  ),
  (
    'Philosophy Quarterly',
    'Subscription. Four issues. Modern stoic essays.',
    180.00,
    '/src/assets/object-pen.jpg',
    'print-media',
    'philosophy',
    true,
    '{"Type": "Annual Subscription", "Issues": "4 per Year", "Format": "Print + Digital", "Content": "Essays, Interviews"}'::jsonb
  ),
  (
    'Essential Philosophy Set',
    'Three foundational texts. Modern translations. Starter pack.',
    220.00,
    '/src/assets/object-pen.jpg',
    'print-media',
    'philosophy',
    true,
    '{"Books": "3", "Authors": "Marcus Aurelius, Seneca, Epictetus", "Binding": "Hardcover", "Box": "Slipcase"}'::jsonb
  ),
  (
    'Digital Archive Access',
    'Full library. Searchable. Lifetime access.',
    500.00,
    '/src/assets/object-pen.jpg',
    'print-media',
    'digital-archives',
    false,
    '{"Type": "Digital Membership", "Access": "Lifetime", "Content": "200+ Texts", "Format": "PDF, EPUB"}'::jsonb
  ),
  (
    'Apollo Podcast Archive',
    'Complete collection. Expert interviews. Audio wisdom.',
    120.00,
    '/src/assets/object-pen.jpg',
    'print-media',
    'digital-archives',
    true,
    '{"Type": "Digital Audio", "Episodes": "100+", "Format": "MP3", "Access": "Download"}'::jsonb
  ),
  (
    'Video Course - Stoic Leadership',
    '12 modules. Practical application. Modern management.',
    780.00,
    '/src/assets/object-pen.jpg',
    'print-media',
    'digital-archives',
    true,
    '{"Format": "Video Course", "Modules": "12", "Duration": "8 Hours", "Access": "Lifetime"}'::jsonb
  )
ON CONFLICT DO NOTHING;
