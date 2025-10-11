/*
  # Fix role-related functions
  
  This migration removes the old has_role function that references
  the deleted user_roles table and keeps only the correct one.
  
  1. Changes
    - Drop old has_role function that uses user_roles table
    - Rename has_role_new to has_role for consistency
*/

-- Drop the old function that references user_roles
DROP FUNCTION IF EXISTS has_role(uuid, text);

-- Rename the new function to the standard name
DROP FUNCTION IF EXISTS has_role_new(uuid, text);

-- Create the correct has_role function using profiles table
CREATE OR REPLACE FUNCTION has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND role::text = _role
  )
$$;
