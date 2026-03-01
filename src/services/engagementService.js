import { supabase } from './supabaseClient';
class EngagementService {
    /**
     * Track article like
     */
    async likeArticle(articleUrl) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user)
            return false;
        const { error } = await supabase
            .from('article_likes')
            .insert({
            article_url: articleUrl,
            user_id: user.id
        });
        if (error) {
            console.error('Error liking article:', error);
            return false;
        }
        return true;
    }
    /**
     * Remove article like
     */
    async unlikeArticle(articleUrl) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user)
            return false;
        const { error } = await supabase
            .from('article_likes')
            .delete()
            .eq('article_url', articleUrl)
            .eq('user_id', user.id);
        if (error) {
            console.error('Error unliking article:', error);
            return false;
        }
        return true;
    }
    /**
     * Check if user liked an article
     */
    async hasLiked(articleUrl) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user)
            return false;
        const { data } = await supabase
            .from('article_likes')
            .select('id')
            .eq('article_url', articleUrl)
            .eq('user_id', user.id)
            .single();
        return !!data;
    }
    /**
     * Get like count for an article
     */
    async getLikeCount(articleUrl) {
        const { count, error } = await supabase
            .from('article_likes')
            .select('*', { count: 'exact', head: true })
            .eq('article_url', articleUrl);
        if (error) {
            console.error('Error getting like count:', error);
            return 0;
        }
        return count || 0;
    }
    /**
     * Track article share
     */
    async shareArticle(articleUrl, platform = 'internal') {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user)
            return false;
        const { error } = await supabase
            .from('article_shares')
            .insert({
            article_url: articleUrl,
            user_id: user.id,
            share_platform: platform
        });
        if (error) {
            console.error('Error sharing article:', error);
            return false;
        }
        return true;
    }
    /**
     * Get share count for an article
     */
    async getShareCount(articleUrl) {
        const { count, error } = await supabase
            .from('article_shares')
            .select('*', { count: 'exact', head: true })
            .eq('article_url', articleUrl);
        if (error) {
            console.error('Error getting share count:', error);
            return 0;
        }
        return count || 0;
    }
    /**
     * Track article read/view
     */
    async trackArticleRead(articleUrl, readDuration = 0, scrollDepth = 0) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user)
            return false;
        // Check if already read
        const { data: existing } = await supabase
            .from('article_reads')
            .select('id')
            .eq('article_url', articleUrl)
            .eq('user_id', user.id)
            .single();
        if (existing) {
            // Update existing read
            const { error } = await supabase
                .from('article_reads')
                .update({
                read_duration_seconds: readDuration,
                scroll_depth_percent: Math.max(scrollDepth, 0),
                last_read_at: new Date().toISOString(),
                completed: scrollDepth >= 90
            })
                .eq('id', existing.id);
            if (error) {
                console.error('Error updating read:', error);
                return false;
            }
        }
        else {
            // Insert new read
            const { error } = await supabase
                .from('article_reads')
                .insert({
                article_url: articleUrl,
                user_id: user.id,
                read_duration_seconds: readDuration,
                scroll_depth_percent: scrollDepth,
                completed: scrollDepth >= 90
            });
            if (error) {
                console.error('Error tracking read:', error);
                return false;
            }
        }
        return true;
    }
    /**
     * Get reading time for an article
     */
    async getAverageReadTime(articleUrl) {
        const { data, error } = await supabase
            .from('article_reads')
            .select('read_duration_seconds')
            .eq('article_url', articleUrl)
            .gt('read_duration_seconds', 0);
        if (error || !data || data.length === 0)
            return 0;
        const total = data.reduce((sum, row) => sum + row.read_duration_seconds, 0);
        return Math.round(total / data.length);
    }
    /**
     * Like a comment
     */
    async likeComment(commentId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user)
            return false;
        const { error } = await supabase
            .from('comment_likes')
            .insert({
            comment_id: commentId,
            user_id: user.id
        });
        if (error) {
            console.error('Error liking comment:', error);
            return false;
        }
        return true;
    }
    /**
     * Unlike a comment
     */
    async unlikeComment(commentId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user)
            return false;
        const { error } = await supabase
            .from('comment_likes')
            .delete()
            .eq('comment_id', commentId)
            .eq('user_id', user.id);
        if (error) {
            console.error('Error unliking comment:', error);
            return false;
        }
        return true;
    }
    /**
     * Get like count for a comment
     */
    async getCommentLikeCount(commentId) {
        const { count, error } = await supabase
            .from('comment_likes')
            .select('*', { count: 'exact', head: true })
            .eq('comment_id', commentId);
        if (error) {
            console.error('Error getting comment like count:', error);
            return 0;
        }
        return count || 0;
    }
}
export default new EngagementService();
