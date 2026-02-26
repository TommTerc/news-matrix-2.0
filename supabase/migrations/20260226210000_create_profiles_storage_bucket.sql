/*
  # Create profiles storage bucket

  Creates a storage bucket for user profile avatars and images.
  Sets up RLS policies to allow authenticated users to upload and read their own files.
*/

-- Create the profiles bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profiles',
  'profiles',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects;
DROP POLICY IF EXISTS "avatars_authenticated_upload" ON storage.objects;
DROP POLICY IF EXISTS "avatars_user_delete" ON storage.objects;

-- Public can read profile images
CREATE POLICY "avatars_public_read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'profiles');

-- Authenticated users can upload avatars
CREATE POLICY "avatars_authenticated_upload"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'profiles');

-- Users can delete their own uploads
CREATE POLICY "avatars_user_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'profiles' AND owner = auth.uid());
