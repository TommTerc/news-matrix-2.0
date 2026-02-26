/*
  # Add missing columns to user_profiles table

  The user_profiles table exists but is missing several columns we need.
  This migration adds those columns.
*/

-- Add missing columns if they don't exist
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS cover_image_url text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Ensure username is unique if not already
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_username_unique ON user_profiles(username);
