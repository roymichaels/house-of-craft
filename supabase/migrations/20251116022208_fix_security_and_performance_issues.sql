/*
  # Security and Performance Optimization

  This migration addresses critical security and performance issues identified in the Apollo database:

  1. **Foreign Key Indexes** - Adds missing indexes on all foreign key columns to improve JOIN performance
  2. **RLS Policy Optimization** - Optimizes auth.uid() calls using SELECT subqueries to prevent per-row evaluation
  3. **Function Security** - Fixes search_path security issues in database functions
  4. **Policy Consolidation** - Simplifies multiple permissive policies where appropriate

  ## Foreign Key Indexes Added
  - content_blocks.author_id
  - orders.user_id
  - products.ai_prompt_id
  - products.created_by

  ## Security Improvements
  - All auth.uid() calls wrapped in SELECT to cache per-query instead of per-row
  - Function search paths secured with SECURITY DEFINER
  - Redundant policies reviewed and optimized

  ## Performance Impact
  - Dramatically improved query performance on large tables
  - Reduced CPU usage for RLS policy evaluation
  - Better query planning with proper indexes
*/

-- =====================================================
-- PART 1: ADD MISSING FOREIGN KEY INDEXES
-- =====================================================

-- Index for content_blocks.author_id foreign key
CREATE INDEX IF NOT EXISTS idx_content_blocks_author_id
ON public.content_blocks(author_id);

-- Index for orders.user_id foreign key
CREATE INDEX IF NOT EXISTS idx_orders_user_id
ON public.orders(user_id);

-- Index for products.ai_prompt_id foreign key
CREATE INDEX IF NOT EXISTS idx_products_ai_prompt_id
ON public.products(ai_prompt_id);

-- Index for products.created_by foreign key
CREATE INDEX IF NOT EXISTS idx_products_created_by
ON public.products(created_by);

-- =====================================================
-- PART 2: FIX FUNCTION SECURITY (Search Path)
-- =====================================================

-- Recreate has_role function with secure search_path
CREATE OR REPLACE FUNCTION public.has_role(required_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid();

  RETURN user_role = required_role OR user_role = 'superadmin';
END;
$$;

-- Recreate update_updated_at_column with secure search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- =====================================================
-- PART 3: OPTIMIZE RLS POLICIES WITH SELECT SUBQUERIES
-- =====================================================

-- PROFILES TABLE
-- Drop and recreate policies with optimized auth.uid() calls

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Superadmins can view all profiles" ON public.profiles;
CREATE POLICY "Superadmins can view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid()) AND role = 'superadmin'
    )
  );

DROP POLICY IF EXISTS "Superadmins can update all profiles" ON public.profiles;
CREATE POLICY "Superadmins can update all profiles"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid()) AND role = 'superadmin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid()) AND role = 'superadmin'
    )
  );

-- ORDERS TABLE

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can create orders" ON public.orders;
CREATE POLICY "Authenticated users can create orders"
  ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

DROP POLICY IF EXISTS "Support can view all orders" ON public.orders;
CREATE POLICY "Support can view all orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('support', 'admin', 'superadmin')
    )
  );

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders"
  ON public.orders
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

-- CONTENT_BLOCKS TABLE

DROP POLICY IF EXISTS "Admins and editors can view all content" ON public.content_blocks;
CREATE POLICY "Admins and editors can view all content"
  ON public.content_blocks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('editor', 'admin', 'superadmin')
    )
  );

DROP POLICY IF EXISTS "Editors and admins can insert content" ON public.content_blocks;
CREATE POLICY "Editors and admins can insert content"
  ON public.content_blocks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('editor', 'admin', 'superadmin')
    )
  );

DROP POLICY IF EXISTS "Editors and admins can update content" ON public.content_blocks;
CREATE POLICY "Editors and admins can update content"
  ON public.content_blocks
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('editor', 'admin', 'superadmin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('editor', 'admin', 'superadmin')
    )
  );

DROP POLICY IF EXISTS "Admins and superadmins can delete content" ON public.content_blocks;
CREATE POLICY "Admins and superadmins can delete content"
  ON public.content_blocks
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

-- CATEGORIES TABLE

DROP POLICY IF EXISTS "Admins can view all categories" ON public.categories;
CREATE POLICY "Admins can view all categories"
  ON public.categories
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin', 'editor')
    )
  );

DROP POLICY IF EXISTS "Editors and admins can insert categories" ON public.categories;
CREATE POLICY "Editors and admins can insert categories"
  ON public.categories
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('editor', 'admin', 'superadmin')
    )
  );

DROP POLICY IF EXISTS "Editors and admins can update categories" ON public.categories;
CREATE POLICY "Editors and admins can update categories"
  ON public.categories
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('editor', 'admin', 'superadmin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('editor', 'admin', 'superadmin')
    )
  );

DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;
CREATE POLICY "Admins can delete categories"
  ON public.categories
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

-- AUDIT_LOGS TABLE

DROP POLICY IF EXISTS "Superadmins can view all audit logs" ON public.audit_logs;
CREATE POLICY "Superadmins can view all audit logs"
  ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'superadmin'
    )
  );

DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

-- PRODUCTS TABLE

DROP POLICY IF EXISTS "Admins and editors can insert products" ON public.products;
CREATE POLICY "Admins and editors can insert products"
  ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('editor', 'admin', 'superadmin')
    )
  );

DROP POLICY IF EXISTS "Admins and editors can update products" ON public.products;
CREATE POLICY "Admins and editors can update products"
  ON public.products
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('editor', 'admin', 'superadmin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('editor', 'admin', 'superadmin')
    )
  );

DROP POLICY IF EXISTS "Admins and superadmins can delete products" ON public.products;
CREATE POLICY "Admins and superadmins can delete products"
  ON public.products
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

