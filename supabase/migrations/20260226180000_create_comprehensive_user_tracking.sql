/*
  # Comprehensive User Tracking System - NEW TABLES ONLY

  Creates tables for tracking all user interactions across the platform:
  - Article interactions (bookmarks, reads, likes, shares)
  - Social interactions (follows, user posts)
  - Engagement metrics and notifications
  
  NOTE: user_profiles table excluded (already exists)
*/

-- ============= ARTICLE BOOKMARKS =============
CREATE TABLE IF NOT EXISTS article_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_url text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(article_url, user_id)
);

ALTER TABLE article_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own bookmarks"
  ON article_bookmarks FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can bookmark articles"
  ON article_bookmarks FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove bookmarks"
  ON article_bookmarks FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_article_bookmarks_user_id ON article_bookmarks(user_id);
CREATE INDEX idx_article_bookmarks_article_url ON article_bookmarks(article_url);

-- ============= ARTICLE READS/TRACKING =============
CREATE TABLE IF NOT EXISTS article_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_url text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  read_duration_seconds integer DEFAULT 0,
  scroll_depth_percent integer DEFAULT 0,
  completed boolean DEFAULT false,
  first_read_at timestamp with time zone DEFAULT now(),
  last_read_at timestamp with time zone DEFAULT now()
);

ALTER TABLE article_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own reading history"
  ON article_reads FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can track own reads"
  ON article_reads FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reads"
  ON article_reads FOR UPDATE
  TO authenticated USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_article_reads_user_id ON article_reads(user_id);
CREATE INDEX idx_article_reads_article_url ON article_reads(article_url);

-- ============= ARTICLE LIKES =============
CREATE TABLE IF NOT EXISTS article_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_url text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(article_url, user_id)
);

ALTER TABLE article_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read article likes"
  ON article_likes FOR SELECT
  TO public USING (true);

CREATE POLICY "Users can like articles"
  ON article_likes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike articles"
  ON article_likes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_article_likes_article_url ON article_likes(article_url);
CREATE INDEX idx_article_likes_user_id ON article_likes(user_id);

-- ============= ARTICLE SHARES =============
CREATE TABLE IF NOT EXISTS article_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_url text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  share_platform text DEFAULT 'internal', -- 'twitter', 'facebook', 'internal', 'email'
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE article_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read share counts"
  ON article_shares FOR SELECT
  TO public USING (true);

CREATE POLICY "Users can share articles"
  ON article_shares FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_article_shares_article_url ON article_shares(article_url);
CREATE INDEX idx_article_shares_user_id ON article_shares(user_id);

-- ============= COMMENT LIKES =============
CREATE TABLE IF NOT EXISTS comment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read comment likes"
  ON comment_likes FOR SELECT
  TO public USING (true);

CREATE POLICY "Users can like comments"
  ON comment_likes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike comments"
  ON comment_likes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX idx_comment_likes_user_id ON comment_likes(user_id);

-- ============= USER FOLLOWS =============
CREATE TABLE IF NOT EXISTS user_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can see follow relationships"
  ON user_follows FOR SELECT
  TO public USING (true);

CREATE POLICY "Users can follow others"
  ON user_follows FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON user_follows FOR DELETE
  TO authenticated USING (auth.uid() = follower_id);

CREATE INDEX idx_user_follows_follower_id ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following_id ON user_follows(following_id);

-- ============= USER POSTS (Studio/UGC) =============
CREATE TABLE IF NOT EXISTS user_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  image_url text,
  category text,
  tags text[], -- Array of tags
  is_published boolean DEFAULT false,
  view_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  published_at timestamp with time zone
);

ALTER TABLE user_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published posts"
  ON user_posts FOR SELECT
  TO public USING (is_published = true);

CREATE POLICY "Authenticated can read all posts"
  ON user_posts FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Users can create posts"
  ON user_posts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON user_posts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON user_posts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_user_posts_user_id ON user_posts(user_id);
CREATE INDEX idx_user_posts_published ON user_posts(is_published);
CREATE INDEX idx_user_posts_created_at ON user_posts(created_at);

-- ============= NOTIFICATIONS =============
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES auth.users(id) ON DELETE CASCADE, -- User who triggered the notification
  type text NOT NULL, -- 'comment', 'like', 'share', 'follow', 'mention', etc
  related_type text, -- 'article', 'comment', 'post', etc
  related_id text, -- URL or ID of related object
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  read_at timestamp with time zone
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ============= USER ACTIVITY LOG =============
CREATE TABLE IF NOT EXISTS user_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL, -- 'view_article', 'bookmark', 'comment', 'vote', 'follow', etc
  resource_type text, -- 'article', 'comment', 'user', etc
  resource_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own activity"
  ON user_activity_log FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "System can log activity"
  ON user_activity_log FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE INDEX idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX idx_user_activity_log_action ON user_activity_log(action);
CREATE INDEX idx_user_activity_log_created_at ON user_activity_log(created_at);

-- ============= ENGAGEMENT METRICS (Aggregated) =============
CREATE TABLE IF NOT EXISTS article_engagement_metrics (
  article_url text PRIMARY KEY,
  view_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  share_count integer DEFAULT 0,
  bookmark_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  unique_readers integer DEFAULT 0,
  average_read_time_seconds integer DEFAULT 0,
  last_updated timestamp with time zone DEFAULT now()
);

ALTER TABLE article_engagement_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read engagement metrics"
  ON article_engagement_metrics FOR SELECT
  TO public USING (true);

-- ============= RLS for auth.users (if needed) =============
-- Note: auth.users is managed by Supabase, but we can view user info through our user_profiles table
