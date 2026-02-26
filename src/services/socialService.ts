import { supabase } from './supabaseClient';

class SocialService {
  /**
   * Follow a user
   */
  async followUser(followingId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id === followingId) return false;

    const { error } = await supabase
      .from('user_follows')
      .insert({
        follower_id: user.id,
        following_id: followingId
      });

    if (error) {
      console.error('Error following user:', error);
      return false;
    }
    return true;
  }

  /**
   * Unfollow a user
   */
  async unfollowUser(followingId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('user_follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', followingId);

    if (error) {
      console.error('Error unfollowing user:', error);
      return false;
    }
    return true;
  }

  /**
   * Check if following a user
   */
  async isFollowing(followingId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
      .from('user_follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', followingId)
      .single();

    return !!data;
  }

  /**
   * Get follower count
   */
  async getFollowerCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('user_follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', userId);

    if (error) {
      console.error('Error getting follower count:', error);
      return 0;
    }
    return count || 0;
  }

  /**
   * Get following count
   */
  async getFollowingCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('user_follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', userId);

    if (error) {
      console.error('Error getting following count:', error);
      return 0;
    }
    return count || 0;
  }

  /**
   * Get followers list
   */
  async getFollowers(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('user_follows')
      .select(`
        user_profiles!follower_id (
          user_id,
          username,
          display_name,
          avatar_url
        )
      `)
      .eq('following_id', userId);

    if (error) {
      console.error('Error getting followers:', error);
      return [];
    }

    return data?.map(f => f.user_profiles) || [];
  }

  /**
   * Get following list (users this user follows)
   */
  async getFollowing(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('user_follows')
      .select(`
        user_profiles!following_id (
          user_id,
          username,
          display_name,
          avatar_url
        )
      `)
      .eq('follower_id', userId);

    if (error) {
      console.error('Error getting following:', error);
      return [];
    }

    return data?.map(f => f.user_profiles) || [];
  }
}

export default new SocialService();
