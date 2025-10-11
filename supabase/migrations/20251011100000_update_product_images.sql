/*
  # Update Product Images for Apollo Catalog

  ## Overview
  Add high-quality product images using Unsplash for all Apollo catalog products.
  Images are organized by category to maintain visual consistency.

  ## Categories Updated
  - Timepieces: Luxury watch photography
  - Accessories: Jewelry and accessory shots
  - Leather Goods: Premium leather products
  - Apparel: Tailored menswear
  - Home & Ritual: Lifestyle and home objects
  - Print & Media: Books and journals

  ## Image Sources
  Using Unsplash API with specific search terms for luxury product photography
*/

-- ============================================================================
-- TIMEPIECES
-- ============================================================================

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80'
WHERE name = 'Solis Automatic';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80'
WHERE name = 'Meridian GMT';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80'
WHERE name = 'Equinox Chronograph';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1611763173876-c54e38d85315?w=800&q=80'
WHERE name = 'Aether Moonphase';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80'
WHERE name = 'Imperium Dress Watch';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1595625151390-6c43f1d94e85?w=800&q=80'
WHERE name = 'Consul Regulator';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800&q=80'
WHERE name = 'Senator Perpetual Calendar';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=800&q=80'
WHERE name = 'Tribune Tourbillon';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80'
WHERE name = 'Apollo Heritage 1962';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=800&q=80'
WHERE name = 'Marcus Aurelius Limited';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1618280355039-dfb2a9b4c0e6?w=800&q=80'
WHERE name = 'Seneca Field Watch';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1548171915-e79a380a4c28?w=800&q=80'
WHERE name = 'Cicero Pilot Chronograph';

-- ============================================================================
-- ACCESSORIES - Cufflinks & Jewelry
-- ============================================================================

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1610527009544-67a38e0d4682?w=800&q=80'
WHERE name = 'Imperium Cufflinks';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'
WHERE name = 'Senatorial Onyx Set';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1542779632-539b861a1c1b?w=800&q=80'
WHERE name = 'Stoic Signet Studs';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1629196923032-627d3db8f0e9?w=800&q=80'
WHERE name = 'Legion Lapel Pin';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80'
WHERE name = 'Philosopher Signet Ring';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&q=80'
WHERE name = 'Tribune Band';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80'
WHERE name = 'Centurion Black Ring';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'
WHERE name = 'Apollo Chain';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'
WHERE name = 'Stoic Medallion';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'
WHERE name = 'Emperor Pendant';

-- ACCESSORIES - Pocket Squares
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80'
WHERE name = 'Silk Square - Imperial Gold';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80'
WHERE name = 'Linen Square - Stone';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80'
WHERE name = 'Wool Square Set';

-- ============================================================================
-- LEATHER GOODS
-- ============================================================================

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80'
WHERE name = 'Senator Bifold';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1606667209337-c2b7c5b1501e?w=800&q=80'
WHERE name = 'Consul Money Clip';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'
WHERE name = 'Tribune Travel Wallet';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1614016160-5e81746d5347?w=800&q=80'
WHERE name = 'Stoic Card Case';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80'
WHERE name = 'Imperium Business Holder';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'
WHERE name = 'Apollo Folio';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80'
WHERE name = 'Executive Portfolio';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1623660946824-10abdc0d7794?w=800&q=80'
WHERE name = 'Seneca Briefcase';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80'
WHERE name = 'Traveler Duffel';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'
WHERE name = 'Daily Messenger';

-- ============================================================================
-- APPAREL
-- ============================================================================

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=800&q=80'
WHERE name = 'Apollo Suit - Navy';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80'
WHERE name = 'Consul Sport Coat - Grey';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1617127365908-c0f1d53eb31c?w=800&q=80'
WHERE name = 'Senator Tuxedo';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80'
WHERE name = 'Tribune Trousers - Charcoal';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1592878849036-f9051c5f0c2f?w=800&q=80'
WHERE name = 'Philosopher Vest';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80'
WHERE name = 'Imperium Overcoat';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80'
WHERE name = 'Field Jacket - Olive';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80'
WHERE name = 'Leather Bomber';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1544923408-75c5cef46f14?w=800&q=80'
WHERE name = 'Cashmere Topcoat';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80'
WHERE name = 'Rain Mac - Navy';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80'
WHERE name = 'Oxford Shirt - White';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&q=80'
WHERE name = 'Dress Shirt - Blue';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80'
WHERE name = 'Linen Shirt - Natural';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80'
WHERE name = 'Flannel Shirt - Charcoal';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=800&q=80'
WHERE name = 'Henley - Black';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=800&q=80'
WHERE name = 'Cashmere Robe';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80'
WHERE name = 'Silk Pajama Set';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80'
WHERE name = 'Merino Lounge Pants';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800&q=80'
WHERE name = 'Cotton Polo - Navy';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1620799140195-e2457d91c5b8?w=800&q=80'
WHERE name = 'Cashmere Sweater';

-- ============================================================================
-- HOME & RITUAL
-- ============================================================================

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1585314062604-1a357de8b000?w=800&q=80'
WHERE name = 'Apollo Fountain Pen';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=800&q=80'
WHERE name = 'Marble Desk Set';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1595452767848-1c0619b9d93a?w=800&q=80'
WHERE name = 'Leather Desk Pad';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80'
WHERE name = 'Bronze Bookends';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80'
WHERE name = 'Crystal Decanter Set';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1598520106830-8c45c2035460?w=800&q=80'
WHERE name = 'Cocktail Tool Set';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&q=80'
WHERE name = 'Whiskey Stones';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=800&q=80'
WHERE name = 'Bar Cart - Brass';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=800&q=80'
WHERE name = 'Safety Razor Set';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80'
WHERE name = 'Grooming Kit';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=800&q=80'
WHERE name = 'Cologne - House Signature';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=800&q=80'
WHERE name = 'Hair Pomade';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80'
WHERE name = 'Meditations - Leather Bound';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80'
WHERE name = 'Letters from a Stoic';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=800&q=80'
WHERE name = 'The Manual - Epictetus';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80'
WHERE name = 'Apollo Library Collection';

-- ============================================================================
-- PRINT & MEDIA
-- ============================================================================

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1531346590-06bf491d0d5f?w=800&q=80'
WHERE name = 'Apollo Journal';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80'
WHERE name = 'Daily Reflection Journal';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80'
WHERE name = 'Commonplace Book';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80'
WHERE name = 'Philosophy Quarterly';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80'
WHERE name = 'Essential Philosophy Set';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80'
WHERE name = 'Digital Archive Access';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80'
WHERE name = 'Apollo Podcast Archive';

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80'
WHERE name = 'Video Course - Stoic Leadership';
