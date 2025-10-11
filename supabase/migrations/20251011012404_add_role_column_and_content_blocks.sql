/*
  # Apollo Admin - Role Migration and Content Blocks
  
  ## Overview
  Migrates from separate user_roles table to single role column on profiles table
  and adds content management and audit logging capabilities.
  
  ## Changes Made
  
  ### 1. Profile Role System
  - Add `role` column to profiles table with default 'user'
  - Migrate existing user_roles data to new role column
  - Create enum type for valid roles
  - Update RLS policies to use new role system
  
  ### 2. Content Blocks Table
  - Create table for managing site content (philosophy, mission, journal)
  - Fields: title, slug, content_type, body, metadata, published status
  - RLS policies: public read for published, admin edit
  
  ### 3. Audit Logs Table
  - Track all admin actions across all tables
  - Fields: user_id, action, table_name, record_id, old_values, new_values
  - RLS policy: superadmin only access
  
  ### 4. Helper Functions
  - is_superadmin(): Check if user has superadmin role
  - is_admin_or_above(): Check if user is admin, editor, or superadmin
  - log_audit_event(): Manual audit logging function
*/

-- Create role enum type
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'support', 'editor', 'admin', 'superadmin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add role column to profiles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN role user_role DEFAULT 'user'::user_role;
  END IF;
END $$;

-- Migrate existing user_roles data to profiles.role column
-- Take the highest priority role if user has multiple
DO $$
DECLARE
  user_record RECORD;
  highest_role TEXT;
BEGIN
  FOR user_record IN 
    SELECT DISTINCT user_id FROM public.user_roles
  LOOP
    -- Determine highest role for this user
    SELECT role INTO highest_role
    FROM public.user_roles
    WHERE user_id = user_record.user_id
    ORDER BY 
      CASE role
        WHEN 'superadmin' THEN 5
        WHEN 'admin' THEN 4
        WHEN 'editor' THEN 3
        WHEN 'support' THEN 2
        ELSE 1
      END DESC
    LIMIT 1;
    
    -- Update profiles table
    UPDATE public.profiles
    SET role = highest_role::user_role
    WHERE id = user_record.user_id;
  END LOOP;
END $$;

-- Create content_blocks table
CREATE TABLE IF NOT EXISTS public.content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'page',
  body TEXT,
  excerpt TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published content"
  ON public.content_blocks FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins and editors can view all content"
  ON public.content_blocks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor', 'superadmin')
    )
  );

CREATE POLICY "Editors and admins can insert content"
  ON public.content_blocks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor', 'superadmin')
    )
  );

CREATE POLICY "Editors and admins can update content"
  ON public.content_blocks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor', 'superadmin')
    )
  );

CREATE POLICY "Admins and superadmins can delete content"
  ON public.content_blocks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Superadmins can view all audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'superadmin'
    )
  );

CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- Helper function: Check if user is superadmin
CREATE OR REPLACE FUNCTION public.is_superadmin(_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND role = 'superadmin'
  )
$$;

-- Helper function: Check if user is admin or above (admin, editor, superadmin)
CREATE OR REPLACE FUNCTION public.is_admin_or_above(_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id 
    AND role IN ('admin', 'editor', 'superadmin')
  )
$$;

-- Helper function: Check specific role
CREATE OR REPLACE FUNCTION public.has_role_new(_user_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND role::text = _role
  )
$$;

-- Function to manually log audit events
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_action TEXT,
  p_table_name TEXT,
  p_record_id UUID,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_audit_id UUID;
  v_user_email TEXT;
BEGIN
  -- Get user email
  SELECT email INTO v_user_email
  FROM public.profiles
  WHERE id = auth.uid();

  -- Insert audit log
  INSERT INTO public.audit_logs (
    user_id,
    user_email,
    action,
    table_name,
    record_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    v_user_email,
    p_action,
    p_table_name,
    p_record_id,
    p_old_values,
    p_new_values
  ) RETURNING id INTO v_audit_id;

  RETURN v_audit_id;
END;
$$;

-- Update products RLS policies to use new role system
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

CREATE POLICY "Admins and editors can insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Admins and editors can update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Admins and superadmins can delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

-- Update orders RLS policies to use new role system
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Support can view all orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('support', 'admin', 'superadmin')
    )
  );

CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_above(auth.uid()));

-- Update user_roles policies (keep table for backward compatibility but deprecate)
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;

-- Grant superadmins full access to profiles for role management
CREATE POLICY "Superadmins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_superadmin(auth.uid()));

CREATE POLICY "Superadmins can update all profiles"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_superadmin(auth.uid()));
