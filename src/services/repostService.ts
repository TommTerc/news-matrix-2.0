import { supabase } from './supabaseClient';
import activityLogService from './activityLogService';

export interface Repost {
  id: string;
  user_id: string;
  article_url: string;
  article_title?: string;
  article_description?: string;
  article_image?: string;
  article_source?: string;
  repost_caption?: string;
  created_at: string;
  user?: {
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
}

class RepostService {
  /**
   * Repost an article
   * Ensures article metadata is properly captured
   */
  async repostArticle(
    articleUrl: string,
    articleData: {
      title: string;
      description?: string;
      image?: string;
      source?: string;
    },
    caption?: string
  ): Promise<Repost | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not authenticated');
      return null;
    }

    // Ensure metadata is captured - use provided data or fallback
    const metadata = {
      title: articleData.title || 'Shared Article',
      description: articleData.description || '',
      image: articleData.image || null, // Can be null if not available
      source: articleData.source || 'Unknown Source'
    };

    const { data, error } = await supabase
      .from('user_reposts')
      .insert({
        user_id: user.id,
        article_url: articleUrl,
        article_title: metadata.title,
        article_description: metadata.description,
        article_image: metadata.image,
        article_source: metadata.source,
        repost_caption: caption || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error reposting article:', error);
      return null;
    }

    // Log the repost activity
    await activityLogService.logActivity({
      action: 'repost_article',
      resourceType: 'article',
      resourceId: articleUrl,
      metadata: { caption, ...metadata }
    });

    return data;
  }

  /**
   * Check if user has reposted an article
   */
  async hasReposted(articleUrl: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('user_reposts')
      .select('id')
      .eq('user_id', user.id)
      .eq('article_url', articleUrl)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking repost:', error);
    }
    return !!data;
  }

  /**
   * Get user's reposts
   */
  async getUserReposts(userId: string): Promise<Repost[]> {
    const { data, error } = await supabase
      .from('user_reposts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user reposts:', error);
      return [];
    }

    // Fetch user profile for the reposts owner
    if (data && data.length > 0) {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, username, display_name, avatar_url')
        .eq('id', userId)
        .single();

      if (!profileError && profile) {
        return (data || []).map((repost: any) => ({
          ...repost,
          user: {
            username: profile.username || 'Anonymous',
            display_name: profile.display_name,
            avatar_url: profile.avatar_url
          }
        }));
      }
    }

    return data || [];
  }

  /**
   * Get reposts from users that current user follows
   */
  async getFollowingReposts(): Promise<Repost[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Get users that current user follows
    const { data: followingIds, error: followError } = await supabase
      .from('user_follows')
      .select('following_id')
      .eq('follower_id', user.id);

    if (followError || !followingIds || followingIds.length === 0) {
      return [];
    }

    const ids = followingIds.map(f => f.following_id);

    // Get reposts from those users
    const { data, error } = await supabase
      .from('user_reposts')
      .select('*')
      .in('user_id', ids)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching following reposts:', error);
      return [];
    }

    // Enhance reposts with user profile data
    if (data && data.length > 0) {
      const userIds = [...new Set(data.map(r => r.user_id))];
      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, username, display_name, avatar_url')
        .in('id', userIds);

      if (!profileError && profiles) {
        const profileMap = new Map(profiles.map((p: any) => [p.id, p]));

        return (data || []).map((repost: any) => {
          const profile = profileMap.get(repost.user_id);
          return {
            ...repost,
            user: {
              username: profile?.username || 'Anonymous',
              display_name: profile?.display_name,
              avatar_url: profile?.avatar_url
            }
          };
        });
      }
    }

    return data || [];
  }

  /**
   * Delete a repost
   */
  async deleteRepost(articleUrl: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('user_reposts')
      .delete()
      .eq('user_id', user.id)
      .eq('article_url', articleUrl);

    if (error) {
      console.error('Error deleting repost:', error);
      return false;
    }

    return true;
  }

  /**
   * Get repost count for an article
   */
  async getRepostCount(articleUrl: string): Promise<number> {
    const { count, error } = await supabase
      .from('user_reposts')
      .select('*', { count: 'exact', head: true })
      .eq('article_url', articleUrl);

    if (error) {
      console.error('Error getting repost count:', error);
      return 0;
    }
    return count || 0;
  }
}

export default new RepostService();
