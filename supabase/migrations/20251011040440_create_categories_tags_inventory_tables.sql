/*
  # Apollo E-commerce Schema Extensions
  
  ## Overview
  Extends the database schema to support comprehensive product catalog management
  with categories, tags, and inventory tracking.
  
  ## New Tables
  
  ### 1. Categories Table
  - `id` (uuid, primary key)
  - `name` (text, required) - Category display name
  - `slug` (text, unique) - URL-friendly identifier
  - `description` (text) - Category description
  - `parent_id` (uuid) - For subcategories, references parent category
  - `image_url` (text) - Category hero image
  - `tagline` (text) - Marketing tagline
  - `display_order` (integer) - Sort order for display
  - `is_visible` (boolean) - Show/hide category
  - `product_count` (integer) - Cached count of products
  - `metadata` (jsonb) - Additional flexible data
  - Timestamps
  
  ### 2. Tags Table
  - `id` (uuid, primary key)
  - `name` (text, unique) - Tag name
  - `slug` (text, unique) - URL-friendly identifier
  - `color` (text) - UI color code
  - `description` (text) - Tag description
  - `usage_count` (integer) - Number of products using this tag
  - Timestamps
  
  ### 3. Product Tags Junction Table
  - `id` (uuid, primary key)
  - `product_id` (uuid) - References products table
  - `tag_id` (uuid) - References tags table
  - `created_at` (timestamp)
  - Unique constraint on (product_id, tag_id)
  
  ### 4. Inventory Tracking Table
  - `id` (uuid, primary key)
  - `product_id` (uuid) - References products table
  - `quantity` (integer) - Current stock level
  - `reserved_quantity` (integer) - Items in pending orders
  - `reorder_point` (integer) - When to reorder
  - `reorder_quantity` (integer) - How many to reorder
  - `location` (text) - Warehouse/storage location
  - `last_restocked_at` (timestamp)
  - Timestamps
  
  ### 5. Inventory History Table
  - `id` (uuid, primary key)
  - `product_id` (uuid) - References products table
  - `user_id` (uuid) - Who made the change
  - `change_type` (text) - 'restock', 'sale', 'adjustment', 'return'
  - `quantity_change` (integer) - Positive or negative
  - `quantity_before` (integer)
  - `quantity_after` (integer)
  - `reason` (text) - Explanation for change
  - `reference_id` (uuid) - Related order ID if applicable
  - `created_at` (timestamp)
  
  ### 6. Settings Table
  - `id` (uuid, primary key)
  - `key` (text, unique) - Setting key
  - `value` (jsonb) - Setting value (flexible JSON)
  - `category` (text) - Group settings (e.g., 'shipping', 'email', 'general')
  - `description` (text) - What this setting does
  - `is_public` (boolean) - Can be accessed without auth
  - Timestamps
  
  ## Security
  - All tables have RLS enabled
  - Public read access where appropriate
  - Admin/Editor write access
  - Superadmin full access
  
  ## Indexes
  - Foreign key indexes for performance
  - Slug indexes for URL lookups
  - Category hierarchy indexes
  - Inventory product lookups
*/

