/*
  # Create reposts table

  Allows users to repost (share) articles to their own profile
  for their followers to see.
*/

CREATE TABLE IF NOT EXISTS user_reposts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_url text NOT NULL,
  article_title text,
  article_description text,
  article_image text,
  article_source text,
  repost_caption text,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, article_url)
);

-- Grant table access to PostgREST
ALTER TABLE user_reposts OWNER TO postgres;
GRANT ALL ON user_reposts TO postgres, anon, authenticated, service_role;

-- Enable RLS
ALTER TABLE user_reposts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reposts FORCE ROW LEVEL SECURITY;

-- Disable existing policies if they exist
DROP POLICY IF EXISTS "Public can read reposts" ON user_reposts;
DROP POLICY IF EXISTS "Users can repost articles" ON user_reposts;
DROP POLICY IF EXISTS "Users can delete own reposts" ON user_reposts;
DROP POLICY IF EXISTS "Users can update own reposts" ON user_reposts;

-- Allow anyone to read all reposts
CREATE POLICY "Enable read access for all users"
  ON user_reposts FOR SELECT
  USING (true);

-- Allow authenticated users to insert their own reposts
CREATE POLICY "Enable insert for authenticated users"
  ON user_reposts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own reposts
CREATE POLICY "Enable update for authenticated users"
  ON user_reposts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to delete their own reposts
CREATE POLICY "Enable delete for authenticated users"
  ON user_reposts FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_reposts_user_id ON user_reposts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reposts_article_url ON user_reposts(article_url);
CREATE INDEX IF NOT EXISTS idx_user_reposts_created_at ON user_reposts(created_at);
