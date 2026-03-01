/*
  # Ensure user_profiles table email column

  Ensures the email column exists and is properly configured
  in the user_profiles table with NOT NULL constraint.
*/

-- Add email column if it doesn't exist
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS email text;

-- Set NOT NULL constraint on email (with migration for existing nulls)
-- First, we need to handle any existing NULL emails by setting them from auth.users
DO $$
BEGIN
  -- Update any NULL emails from the auth.users table
  UPDATE user_profiles up
  SET email = au.email
  FROM auth.users au
  WHERE up.id = au.id AND up.email IS NULL;
  
  -- Now add the NOT NULL constraint
  ALTER TABLE user_profiles ALTER COLUMN email SET NOT NULL;
EXCEPTION WHEN OTHERS THEN
  -- If constraint already exists, that's fine
  NULL;
END
$$;

-- Create index on email if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
