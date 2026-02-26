/*
  # Fix user_profiles RLS policies

  This migration ensures user_profiles table has the correct RLS policies.
  We'll clean up and recreate the policies from scratch.
*/

-- First, let's disable RLS temporarily to ensure data can be saved
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Remove all existing policies
DROP POLICY IF EXISTS "user_profiles_public_read" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_auth_insert" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_auth_update" ON user_profiles;
DROP POLICY IF EXISTS "Public read user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Policy 1: Anyone can SELECT/read all profiles
CREATE POLICY "profiles_select"
  ON user_profiles
  FOR SELECT
  USING (true);

-- Policy 2: Authenticated users can INSERT their own profile
CREATE POLICY "profiles_insert"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id::text);

-- Policy 3: Authenticated users can UPDATE their own profile
CREATE POLICY "profiles_update"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- Ensure username index exists
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
