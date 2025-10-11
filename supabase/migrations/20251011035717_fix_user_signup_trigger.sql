/*
  # Fix user signup trigger to use profiles.role column
  
  This migration updates the handle_new_user function to set the role
  in the profiles table instead of trying to insert into the deleted
  user_roles table.
  
  1. Changes
    - Update handle_new_user function to set role='user' in profiles table
    - Remove reference to user_roles table
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user'::user_role
  );

  RETURN NEW;
END;
$$;
