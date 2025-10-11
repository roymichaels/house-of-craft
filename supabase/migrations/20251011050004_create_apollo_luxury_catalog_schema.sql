/*
  # Apollo Luxury Catalog Schema Enhancement

  ## Overview
  Comprehensive database schema to support Apollo's luxury brand catalog with:
  - 7 main product categories (Timepieces, Accessories, Leather Goods, Apparel, Home & Ritual, Print & Media, Shop by Look)
  - Brand hierarchy and collection management
  - AI image generation prompt storage
  - Lifestyle collection system for "Shop by Look"
  - Enhanced product metadata for luxury positioning

  ## 1. New Tables
    - `collections`: Modern Line, Classic Line, Vault Editions
    - `brand_materials`: Material taxonomy (Linen, Wool, Leather, Brass, Stone, etc.)
    - `brand_colors`: Apollo color palette with hex values
    - `lifestyle_looks`: Shop by Look collections (Yacht, Golf, Business, Command, House, Evening, Traveler)
    - `product_lifestyle_looks`: Many-to-many relationship for products in multiple looks
    - `product_variants`: Size, color, material variations
    - `ai_image_prompts`: Standardized image generation prompts

  ## 2. Enhanced Product Fields
    - Add collection_id reference
    - Add symbolic_meaning and brand_role fields
    - Add ai_prompt_id reference
    - Add limited_edition fields (edition_size, edition_number)
    - Add consultation_required flag

  ## 3. Enhanced Category Fields
    - Add latin_inscription field
    - Add brand_hierarchy JSONB for inspiration sources
    - Add visual_specifications JSONB for AI consistency

  ## 4. Security
    - Enable RLS on all new tables
    - Public read access for catalog data
    - Admin-only write access
    - Authenticated user access for wishlists and favorites
*/

-- ============================================================================
-- COLLECTIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('modern', 'classic', 'vault')),
  tagline TEXT,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view collections"
  ON public.collections FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage collections"
  ON public.collections FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- BRAND MATERIALS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.brand_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  properties JSONB DEFAULT '{}'::jsonb,
  care_instructions TEXT,
  origin TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.brand_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view brand materials"
  ON public.brand_materials FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage brand materials"
  ON public.brand_materials FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- BRAND COLORS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.brand_colors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  hex_value TEXT NOT NULL,
  description TEXT,
  color_family TEXT,
  usage_context TEXT[],
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.brand_colors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view brand colors"
  ON public.brand_colors FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage brand colors"
  ON public.brand_colors FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- LIFESTYLE LOOKS TABLE (Shop by Look)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.lifestyle_looks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  hero_image_url TEXT,
  color_palette JSONB DEFAULT '[]'::jsonb,
  styling_narrative TEXT,
  ideal_occasions TEXT[],
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.lifestyle_looks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lifestyle looks"
  ON public.lifestyle_looks FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Admins can manage lifestyle looks"
  ON public.lifestyle_looks FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- PRODUCT LIFESTYLE LOOKS (Many-to-Many)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.product_lifestyle_looks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  lifestyle_look_id UUID NOT NULL REFERENCES public.lifestyle_looks(id) ON DELETE CASCADE,
  is_hero_item BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(product_id, lifestyle_look_id)
);

ALTER TABLE public.product_lifestyle_looks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product lifestyle looks"
  ON public.product_lifestyle_looks FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage product lifestyle looks"
  ON public.product_lifestyle_looks FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- PRODUCT VARIANTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE,
  variant_type TEXT NOT NULL,
  variant_value TEXT NOT NULL,
  price_adjustment NUMERIC(10,2) DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product variants"
  ON public.product_variants FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage product variants"
  ON public.product_variants FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- AI IMAGE PROMPTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ai_image_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  base_prompt TEXT NOT NULL,
  style_parameters JSONB DEFAULT '{}'::jsonb,
  lighting_specs TEXT,
  camera_specs TEXT,
  material_rendering TEXT,
  color_grading TEXT,
  example_urls TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ai_image_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ai prompts"
  ON public.ai_image_prompts FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage ai prompts"
  ON public.ai_image_prompts FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- ENHANCE EXISTING PRODUCTS TABLE
-- ============================================================================

DO $$
BEGIN
  -- Add collection_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'collection_id'
  ) THEN
    ALTER TABLE public.products ADD COLUMN collection_id UUID REFERENCES public.collections(id);
  END IF;

  -- Add symbolic_meaning if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'symbolic_meaning'
  ) THEN
    ALTER TABLE public.products ADD COLUMN symbolic_meaning TEXT;
  END IF;

  -- Add brand_role if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'brand_role'
  ) THEN
    ALTER TABLE public.products ADD COLUMN brand_role TEXT;
  END IF;

  -- Add ai_prompt_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'ai_prompt_id'
  ) THEN
    ALTER TABLE public.products ADD COLUMN ai_prompt_id UUID REFERENCES public.ai_image_prompts(id);
  END IF;

  -- Add limited_edition_size if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'limited_edition_size'
  ) THEN
    ALTER TABLE public.products ADD COLUMN limited_edition_size INTEGER;
  END IF;

  -- Add limited_edition_number if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'limited_edition_number'
  ) THEN
    ALTER TABLE public.products ADD COLUMN limited_edition_number INTEGER;
  END IF;

  -- Add consultation_required if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'consultation_required'
  ) THEN
    ALTER TABLE public.products ADD COLUMN consultation_required BOOLEAN DEFAULT false;
  END IF;

  -- Add materials if not exists (array of material IDs)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'materials'
  ) THEN
    ALTER TABLE public.products ADD COLUMN materials UUID[];
  END IF;

  -- Add slug if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'slug'
  ) THEN
    ALTER TABLE public.products ADD COLUMN slug TEXT UNIQUE;
  END IF;
END $$;

-- ============================================================================
-- ENHANCE EXISTING CATEGORIES TABLE
-- ============================================================================

DO $$
BEGIN
  -- Add latin_inscription if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'latin_inscription'
  ) THEN
    ALTER TABLE public.categories ADD COLUMN latin_inscription TEXT;
  END IF;

  -- Add brand_hierarchy if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'brand_hierarchy'
  ) THEN
    ALTER TABLE public.categories ADD COLUMN brand_hierarchy JSONB DEFAULT '{}'::jsonb;
  END IF;

  -- Add visual_specifications if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'visual_specifications'
  ) THEN
    ALTER TABLE public.categories ADD COLUMN visual_specifications JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_products_collection_id ON public.products(collection_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON public.products(subcategory);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_lifestyle_looks_product_id ON public.product_lifestyle_looks(product_id);
CREATE INDEX IF NOT EXISTS idx_product_lifestyle_looks_lifestyle_look_id ON public.product_lifestyle_looks(lifestyle_look_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