-- ============================================================================
-- Categories Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  image_url TEXT,
  tagline TEXT,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  product_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_visible ON public.categories(is_visible) WHERE is_visible = true;
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON public.categories(display_order);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible categories"
  ON public.categories FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Admins can view all categories"
  ON public.categories FOR SELECT
  TO authenticated
  USING (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Editors and admins can insert categories"
  ON public.categories FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Editors and admins can update categories"
  ON public.categories FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Admins can delete categories"
  ON public.categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

-- ============================================================================
-- Tags Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#C8A882',
  description TEXT,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tags_slug ON public.tags(slug);
CREATE INDEX IF NOT EXISTS idx_tags_name ON public.tags(name);

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tags"
  ON public.tags FOR SELECT
  USING (true);

CREATE POLICY "Editors and admins can insert tags"
  ON public.tags FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Editors and admins can update tags"
  ON public.tags FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Admins can delete tags"
  ON public.tags FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

-- ============================================================================
-- Product Tags Junction Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.product_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_product_tags_product_id ON public.product_tags(product_id);
CREATE INDEX IF NOT EXISTS idx_product_tags_tag_id ON public.product_tags(tag_id);

ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product tags"
  ON public.product_tags FOR SELECT
  USING (true);

CREATE POLICY "Editors and admins can insert product tags"
  ON public.product_tags FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Editors and admins can delete product tags"
  ON public.product_tags FOR DELETE
  TO authenticated
  USING (public.is_admin_or_above(auth.uid()));

-- ============================================================================
-- Inventory Tracking Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE UNIQUE NOT NULL,
  quantity INTEGER DEFAULT 0,
  reserved_quantity INTEGER DEFAULT 0,
  reorder_point INTEGER DEFAULT 10,
  reorder_quantity INTEGER DEFAULT 50,
  location TEXT,
  last_restocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON public.inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_low_stock ON public.inventory(quantity) WHERE quantity <= reorder_point;

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view inventory"
  ON public.inventory FOR SELECT
  TO authenticated
  USING (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Admins can insert inventory"
  ON public.inventory FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Admins can update inventory"
  ON public.inventory FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Admins can delete inventory"
  ON public.inventory FOR DELETE
  TO authenticated
  USING (public.is_admin_or_above(auth.uid()));

-- ============================================================================
-- Inventory History Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.inventory_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  change_type TEXT NOT NULL,
  quantity_change INTEGER NOT NULL,
  quantity_before INTEGER NOT NULL,
  quantity_after INTEGER NOT NULL,
  reason TEXT,
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_history_product_id ON public.inventory_history(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_history_created_at ON public.inventory_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_history_user_id ON public.inventory_history(user_id);

ALTER TABLE public.inventory_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view inventory history"
  ON public.inventory_history FOR SELECT
  TO authenticated
  USING (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Admins can insert inventory history"
  ON public.inventory_history FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_above(auth.uid()));

-- ============================================================================
-- Settings Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  category TEXT DEFAULT 'general',
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_settings_key ON public.settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_category ON public.settings(category);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public settings"
  ON public.settings FOR SELECT
  USING (is_public = true);

CREATE POLICY "Admins can view all settings"
  ON public.settings FOR SELECT
  TO authenticated
  USING (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Admins can insert settings"
  ON public.settings FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Admins can update settings"
  ON public.settings FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Superadmins can delete settings"
  ON public.settings FOR DELETE
  TO authenticated
  USING (public.is_superadmin(auth.uid()));

-- ============================================================================
-- Utility Functions
-- ============================================================================

-- Function to update category product count
CREATE OR REPLACE FUNCTION public.update_category_product_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE public.categories
    SET product_count = (
      SELECT COUNT(*) FROM public.products WHERE category = NEW.category
    )
    WHERE slug = NEW.category;
  END IF;
  
  IF TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN
    UPDATE public.categories
    SET product_count = (
      SELECT COUNT(*) FROM public.products WHERE category = OLD.category
    )
    WHERE slug = OLD.category;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Trigger to update category product count
DROP TRIGGER IF EXISTS trigger_update_category_product_count ON public.products;
CREATE TRIGGER trigger_update_category_product_count
  AFTER INSERT OR UPDATE OR DELETE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_category_product_count();

-- Function to update tag usage count
CREATE OR REPLACE FUNCTION public.update_tag_usage_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.tags
    SET usage_count = usage_count + 1
    WHERE id = NEW.tag_id;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    UPDATE public.tags
    SET usage_count = GREATEST(usage_count - 1, 0)
    WHERE id = OLD.tag_id;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Trigger to update tag usage count
DROP TRIGGER IF EXISTS trigger_update_tag_usage_count ON public.product_tags;
CREATE TRIGGER trigger_update_tag_usage_count
  AFTER INSERT OR DELETE ON public.product_tags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tag_usage_count();

-- Function to log inventory changes
CREATE OR REPLACE FUNCTION public.log_inventory_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.quantity != NEW.quantity THEN
    INSERT INTO public.inventory_history (
      product_id,
      user_id,
      change_type,
      quantity_change,
      quantity_before,
      quantity_after,
      reason
    ) VALUES (
      NEW.product_id,
      auth.uid(),
      'adjustment',
      NEW.quantity - OLD.quantity,
      OLD.quantity,
      NEW.quantity,
      'Manual adjustment'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to log inventory changes
DROP TRIGGER IF EXISTS trigger_log_inventory_change ON public.inventory;
CREATE TRIGGER trigger_log_inventory_change
  AFTER UPDATE ON public.inventory
  FOR EACH ROW
  EXECUTE FUNCTION public.log_inventory_change();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers to all relevant tables
DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_tags_updated_at ON public.tags;
CREATE TRIGGER update_tags_updated_at
  BEFORE UPDATE ON public.tags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_inventory_updated_at ON public.inventory;
CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON public.inventory
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON public.settings;
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
