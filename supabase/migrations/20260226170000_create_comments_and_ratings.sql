/*
  # Create comments and truth_ratings tables for story tracking

  1. New Tables
    - `comments`
      - `id` (uuid, primary key)
      - `article_url` (text - unique identifier for the article)
      - `user_id` (uuid, foreign key to auth.users)
      - `content` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `truth_ratings`
      - `id` (uuid, primary key)
      - `article_url` (text - unique identifier for the article)
      - `user_id` (uuid, foreign key to auth.users)
      - `rating` (integer - 1 for thumbs up/truthful, -1 for thumbs down/misleading, 0 for abstain)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - Unique constraint on article_url + user_id to prevent duplicate ratings

  2. Security
    - Enable RLS on both tables
    - Anyone can read ratings and comments
    - Only authenticated users can create their own comments/ratings
*/

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_url text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments"
  ON comments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create their own comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_comments_article_url ON comments(article_url);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);

-- Truth ratings table
CREATE TABLE IF NOT EXISTS truth_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_url text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating IN (-1, 0, 1)),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(article_url, user_id)
);

ALTER TABLE truth_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read truth ratings"
  ON truth_ratings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own ratings"
  ON truth_ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
  ON truth_ratings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings"
  ON truth_ratings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_truth_ratings_article_url ON truth_ratings(article_url);
CREATE INDEX IF NOT EXISTS idx_truth_ratings_user_id ON truth_ratings(user_id);
