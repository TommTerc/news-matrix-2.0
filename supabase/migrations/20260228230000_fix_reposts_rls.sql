-- Fix RLS policies for user_reposts table to allow PostgREST access

-- Grant table access to PostgREST
ALTER TABLE user_reposts OWNER TO postgres;
GRANT ALL ON user_reposts TO postgres, anon, authenticated, service_role;

-- Enable RLS with force
ALTER TABLE user_reposts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reposts FORCE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Public can read reposts" ON user_reposts;
DROP POLICY IF EXISTS "Users can repost articles" ON user_reposts;
DROP POLICY IF EXISTS "Users can delete own reposts" ON user_reposts;
DROP POLICY IF EXISTS "Users can update own reposts" ON user_reposts;
DROP POLICY IF EXISTS "Enable read access for all users" ON user_reposts;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_reposts;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON user_reposts;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON user_reposts;

-- Create fresh, simple policies that work with PostgREST
CREATE POLICY "reposts_select_all"
  ON user_reposts FOR SELECT
  USING (true);

CREATE POLICY "reposts_insert_own"
  ON user_reposts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reposts_update_own"
  ON user_reposts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reposts_delete_own"
  ON user_reposts FOR DELETE
  USING (auth.uid() = user_id);
