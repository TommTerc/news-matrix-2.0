import { supabase } from './supabaseClient';
class ActivityLogService {
    /**
     * Log user action
     */
    async logActivity(entry) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user)
            return false;
        const { error } = await supabase
            .from('user_activity_log')
            .insert({
            user_id: user.id,
            action: entry.action,
            resource_type: entry.resourceType,
            resource_id: entry.resourceId,
            metadata: entry.metadata || {},
            created_at: new Date().toISOString()
        });
        if (error) {
            console.error('Error logging activity:', error);
            return false;
        }
        return true;
    }
    /**
     * Get user activity log
     */
    async getUserActivity(limit = 50) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user)
            return [];
        const { data, error } = await supabase
            .from('user_activity_log')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error) {
            console.error('Error fetching activity log:', error);
            return [];
        }
        return data || [];
    }
    /**
     * Utility functions for specific actions
     */
    async logArticleView(articleUrl) {
        return this.logActivity({
            action: 'view_article',
            resourceType: 'article',
            resourceId: articleUrl
        });
    }
    async logArticleBookmark(articleUrl) {
        return this.logActivity({
            action: 'bookmark_article',
            resourceType: 'article',
            resourceId: articleUrl
        });
    }
    async logArticleShare(articleUrl, platform = 'internal') {
        return this.logActivity({
            action: 'share_article',
            resourceType: 'article',
            resourceId: articleUrl,
            metadata: { platform }
        });
    }
    async logArticleLike(articleUrl) {
        return this.logActivity({
            action: 'like_article',
            resourceType: 'article',
            resourceId: articleUrl
        });
    }
    async logCommentCreate(articleUrl, commentId) {
        return this.logActivity({
            action: 'create_comment',
            resourceType: 'comment',
            resourceId: commentId,
            metadata: { articleUrl }
        });
    }
    async logTruthRating(articleUrl, rating) {
        return this.logActivity({
            action: 'rate_truth',
            resourceType: 'article',
            resourceId: articleUrl,
            metadata: { rating }
        });
    }
    async logBillVote(billData, vote) {
        return this.logActivity({
            action: 'vote_bill',
            resourceType: 'bill',
            resourceId: billData,
            metadata: { vote }
        });
    }
    async logUserFollow(followingId) {
        return this.logActivity({
            action: 'follow_user',
            resourceType: 'user',
            resourceId: followingId
        });
    }
    async logPostCreate(postId) {
        return this.logActivity({
            action: 'create_post',
            resourceType: 'post',
            resourceId: postId
        });
    }
}
export default new ActivityLogService();