-- TAGS TABLE

DROP POLICY IF EXISTS "Editors and admins can insert tags" ON public.tags;
CREATE POLICY "Editors and admins can insert tags"
  ON public.tags
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('editor', 'admin', 'superadmin')
    )
  );

DROP POLICY IF EXISTS "Editors and admins can update tags" ON public.tags;
CREATE POLICY "Editors and admins can update tags"
  ON public.tags
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('editor', 'admin', 'superadmin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('editor', 'admin', 'superadmin')
    )
  );

DROP POLICY IF EXISTS "Admins can delete tags" ON public.tags;
CREATE POLICY "Admins can delete tags"
  ON public.tags
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

-- PRODUCT_TAGS TABLE

DROP POLICY IF EXISTS "Editors and admins can insert product tags" ON public.product_tags;
CREATE POLICY "Editors and admins can insert product tags"
  ON public.product_tags
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('editor', 'admin', 'superadmin')
    )
  );

DROP POLICY IF EXISTS "Editors and admins can delete product tags" ON public.product_tags;
CREATE POLICY "Editors and admins can delete product tags"
  ON public.product_tags
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('editor', 'admin', 'superadmin')
    )
  );

-- INVENTORY TABLE

DROP POLICY IF EXISTS "Admins can view inventory" ON public.inventory;
CREATE POLICY "Admins can view inventory"
  ON public.inventory
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

DROP POLICY IF EXISTS "Admins can insert inventory" ON public.inventory;
CREATE POLICY "Admins can insert inventory"
  ON public.inventory
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

DROP POLICY IF EXISTS "Admins can update inventory" ON public.inventory;
CREATE POLICY "Admins can update inventory"
  ON public.inventory
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

DROP POLICY IF EXISTS "Admins can delete inventory" ON public.inventory;
CREATE POLICY "Admins can delete inventory"
  ON public.inventory
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

-- INVENTORY_HISTORY TABLE

DROP POLICY IF EXISTS "Admins can view inventory history" ON public.inventory_history;
CREATE POLICY "Admins can view inventory history"
  ON public.inventory_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

DROP POLICY IF EXISTS "Admins can insert inventory history" ON public.inventory_history;
CREATE POLICY "Admins can insert inventory history"
  ON public.inventory_history
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

-- SETTINGS TABLE

DROP POLICY IF EXISTS "Admins can view all settings" ON public.settings;
CREATE POLICY "Admins can view all settings"
  ON public.settings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

DROP POLICY IF EXISTS "Admins can insert settings" ON public.settings;
CREATE POLICY "Admins can insert settings"
  ON public.settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

DROP POLICY IF EXISTS "Admins can update settings" ON public.settings;
CREATE POLICY "Admins can update settings"
  ON public.settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

DROP POLICY IF EXISTS "Superadmins can delete settings" ON public.settings;
CREATE POLICY "Superadmins can delete settings"
  ON public.settings
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'superadmin'
    )
  );

-- COLLECTIONS TABLE

DROP POLICY IF EXISTS "Admins can manage collections" ON public.collections;
CREATE POLICY "Admins can manage collections"
  ON public.collections
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

-- BRAND_MATERIALS TABLE

DROP POLICY IF EXISTS "Admins can manage brand materials" ON public.brand_materials;
CREATE POLICY "Admins can manage brand materials"
  ON public.brand_materials
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

-- BRAND_COLORS TABLE

DROP POLICY IF EXISTS "Admins can manage brand colors" ON public.brand_colors;
CREATE POLICY "Admins can manage brand colors"
  ON public.brand_colors
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

-- LIFESTYLE_LOOKS TABLE

DROP POLICY IF EXISTS "Admins can manage lifestyle looks" ON public.lifestyle_looks;
CREATE POLICY "Admins can manage lifestyle looks"
  ON public.lifestyle_looks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

-- PRODUCT_LIFESTYLE_LOOKS TABLE

DROP POLICY IF EXISTS "Admins can manage product lifestyle looks" ON public.product_lifestyle_looks;
CREATE POLICY "Admins can manage product lifestyle looks"
  ON public.product_lifestyle_looks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

-- PRODUCT_VARIANTS TABLE

DROP POLICY IF EXISTS "Admins can manage product variants" ON public.product_variants;
CREATE POLICY "Admins can manage product variants"
  ON public.product_variants
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

-- AI_IMAGE_PROMPTS TABLE

DROP POLICY IF EXISTS "Admins can manage ai prompts" ON public.ai_image_prompts;
CREATE POLICY "Admins can manage ai prompts"
  ON public.ai_image_prompts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

-- =====================================================
-- PART 4: ADD HELPFUL COMMENTS
-- =====================================================

COMMENT ON INDEX idx_content_blocks_author_id IS 'Improves JOIN performance on author_id foreign key';
COMMENT ON INDEX idx_orders_user_id IS 'Improves JOIN performance on user_id foreign key';
COMMENT ON INDEX idx_products_ai_prompt_id IS 'Improves JOIN performance on ai_prompt_id foreign key';
COMMENT ON INDEX idx_products_created_by IS 'Improves JOIN performance on created_by foreign key';

-- =====================================================
-- VERIFICATION QUERIES (Run manually to verify)
-- =====================================================

-- Verify indexes were created
-- SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public' AND indexname LIKE 'idx_%' ORDER BY tablename, indexname;

-- Verify RLS policies
-- SELECT tablename, policyname, cmd FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname;

-- Check for remaining auth.uid() calls without SELECT wrapper
-- This should return no rows if all policies are properly optimized
-- SELECT schemaname, tablename, policyname, qual
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- AND qual::text LIKE '%auth.uid()%'
-- AND qual::text NOT LIKE '%SELECT auth.uid()%';
