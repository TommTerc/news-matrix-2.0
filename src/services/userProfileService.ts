import { supabase } from './supabaseClient';

export interface UserProfile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  cover_image_url: string | null;
  website: string | null;
  location: string | null;
  is_verified?: boolean;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
}

class UserProfileService {
  /**
   * Get user profile by user ID
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
    }
    return data || null;
  }

  /**
   * Get user profile by username
   */
  async getProfileByUsername(username: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
    }
    return data || null;
  }

  /**
   * Create or update user profile
   */
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating profile - Error Details:', error);
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
        return null;
      }
      
      console.log('Profile updated successfully:', data);
      return data;
    } catch (err) {
      console.error('Exception in updateProfile:', err);
      return null;
    }
  }

  /**
   * Check if username is available
   */
  async isUsernameAvailable(username: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('username', username)
      .single();

    if (error && error.code === 'PGRST116') return true; // Not found = available
    return !data;
  }
}

export default new UserProfileService();
