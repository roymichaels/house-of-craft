/*
  # Seed Product Tags and Inventory
  
  ## Actions
  1. Link products to appropriate tags (new-arrival, featured, limited-edition, etc.)
  2. Create initial inventory records for all products
  3. Set realistic stock levels and reorder points
*/

-- ============================================================================
-- Link Products to Tags
-- ============================================================================

-- Get tag IDs first
DO $$
DECLARE
  tag_new_arrival UUID;
  tag_featured UUID;
  tag_limited UUID;
  tag_bestseller UUID;
  tag_vault UUID;
  tag_modern UUID;
  tag_classic UUID;
  tag_swiss UUID;
  tag_italian UUID;
  tag_handmade UUID;
  tag_heritage UUID;
  tag_bespoke UUID;
  tag_sustainable UUID;
BEGIN
  -- Get tag IDs
  SELECT id INTO tag_new_arrival FROM public.tags WHERE slug = 'new-arrival';
  SELECT id INTO tag_featured FROM public.tags WHERE slug = 'featured';
  SELECT id INTO tag_limited FROM public.tags WHERE slug = 'limited-edition';
  SELECT id INTO tag_bestseller FROM public.tags WHERE slug = 'best-seller';
  SELECT id INTO tag_vault FROM public.tags WHERE slug = 'vault-exclusive';
  SELECT id INTO tag_modern FROM public.tags WHERE slug = 'modern-line';
  SELECT id INTO tag_classic FROM public.tags WHERE slug = 'classic-collection';
  SELECT id INTO tag_swiss FROM public.tags WHERE slug = 'swiss-made';
  SELECT id INTO tag_italian FROM public.tags WHERE slug = 'italian-crafted';
  SELECT id INTO tag_handmade FROM public.tags WHERE slug = 'handmade';
  SELECT id INTO tag_heritage FROM public.tags WHERE slug = 'heritage';
  SELECT id INTO tag_bespoke FROM public.tags WHERE slug = 'bespoke-available';
  SELECT id INTO tag_sustainable FROM public.tags WHERE slug = 'sustainable';
  
  -- Tag timepieces
  INSERT INTO public.product_tags (product_id, tag_id)
  SELECT p.id, tag_swiss FROM public.products p 
  WHERE p.category = 'timepieces' AND p.subcategory = 'modern-line'
  ON CONFLICT DO NOTHING;
  
  INSERT INTO public.product_tags (product_id, tag_id)
  SELECT p.id, tag_modern FROM public.products p 
  WHERE p.category = 'timepieces' AND p.subcategory = 'modern-line'
  ON CONFLICT DO NOTHING;
  
  INSERT INTO public.product_tags (product_id, tag_id)
  SELECT p.id, tag_classic FROM public.products p 
  WHERE p.category = 'timepieces' AND p.subcategory = 'classic-collection'
  ON CONFLICT DO NOTHING;
  
  INSERT INTO public.product_tags (product_id, tag_id)
  SELECT p.id, tag_vault FROM public.products p 
  WHERE p.category = 'timepieces' AND p.subcategory = 'vault-relics'
  ON CONFLICT DO NOTHING;
  
  INSERT INTO public.product_tags (product_id, tag_id)
  SELECT p.id, tag_heritage FROM public.products p 
  WHERE p.category = 'timepieces' AND p.subcategory = 'vault-relics'
  ON CONFLICT DO NOTHING;
  
  -- Mark some watches as featured
  INSERT INTO public.product_tags (product_id, tag_id)
  SELECT p.id, tag_featured FROM public.products p 
  WHERE p.name IN ('Solis Automatic', 'Imperium Dress Watch', 'Apollo Heritage 1962')
  ON CONFLICT DO NOTHING;
  
  -- Mark Tribune Tourbillon as limited edition
  INSERT INTO public.product_tags (product_id, tag_id)
  SELECT p.id, tag_limited FROM public.products p 
  WHERE p.name = 'Tribune Tourbillon'
  ON CONFLICT DO NOTHING;
  
  -- Tag Italian leather goods
  INSERT INTO public.product_tags (product_id, tag_id)
  SELECT p.id, tag_italian FROM public.products p 
  WHERE p.category = 'leather-goods'
  ON CONFLICT DO NOTHING;
  
  INSERT INTO public.product_tags (product_id, tag_id)
  SELECT p.id, tag_handmade FROM public.products p 
  WHERE p.category = 'leather-goods'
  ON CONFLICT DO NOTHING;
  
  -- Mark popular leather items as bestsellers
  INSERT INTO public.product_tags (product_id, tag_id)
  SELECT p.id, tag_bestseller FROM public.products p 
  WHERE p.name IN ('Senator Bifold', 'Stoic Card Case', 'Seneca Briefcase')
  ON CONFLICT DO NOTHING;
  
  -- Tag Italian apparel
  INSERT INTO public.product_tags (product_id, tag_id)
  SELECT p.id, tag_italian FROM public.products p 
  WHERE p.category = 'apparel' AND p.subcategory = 'tailoring'
  ON CONFLICT DO NOTHING;
  
  -- Mark suits as bespoke available
  INSERT INTO public.product_tags (product_id, tag_id)
  SELECT p.id, tag_bespoke FROM public.products p 
  WHERE p.name LIKE '%Suit%' OR p.name LIKE '%Sport Coat%'
  ON CONFLICT DO NOTHING;
  
  -- Tag home items as handmade
  INSERT INTO public.product_tags (product_id, tag_id)
  SELECT p.id, tag_handmade FROM public.products p 
  WHERE p.category = 'home-ritual' AND p.subcategory IN ('desk-objects', 'spirits-barware')
  ON CONFLICT DO NOTHING;
  
  -- Mark fountain pen as featured bestseller
  INSERT INTO public.product_tags (product_id, tag_id)
  SELECT p.id, tag_featured FROM public.products p 
  WHERE p.name = 'Apollo Fountain Pen'
  ON CONFLICT DO NOTHING;
  
  INSERT INTO public.product_tags (product_id, tag_id)
  SELECT p.id, tag_bestseller FROM public.products p 
  WHERE p.name = 'Apollo Fountain Pen'
  ON CONFLICT DO NOTHING;
  
  -- Mark journals as bestsellers
  INSERT INTO public.product_tags (product_id, tag_id)
  SELECT p.id, tag_bestseller FROM public.products p 
  WHERE p.category = 'print-media' AND p.subcategory = 'journals'
  ON CONFLICT DO NOTHING;
  
  -- Tag some accessories as new arrivals
  INSERT INTO public.product_tags (product_id, tag_id)
  SELECT p.id, tag_new_arrival FROM public.products p 
  WHERE p.category = 'accessories' AND p.subcategory = 'rings'
  ON CONFLICT DO NOTHING;
  
  -- Tag sustainable items
  INSERT INTO public.product_tags (product_id, tag_id)
  SELECT p.id, tag_sustainable FROM public.products p 
  WHERE p.name IN ('Linen Shirt - Natural', 'Rain Mac - Navy', 'Linen Square - Stone')
  ON CONFLICT DO NOTHING;
