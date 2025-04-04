/*
  # Create trending topics table

  1. New Tables
    - `trending_topics`
      - `id` (uuid, primary key)
      - `name` (text)
      - `tweet_count` (integer)
      - `category` (text)
      - `source` (text)
      - `timestamp` (timestamptz)
  2. Security
    - Enable RLS on `trending_topics` table
    - Add policy for authenticated users to read data
*/

CREATE TABLE IF NOT EXISTS trending_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tweet_count integer NOT NULL DEFAULT 0,
  category text NOT NULL,
  source text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE trending_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read trending topics"
  ON trending_topics
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only authenticated users can insert trending topics"
  ON trending_topics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);