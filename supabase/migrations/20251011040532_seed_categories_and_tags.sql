/*
  # Seed Categories and Tags
  
  ## Categories Seeded
  1. **Timepieces** - Modern Line, Classic Collection, Vault Relics
  2. **Accessories** - Cufflinks & Pins, Rings, Chains & Pendants, Pocket Squares
  3. **Leather Goods** - Wallets, Card Cases, Portfolios, Bags
  4. **Apparel** - Tailoring, Outerwear, Shirting, Loungewear
  5. **Home & Ritual** - Desk Objects, Spirits & Barware, Grooming, Books
  6. **Print & Media** - Journals, Philosophy Texts, Digital Archives
  
  ## Tags Seeded
  - New Arrival
  - Featured
  - Limited Edition
  - Best Seller
  - Vault Exclusive
  - Modern Line
  - Classic Collection
  - Swiss Made
  - Italian Crafted
  - Handmade
*/

-- ============================================================================
-- Insert Categories
-- ============================================================================

-- Main Category: Timepieces
INSERT INTO public.categories (id, name, slug, description, tagline, image_url, display_order, is_visible)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Timepieces', 'timepieces', 'Master hours, not chase them', 'Designed for men who master hours, not chase them.', '/src/assets/collection-watches.jpg', 1, true)
ON CONFLICT (slug) DO NOTHING;

-- Timepieces Subcategories
INSERT INTO public.categories (name, slug, description, parent_id, display_order, is_visible)
VALUES 
  ('Modern Line', 'modern-line', 'Contemporary watches for daily command', '11111111-1111-1111-1111-111111111111', 1, true),
  ('Classic Collection', 'classic-collection', 'Timeless elegance, refined presence', '11111111-1111-1111-1111-111111111111', 2, true),
  ('Vault Relics', 'vault-relics', 'Heritage pieces, modern soul', '11111111-1111-1111-1111-111111111111', 3, true)
ON CONFLICT (slug) DO NOTHING;

-- Main Category: Accessories
INSERT INTO public.categories (id, name, slug, description, tagline, image_url, display_order, is_visible)
VALUES 
  ('22222222-2222-2222-2222-222222222222', 'Accessories', 'accessories', 'Symbols of presence and order', 'Objects that signal presence and order', '/src/assets/object-accessories.jpg', 2, true)
ON CONFLICT (slug) DO NOTHING;

-- Accessories Subcategories
INSERT INTO public.categories (name, slug, description, parent_id, display_order, is_visible)
VALUES 
  ('Cufflinks & Pins', 'cufflinks-pins', 'Subtle statements of refinement', '22222222-2222-2222-2222-222222222222', 1, true),
  ('Rings', 'rings', 'Symbols of commitment and legacy', '22222222-2222-2222-2222-222222222222', 2, true),
  ('Chains & Pendants', 'chains-pendants', 'Worn close, carried always', '22222222-2222-2222-2222-222222222222', 3, true),
  ('Pocket Squares', 'pocket-squares', 'The finishing detail', '22222222-2222-2222-2222-222222222222', 4, true)
ON CONFLICT (slug) DO NOTHING;

-- Main Category: Leather Goods
INSERT INTO public.categories (id, name, slug, description, tagline, image_url, display_order, is_visible)
VALUES 
  ('33333333-3333-3333-3333-333333333333', 'Leather Goods', 'leather-goods', 'Carriers of intent', 'Italian leather crafted for daily ritual', '/src/assets/collection-leather.jpg', 3, true)
ON CONFLICT (slug) DO NOTHING;

-- Leather Goods Subcategories
INSERT INTO public.categories (name, slug, description, parent_id, display_order, is_visible)
VALUES 
  ('Wallets', 'wallets', 'Essential carry, refined form', '33333333-3333-3333-3333-333333333333', 1, true),
  ('Card Cases', 'card-cases', 'Minimalist organization', '33333333-3333-3333-3333-333333333333', 2, true),
  ('Portfolios & Folios', 'portfolios-folios', 'Command meetings with presence', '33333333-3333-3333-3333-333333333333', 3, true),
  ('Bags & Briefcases', 'bags-briefcases', 'Mobile offices, timeless style', '33333333-3333-3333-3333-333333333333', 4, true)
ON CONFLICT (slug) DO NOTHING;

-- Main Category: Apparel
INSERT INTO public.categories (id, name, slug, description, tagline, image_url, display_order, is_visible)
VALUES 
  ('44444444-4444-4444-4444-444444444444', 'Apparel', 'apparel', 'Tailored discipline', 'Garments that demand presence', '/src/assets/collection-tailoring.jpg', 4, true)
ON CONFLICT (slug) DO NOTHING;

-- Apparel Subcategories
INSERT INTO public.categories (name, slug, description, parent_id, display_order, is_visible)
VALUES 
  ('Tailoring', 'tailoring', 'Suits, jackets, trousers built to command', '44444444-4444-4444-4444-444444444444', 1, true),
  ('Outerwear', 'outerwear', 'Protection meets presence', '44444444-4444-4444-4444-444444444444', 2, true),
  ('Shirting', 'shirting', 'Foundation of daily armor', '44444444-4444-4444-4444-444444444444', 3, true),
  ('Loungewear', 'loungewear', 'Private discipline', '44444444-4444-4444-4444-444444444444', 4, true)
