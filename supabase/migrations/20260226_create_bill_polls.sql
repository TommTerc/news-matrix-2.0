/*
  # Create bill polls table for user voting

  1. New Tables
    - `bill_polls`
      - `id` (uuid, primary key)
      - `bill_congress` (integer)
      - `bill_type` (text - 'hr', 's', etc)
      - `bill_number` (integer)
      - `user_id` (uuid, foreign key to auth.users)
      - `vote_type` (text - 'support', 'oppose', 'abstain')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `bill_polls` table
    - Users can only read all polls but only manage their own votes
*/

CREATE TABLE IF NOT EXISTS bill_polls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_congress integer NOT NULL,
  bill_type text NOT NULL,
  bill_number integer NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vote_type text NOT NULL CHECK (vote_type IN ('support', 'oppose', 'abstain')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(bill_congress, bill_type, bill_number, user_id)
);

ALTER TABLE bill_polls ENABLE ROW LEVEL SECURITY;

-- Anyone can read all polls
CREATE POLICY "Anyone can read bill polls"
  ON bill_polls
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can insert their own votes
CREATE POLICY "Users can insert their own votes"
  ON bill_polls
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own votes
CREATE POLICY "Users can update their own votes"
  ON bill_polls
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own votes
CREATE POLICY "Users can delete their own votes"
  ON bill_polls
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bill_polls_bill ON bill_polls(bill_congress, bill_type, bill_number);
CREATE INDEX IF NOT EXISTS idx_bill_polls_user ON bill_polls(user_id);
