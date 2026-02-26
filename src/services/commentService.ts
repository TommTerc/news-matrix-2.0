import { supabase } from './supabaseClient';

export interface Comment {
  id: string;
  article_url: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: {
    email?: string;
    username?: string;
    display_name?: string;
  };
  username?: string;
  display_name?: string;
}

class CommentService {
  /**
   * Get all comments for an article
   */
  async getComments(articleUrl: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        id,
        article_url,
        user_id,
        content,
        created_at,
        updated_at,
        user_profiles!user_id (
          username,
          display_name
        )
      `)
      .eq('article_url', articleUrl)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      return [];
    }

    // Transform data to include user profile fields at top level
    return (data || []).map((comment: any) => ({
      ...comment,
      username: comment.user_profiles?.username || 'Anonymous',
      display_name: comment.user_profiles?.display_name
    }));
  }

  /**
   * Add a comment to an article
   */
  async addComment(articleUrl: string, content: string): Promise<Comment | null> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('User not authenticated');
      return null;
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({
        article_url: articleUrl,
        user_id: user.id,
        content
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding comment:', error);
      return null;
    }

    return data;
  }

  /**
   * Delete a comment
   */
  async deleteComment(commentId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('User not authenticated');
      return false;
    }

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting comment:', error);
      return false;
    }

    return true;
  }

  /**
   * Update a comment
   */
  async updateComment(commentId: string, content: string): Promise<Comment | null> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('User not authenticated');
      return null;
    }

    const { data, error } = await supabase
      .from('comments')
      .update({
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating comment:', error);
      return null;
    }

    return data;
  }
}

export default new CommentService();
