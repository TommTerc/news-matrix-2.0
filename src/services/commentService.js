import { supabase } from './supabaseClient';
class CommentService {
    /**
     * Get all comments for an article
     */
    async getComments(articleUrl) {
        console.log('Fetching comments for article:', articleUrl);
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('article_url', articleUrl)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching comments:', error);
            console.error('Error code:', error.code);
            console.error('Article URL:', articleUrl);
            return [];
        }
        // Fetch user profiles for the comments
        if (data && data.length > 0) {
            const userIds = [...new Set(data.map((c) => c.user_id))];
            const { data: profiles, error: profileError } = await supabase
                .from('user_profiles')
                .select('id, username, display_name')
                .in('id', userIds);
            if (!profileError && profiles) {
                const profileMap = new Map(profiles.map((p) => [p.id, p]));
                // Transform data to include user profile fields
                return (data || []).map((comment) => {
                    const profile = profileMap.get(comment.user_id);
                    return {
                        ...comment,
                        username: profile?.username || 'Anonymous',
                        display_name: profile?.display_name
                    };
                });
            }
        }
        return data || [];
    }
    /**
     * Add a comment to an article
     */
    async addComment(articleUrl, content) {
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
    async deleteComment(commentId) {
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
    async updateComment(commentId, content) {
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
    /**
     * Get all comments by current user
     */
    async getUserComments() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user)
            return [];
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching user comments:', error);
            return [];
        }
        // Fetch user profile for the current user
        if (data && data.length > 0) {
            const { data: profile, error: profileError } = await supabase
                .from('user_profiles')
                .select('id, username, display_name')
                .eq('id', user.id)
                .single();
            if (!profileError && profile) {
                // Transform data to include user profile fields at top level
                return (data || []).map((comment) => ({
                    ...comment,
                    username: profile.username || 'Anonymous',
                    display_name: profile.display_name
                }));
            }
        }
        return data || [];
    }
}
export default new CommentService();
