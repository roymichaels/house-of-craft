/*
  # Drop user_roles table
  
  This migration removes the redundant user_roles table since we're using
  the role column in the profiles table as the single source of truth.
  
  1. Changes
    - Drop user_roles table and all associated policies
    - Role management will be done exclusively through profiles.role column
*/

DROP TABLE IF EXISTS user_roles CASCADE;
