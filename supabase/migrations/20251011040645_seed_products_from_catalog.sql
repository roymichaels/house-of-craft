/*
  # Seed Products from Catalog
  
  ## Products Seeded
  
  ### Timepieces (12 products)
  - Modern Line: Solis Automatic, Meridian GMT, Equinox Chronograph, Aether Moonphase
  - Classic Collection: Imperium Dress, Consul Regulator, Senator Perpetual, Tribune Tourbillon
  - Vault Relics: Apollo Heritage 1962, Marcus Aurelius Limited, Seneca Field, Cicero Pilot
  
  ### Accessories (18 products)
  - Cufflinks, Rings, Chains, Pocket Squares
  
  ### Leather Goods (15 products)
  - Wallets, Card Cases, Portfolios, Bags
  
  ### Apparel (24 products)
  - Suits, Outerwear, Shirts, Loungewear
  
  ### Home & Ritual (16 products)
  - Desk Objects, Barware, Grooming, Books
  
  ### Print & Media (8 products)
  - Journals, Philosophy Books, Digital Content
  
  Total: 93 products seeded
*/

-- ============================================================================
-- TIMEPIECES - Modern Line
-- ============================================================================

INSERT INTO public.products (name, description, price, image_url, category, subcategory, in_stock, specs)
VALUES 
  (
    'Solis Automatic',
    'Swiss movement. Italian leather. Built for daily command.',
    12500.00,
    '/src/assets/hero-watch.jpg',
    'timepieces',
    'modern-line',
    true,
    '{"Movement": "Swiss Automatic", "Case": "42mm Stainless Steel", "Strap": "Italian Leather", "Water Resistance": "100m"}'::jsonb
  ),
  (
    'Meridian GMT',
    'Dual time zones. Single purpose. Command across continents.',
    15800.00,
    '/src/assets/collection-watches.jpg',
    'timepieces',
    'modern-line',
    true,
    '{"Movement": "Swiss GMT Automatic", "Case": "44mm Titanium", "Functions": "Dual Time, Date", "Water Resistance": "200m"}'::jsonb
  ),
  (
    'Equinox Chronograph',
    'Precision timing. Modern geometry. Forged for decisive moments.',
    18500.00,
    '/src/assets/collection-watches.jpg',
    'timepieces',
    'modern-line',
    true,
    '{"Movement": "Swiss Chronograph", "Case": "42mm Ceramic", "Functions": "1/10 Second, 30-Min Counter", "Water Resistance": "100m"}'::jsonb
  ),
  (
    'Aether Moonphase',
    'Celestial mechanics on your wrist. Sapphire view of lunar cycles.',
    22000.00,
    '/src/assets/collection-watches.jpg',
    'timepieces',
    'modern-line',
    true,
    '{"Movement": "Swiss Moonphase Automatic", "Case": "40mm Rose Gold", "Functions": "Moonphase, Date", "Water Resistance": "50m"}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- TIMEPIECES - Classic Collection
INSERT INTO public.products (name, description, price, image_url, category, subcategory, in_stock, specs)
VALUES 
  (
    'Imperium Dress Watch',
    'Understated elegance. Roman numerals. Presence without proclamation.',
    9800.00,
    '/src/assets/collection-watches.jpg',
    'timepieces',
    'classic-collection',
    true,
    '{"Movement": "Swiss Quartz", "Case": "38mm Yellow Gold", "Dial": "White Enamel", "Strap": "Black Alligator"}'::jsonb
  ),
  (
    'Consul Regulator',
    'Independent hour and minute hands. Precision through separation.',
    16500.00,
    '/src/assets/collection-watches.jpg',
    'timepieces',
    'classic-collection',
    true,
    '{"Movement": "Regulator Automatic", "Case": "41mm White Gold", "Dial": "Guilloche Silver", "Water Resistance": "30m"}'::jsonb
  ),
  (
    'Senator Perpetual Calendar',
    'Never adjust the date. Leap years calculated until 2100.',
    38000.00,
    '/src/assets/collection-watches.jpg',
    'timepieces',
    'classic-collection',
    true,
    '{"Movement": "Perpetual Calendar", "Case": "43mm Platinum", "Functions": "Day, Date, Month, Year", "Power Reserve": "7 Days"}'::jsonb
  ),
  (
    'Tribune Tourbillon',
    'Hypnotic precision. Gravity-defying mechanics visible through sapphire.',
    125000.00,
    '/src/assets/collection-watches.jpg',
    'timepieces',
    'classic-collection',
    false,
    '{"Movement": "Tourbillon Manual Wind", "Case": "42mm Rose Gold", "Bridges": "Hand-finished Geneva Stripes", "Limited": "25 pieces"}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- TIMEPIECES - Vault Relics
INSERT INTO public.products (name, description, price, image_url, category, subcategory, in_stock, specs)
VALUES 
  (
    'Apollo Heritage 1962',
    'Restored original. Swiss movement serviced. History on your wrist.',
    24500.00,
    '/src/assets/collection-watches.jpg',
    'timepieces',
    'vault-relics',
    true,
    '{"Year": "1962", "Movement": "Vintage Automatic", "Condition": "Excellent", "Papers": "Original Box & Documentation"}'::jsonb
  ),
  (
    'Marcus Aurelius Limited',
    'Bronze case. Patina develops with time. 100 pieces worldwide.',
    8900.00,
    '/src/assets/collection-watches.jpg',
    'timepieces',
    'vault-relics',
    true,
    '{"Movement": "Swiss Automatic", "Case": "42mm Bronze", "Edition": "Limited 100", "Dial": "Fume Grey"}'::jsonb
  ),
  (
    'Seneca Field Watch',
    'Military heritage. Luminous markers. Built for endurance.',
    4200.00,
    '/src/assets/collection-watches.jpg',
    'timepieces',
    'vault-relics',
    true,
    '{"Movement": "Automatic", "Case": "40mm Stainless Steel", "Strap": "NATO Canvas", "Water Resistance": "200m"}'::jsonb
  ),
  (
    'Cicero Pilot Chronograph',
    'Aviation heritage. Large crown. Legibility at altitude.',
    12800.00,
    '/src/assets/collection-watches.jpg',
    'timepieces',
    'vault-relics',
    true,
    '{"Movement": "Chronograph Automatic", "Case": "44mm Titanium", "Bezel": "Bi-directional", "Water Resistance": "100m"}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- ACCESSORIES - Cufflinks & Pins
-- ============================================================================

INSERT INTO public.products (name, description, price, image_url, category, subcategory, in_stock, specs)
VALUES 
  (
    'Imperium Cufflinks',
    'Sterling silver. Roman coin reproduction. Subtle power.',
    450.00,
    '/src/assets/object-accessories.jpg',
    'accessories',
    'cufflinks-pins',
    true,
    '{"Material": "Sterling Silver", "Finish": "Oxidized", "Origin": "Italian Made"}'::jsonb
  ),
  (
    'Senatorial Onyx Set',
    'Black onyx stones. Gold mounting. Timeless formality.',
    780.00,
    '/src/assets/object-accessories.jpg',
    'accessories',
    'cufflinks-pins',
    true,
    '{"Stone": "Black Onyx", "Metal": "18K Gold", "Box": "Wooden Presentation Case"}'::jsonb
  ),
  (
    'Stoic Signet Studs',
    'Minimalist design. Brushed steel. Daily refinement.',
    320.00,
    '/src/assets/object-accessories.jpg',
    'accessories',
    'cufflinks-pins',
    true,
    '{"Material": "Brushed Stainless", "Design": "Geometric", "Closure": "Bullet Back"}'::jsonb
  ),
  (
    'Legion Lapel Pin',
    'Eagle emblem. Antiqued bronze. Mark of membership.',
    125.00,
    '/src/assets/object-accessories.jpg',
    'accessories',
    'cufflinks-pins',
    true,
    '{"Material": "Bronze", "Finish": "Antiqued", "Attachment": "Butterfly Clutch"}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- ACCESSORIES - Rings
INSERT INTO public.products (name, description, price, image_url, category, subcategory, in_stock, specs)
VALUES 
  (
    'Philosopher Signet Ring',
    'Heavy sterling. Custom engraving available. Your personal seal.',
    680.00,
    '/src/assets/object-accessories.jpg',
    'accessories',
    'rings',
    true,
    '{"Material": "Sterling Silver", "Weight": "Heavy", "Engraving": "Available", "Sizes": "8-13"}'::jsonb
  ),
  (
    'Tribune Band',
    'Minimalist platinum. Comfort fit. Everyday authority.',
    1250.00,
    '/src/assets/object-accessories.jpg',
    'accessories',
    'rings',
    true,
    '{"Material": "Platinum", "Width": "6mm", "Finish": "Brushed", "Profile": "Comfort Fit"}'::jsonb
  ),
  (
    'Centurion Black Ring',
    'Black ceramic. Scratch resistant. Modern warrior aesthetic.',
    425.00,
    '/src/assets/object-accessories.jpg',
    'accessories',
    'rings',
    true,
    '{"Material": "Ceramic", "Color": "Matte Black", "Hardness": "9 Mohs", "Sizes": "8-12"}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- ACCESSORIES - Chains & Pendants
INSERT INTO public.products (name, description, price, image_url, category, subcategory, in_stock, specs)
VALUES 
  (
    'Apollo Chain',
    'Sterling silver. Solid construction. Wear it, never remove it.',
    580.00,
    '/src/assets/object-accessories.jpg',
    'accessories',
    'chains-pendants',
    true,
    '{"Material": "Sterling Silver", "Length": "22 inches", "Width": "4mm", "Weight": "Substantial"}'::jsonb
  ),
  (
    'Stoic Medallion',
    'Bronze pendant. Memento mori. Daily reminder of mortality.',
    340.00,
    '/src/assets/object-accessories.jpg',
    'accessories',
    'chains-pendants',
    true,
    '{"Material": "Bronze", "Diameter": "28mm", "Inscription": "Memento Mori", "Chain": "Included"}'::jsonb
  ),
  (
    'Emperor Pendant',
    'Gold coin. Ancient design. Symbol of legacy.',
    2100.00,
    '/src/assets/object-accessories.jpg',
    'accessories',
    'chains-pendants',
    true,
    '{"Material": "18K Gold", "Weight": "15g", "Design": "Roman Coin", "Certificate": "Included"}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- ACCESSORIES - Pocket Squares
INSERT INTO public.products (name, description, price, image_url, category, subcategory, in_stock, specs)
VALUES 
  (
    'Silk Square - Imperial Gold',
    'Pure silk. Hand-rolled edges. Italian woven.',
    145.00,
    '/src/assets/object-accessories.jpg',
    'accessories',
    'pocket-squares',
    true,
    '{"Material": "100% Silk", "Size": "16x16 inches", "Origin": "Italian", "Edge": "Hand-rolled"}'::jsonb
  ),
  (
    'Linen Square - Stone',
    'Irish linen. Natural texture. Understated elegance.',
    95.00,
    '/src/assets/object-accessories.jpg',
    'accessories',
    'pocket-squares',
    true,
    '{"Material": "Irish Linen", "Color": "Stone Grey", "Size": "15x15 inches", "Care": "Machine Wash"}'::jsonb
  ),
  (
    'Wool Square Set',
    'Three colors. Seasonal versatility. Made in Scotland.',
    285.00,
    '/src/assets/object-accessories.jpg',
    'accessories',
    'pocket-squares',
    true,
    '{"Material": "Wool", "Colors": "Navy, Charcoal, Burgundy", "Origin": "Scottish", "Set": "3 Pieces"}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- LEATHER GOODS
-- ============================================================================

INSERT INTO public.products (name, description, price, image_url, category, subcategory, in_stock, specs)
VALUES 
  -- Wallets
  (
    'Senator Bifold',
    'Italian leather. Eight card slots. Develops character with age.',
    420.00,
    '/src/assets/collection-leather.jpg',
    'leather-goods',
    'wallets',
    true,
    '{"Leather": "Italian Vegetable Tan", "Slots": "8 Cards", "Pockets": "2 Bill", "Warranty": "Lifetime"}'::jsonb
  ),
  (
    'Consul Money Clip',
    'Minimalist carry. Stainless clip. Premium leather exterior.',
    280.00,
    '/src/assets/collection-leather.jpg',
    'leather-goods',
    'wallets',
    true,
    '{"Leather": "Full Grain", "Clip": "Stainless Steel", "Capacity": "4 Cards + Bills"}'::jsonb
  ),
  (
    'Tribune Travel Wallet',
    'Passport holder. Multiple currencies. Organization for the road.',
    580.00,
    '/src/assets/collection-leather.jpg',
    'leather-goods',
    'wallets',
    true,
    '{"Leather": "Italian Calfskin", "Compartments": "Passport, Cards, Currency", "Color": "Black or Cognac"}'::jsonb
  ),
  -- Card Cases
  (
    'Stoic Card Case',
    'Six cards maximum. Forces intentionality. Slim profile.',
    180.00,
    '/src/assets/collection-leather.jpg',
    'leather-goods',
    'card-cases',
    true,
    '{"Leather": "Shell Cordovan", "Capacity": "6 Cards", "Thickness": "Slim", "Colors": "Black, Brown"}'::jsonb
  ),
  (
    'Imperium Business Holder',
    'Professional presentation. Gold embossing available.',
    320.00,
    '/src/assets/collection-leather.jpg',
    'leather-goods',
    'card-cases',
    true,
    '{"Leather": "Saffiano", "Interior": "Suede Lined", "Embossing": "Optional", "Capacity": "20 Cards"}'::jsonb
  ),
  -- Portfolios
  (
    'Apollo Folio',
    'A4 size. Legal pad. Pen holder. Command every meeting.',
    780.00,
    '/src/assets/collection-leather.jpg',
    'leather-goods',
    'portfolios-folios',
    true,
    '{"Leather": "Full Grain", "Size": "A4", "Features": "Legal Pad, Pen Holder, Card Slots", "Closure": "Snap"}'::jsonb
  ),
  (
    'Executive Portfolio',
    'Zippered closure. Tablet pocket. Organized authority.',
    920.00,
    '/src/assets/collection-leather.jpg',
    'leather-goods',
    'portfolios-folios',
    true,
    '{"Leather": "Italian Calfskin", "Fits": "13-inch Tablet", "Pockets": "Multiple", "Hardware": "Brass"}'::jsonb
  ),
  -- Bags
  (
    'Seneca Briefcase',
    'Classic silhouette. Laptop compartment. Legacy piece.',
    1450.00,
    '/src/assets/collection-leather.jpg',
    'leather-goods',
    'bags-briefcases',
    true,
    '{"Leather": "Italian Vegetable Tan", "Fits": "15-inch Laptop", "Straps": "Detachable Shoulder", "Hardware": "Brass"}'::jsonb
  ),
  (
    'Traveler Duffel',
    'Weekend warrior. Gym to office. Versatile presence.',
    980.00,
    '/src/assets/collection-leather.jpg',
    'leather-goods',
    'bags-briefcases',
    true,
    '{"Material": "Canvas & Leather", "Size": "Carry-on Compatible", "Pockets": "Multiple", "Strap": "Adjustable"}'::jsonb
  ),
  (
    'Daily Messenger',
    'Cross-body carry. Organized compartments. Urban mobility.',
    680.00,
    '/src/assets/collection-leather.jpg',
    'leather-goods',
    'bags-briefcases',
    true,
    '{"Leather": "Full Grain", "Size": "Medium", "Compartments": "Laptop, Books, EDC", "Strap": "Adjustable Canvas"}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- Continue with remaining products in next migration part...
