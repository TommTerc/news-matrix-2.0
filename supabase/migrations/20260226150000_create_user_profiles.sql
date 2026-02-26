/*
  # Set up user_profiles table RLS policies

  The user_profiles table exists but may not have proper RLS policies.
  This migration ensures authenticated users can read and update their own profiles.
*/

-- Only enable RLS (don't drop policies, let them be created fresh)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for reading profiles (public can see all profiles)
CREATE POLICY IF NOT EXISTS "user_profiles_public_read"
  ON user_profiles FOR SELECT
  USING (true);

-- Create policy for insert (authenticated users can insert their own)
CREATE POLICY IF NOT EXISTS "user_profiles_auth_insert"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create policy for update (authenticated users can update their own)
CREATE POLICY IF NOT EXISTS "user_profiles_auth_update"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure index exists
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