END $$;

-- ============================================================================
-- Create Initial Inventory Records
-- ============================================================================

-- High stock items (Standard products)
INSERT INTO public.inventory (product_id, quantity, reserved_quantity, reorder_point, reorder_quantity, location)
SELECT 
  p.id,
  CASE 
    WHEN p.price::numeric < 500 THEN 150  -- Accessories, small items
    WHEN p.price::numeric < 1000 THEN 75  -- Mid-range items
    WHEN p.price::numeric < 3000 THEN 30  -- Premium items
    ELSE 10  -- Luxury/Limited items
  END as quantity,
  0 as reserved_quantity,
  CASE 
    WHEN p.price::numeric < 500 THEN 30
    WHEN p.price::numeric < 1000 THEN 15
    WHEN p.price::numeric < 3000 THEN 5
    ELSE 2
  END as reorder_point,
  CASE 
    WHEN p.price::numeric < 500 THEN 100
    WHEN p.price::numeric < 1000 THEN 50
    WHEN p.price::numeric < 3000 THEN 20
    ELSE 5
  END as reorder_quantity,
  CASE 
    WHEN p.category = 'timepieces' THEN 'Vault A1'
    WHEN p.category = 'accessories' THEN 'Display Room'
    WHEN p.category = 'leather-goods' THEN 'Vault B2'
    WHEN p.category = 'apparel' THEN 'Warehouse C'
    WHEN p.category = 'home-ritual' THEN 'Showroom'
    WHEN p.category = 'print-media' THEN 'Library'
    ELSE 'General Storage'
  END as location
FROM public.products p
WHERE p.in_stock = true
ON CONFLICT (product_id) DO NOTHING;

-- Special handling for out of stock items
INSERT INTO public.inventory (product_id, quantity, reserved_quantity, reorder_point, reorder_quantity, location)
SELECT 
  p.id,
  0 as quantity,
  0 as reserved_quantity,
  1 as reorder_point,
  5 as reorder_quantity,
  'Awaiting Restock' as location
FROM public.products p
WHERE p.in_stock = false
ON CONFLICT (product_id) DO NOTHING;

-- Set last restocked date for all inventory
UPDATE public.inventory
SET last_restocked_at = NOW() - (random() * interval '30 days')
WHERE last_restocked_at IS NULL;

-- ============================================================================
-- Create Sample Inventory History
-- ============================================================================

-- Add some sample inventory movements for realism
INSERT INTO public.inventory_history (
  product_id, 
  change_type, 
  quantity_change, 
  quantity_before, 
  quantity_after,
  reason,
  created_at
)
SELECT 
  i.product_id,
  'restock',
  i.quantity,
  0,
  i.quantity,
  'Initial stock',
  NOW() - (random() * interval '30 days')
FROM public.inventory i
WHERE i.quantity > 0
LIMIT 50;

-- Add some sales movements
INSERT INTO public.inventory_history (
  product_id, 
  change_type, 
  quantity_change, 
  quantity_before, 
  quantity_after,
  reason,
  created_at
)
SELECT 
  i.product_id,
  'sale',
  -(1 + floor(random() * 5)::integer),
  i.quantity + (1 + floor(random() * 5)::integer),
  i.quantity,
  'Customer purchase',
  NOW() - (random() * interval '20 days')
FROM public.inventory i
WHERE i.quantity > 10
ORDER BY random()
LIMIT 30;