ON CONFLICT (slug) DO NOTHING;

-- Main Category: Home & Ritual
INSERT INTO public.categories (id, name, slug, description, tagline, image_url, display_order, is_visible)
VALUES 
  ('55555555-5555-5555-5555-555555555555', 'Home & Ritual', 'home-ritual', 'Space as discipline', 'Objects that shape daily order', '/src/assets/object-pen.jpg', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- Home & Ritual Subcategories
INSERT INTO public.categories (name, slug, description, parent_id, display_order, is_visible)
VALUES 
  ('Desk Objects', 'desk-objects', 'Command your workspace', '55555555-5555-5555-5555-555555555555', 1, true),
  ('Spirits & Barware', 'spirits-barware', 'Ritual refreshment', '55555555-5555-5555-5555-555555555555', 2, true),
  ('Grooming', 'grooming', 'Daily refinement', '55555555-5555-5555-5555-555555555555', 3, true),
  ('Books & Learning', 'books-learning', 'Wisdom within reach', '55555555-5555-5555-5555-555555555555', 4, true)
ON CONFLICT (slug) DO NOTHING;

-- Main Category: Print & Media
INSERT INTO public.categories (id, name, slug, description, tagline, image_url, display_order, is_visible)
VALUES 
  ('66666666-6666-6666-6666-666666666666', 'Print & Media', 'print-media', 'Reflections for the modern stoic', 'Philosophical foundations for daily life', '/src/assets/object-pen.jpg', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- Print & Media Subcategories
INSERT INTO public.categories (name, slug, description, parent_id, display_order, is_visible)
VALUES 
  ('Journals', 'journals', 'Record your mastery', '66666666-6666-6666-6666-666666666666', 1, true),
  ('Philosophy', 'philosophy', 'Ancient wisdom, modern application', '66666666-6666-6666-6666-666666666666', 2, true),
  ('Digital Archives', 'digital-archives', 'Curated knowledge, instant access', '66666666-6666-6666-6666-666666666666', 3, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- Insert Tags
-- ============================================================================

INSERT INTO public.tags (name, slug, color, description)
VALUES 
  ('New Arrival', 'new-arrival', '#C8A882', 'Recently added to the collection'),
  ('Featured', 'featured', '#C8A882', 'Highlighted pieces of exceptional quality'),
  ('Limited Edition', 'limited-edition', '#D4AF37', 'Exclusive pieces in limited quantities'),
  ('Best Seller', 'best-seller', '#8B7355', 'Most popular among our members'),
  ('Vault Exclusive', 'vault-exclusive', '#967969', 'Available only through the Vault'),
  ('Modern Line', 'modern-line', '#C8A882', 'Contemporary design for daily wear'),
  ('Classic Collection', 'classic-collection', '#8B7355', 'Timeless pieces of enduring style'),
  ('Swiss Made', 'swiss-made', '#D4AF37', 'Crafted in Switzerland with precision'),
  ('Italian Crafted', 'italian-crafted', '#967969', 'Made in Italy with traditional techniques'),
  ('Handmade', 'handmade', '#C8A882', 'Individually crafted by master artisans'),
  ('Heritage', 'heritage', '#8B7355', 'Vintage-inspired or restored pieces'),
  ('Bespoke Available', 'bespoke-available', '#D4AF37', 'Customization options available'),
  ('Sustainable', 'sustainable', '#6B8E23', 'Ethically sourced and produced'),
  ('Pre-Order', 'pre-order', '#DAA520', 'Available for advance order')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- Insert Default Settings
-- ============================================================================

INSERT INTO public.settings (key, value, category, description, is_public)
VALUES 
  ('site_name', '"Apollo House"'::jsonb, 'general', 'Name of the site', true),
  ('site_tagline', '"Objects of Power and Presence"'::jsonb, 'general', 'Site tagline', true),
  ('currency', '"USD"'::jsonb, 'general', 'Default currency', true),
  ('tax_rate', '0.08'::jsonb, 'sales', 'Default sales tax rate', false),
  ('shipping_flat_rate', '15.00'::jsonb, 'shipping', 'Flat rate shipping cost', false),
  ('free_shipping_threshold', '500.00'::jsonb, 'shipping', 'Order total for free shipping', true),
  ('low_stock_threshold', '10'::jsonb, 'inventory', 'Alert when stock falls below this', false),
  ('order_notification_email', '"admin@apollohouse.com"'::jsonb, 'email', 'Email for order notifications', false),
  ('enable_reviews', 'true'::jsonb, 'features', 'Enable product reviews', false),
  ('maintenance_mode', 'false'::jsonb, 'system', 'Enable maintenance mode', false)
ON CONFLICT (key) DO NOTHING;
